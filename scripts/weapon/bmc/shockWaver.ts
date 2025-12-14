/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *           _ _           _              _            
 * __   ____| (_) __ _ ___| |_ __ _ _   _| | ___  _ __ 
 * \ \ / / _` | |/ _` |_  / __/ _` | | | | |/ _ \| '__|
 *  \ V / (_| | | (_| |/ /| || (_| | |_| | | (_) | |   
 *   \_/ \__,_|_|\__,_/___|\__\__,_|\__, |_|\___/|_|   
 *                                  |___/                
 * 
 * @author vdiaztaylor
 * @website https://github.com/VeronicaDiazTaylor
 * 
 * NOTE:
 * このプログラムは非公式サーバーソフトウェアPocketMine-MPで稼働していたBowyersMCをScriptAPIに移植したものです。
 * ScriptAPIのビヘイビアー開発支援フレームワーク「Keystone」を用いているため、TypeScriptで書かれています。
 * 
 */
import { AABB, Entity, Player } from '@minecraft/server';
import { register } from '../weaponRegistry';
import { Weapon, WeaponTicks } from '../weapon';
import { Vector3 } from '@gollilla/keystone';

class ShockWaver extends Weapon {
  private static DURATION = 10*20;
  private static COOLDOWN = 8*20;
  private static SLOWNESS_DEBUFF = 5*20;

  typeId = 'bmc:shock_waver';

  private canSwingKey = this.tempDataKey('can_swing');
  private summonerKey = this.tempDataKey('slime_summoner_id');

  override onClick(player: Player): WeaponTicks {
    // スイングデータを初期化
    player.setDynamicProperty(this.canSwingKey, true);

    // ビヘイビアーで定義したスライムのエレメントを召喚 (as anyでIDEの構文エラーを回避)
    const slimeElement = player.dimension.spawnEntity('bmc:shock_waver_element' as any, player.getHeadLocation());

    // スライムのエレメントに付けるプロパティをここで設定
    slimeElement.setDynamicProperty(this.summonerKey, player.id);

    // 速度の付与
    const velocity = Vector3.fromBDS(player.getViewDirection()).normalize();
    velocity.x *= 2.3;
    velocity.y = -0.06;
    velocity.z *= 2.3;
    slimeElement.applyImpulse(velocity);

    // 効果音
    player.dimension.playSound('mob.vex.charge', player.location);

    return { duration: ShockWaver.DURATION, cooldown: ShockWaver.COOLDOWN };
  }

  override onArmSwing(player: Player): void {
    // スイングできなければ無視
    const canSwing = player.getDynamicProperty(this.canSwingKey) ?? true;
    if (!canSwing) return;

    // ワールドの中からスライムを探索
    const slime = player.dimension.getEntities({ type: 'bmc:shock_waver_slime' }).find((slime: Entity) => {
      return slime.getDynamicProperty(this.summonerKey) == player.id;
    });
    // スライムがいなければ処理を終了させる
    if (!slime) return;

    // 速度の付与
    const velocity = Vector3.fromBDS(player.getViewDirection()).normalize();
    velocity.x *= 2.5;
    velocity.y = 1;
    velocity.z *= 2.5;
    slime.applyImpulse(velocity);

    // スイングデータを初期化
    player.setDynamicProperty(this.canSwingKey, false);
  }

  override onTick(player: Player, isWeaponInHand: boolean, isActivated: boolean) {
    // 効果継続中じゃなければ処理しない
    if (!isActivated) return;

    // ワールドの中からスライムエレメントを探索
    const slimeElement = player.dimension.getEntities({ type: 'bmc:shock_waver_element' }).find((slime: Entity) => {
      return slime.getDynamicProperty(this.summonerKey) == player.id;
    });

    // エレメントが存在していたら
    if (slimeElement && slimeElement.isValid) {
      // y < -100で消滅
      if (slimeElement.location.y < -100) slimeElement.remove();

      // もし着弾していなければここで処理を終了
      if (!slimeElement.isOnGround) return;

      // エレメントをデスポーン
      const hitLocation = slimeElement.location;
      slimeElement.remove();

      // 巨大スライムを引き継がせて設置
      const slime = player.dimension.spawnEntity('bmc:shock_waver_slime' as any, hitLocation);
      slime.setDynamicProperty(this.summonerKey, player.id);
    }

    // ワールドの中からスライムを探索
    const slime = player.dimension.getEntities({ type: 'bmc:shock_waver_slime' }).find((slime: Entity) => {
      return slime.getDynamicProperty(this.summonerKey) == player.id;
    });

    // スライムがいなければ処理を終了させる
    if (!slime || !slime.isValid) return;

    // y < -100で消滅
    if (slime.location.y < -100) slime.remove();
    
    for (const p of slime.dimension.getPlayers()) {

      // 距離判断による衝突判定
      if (this.isIntersects(slime.getAABB(), p.getAABB())) {

        // 吹き飛ばし
        p.clearVelocity();
        const velocity = Vector3.fromBDS(p.location).subtractVector(slime.location).normalize();
        velocity.x *= 2.25;
        velocity.y = 0.95;
        velocity.z *= 2.25;
        p.applyImpulse(velocity);

        // 効果音
        p.dimension.playSound('item.trident.riptide_2', p.location);

        if (slime.getDynamicProperty(this.summonerKey) != p.id) {
          // 鈍足の付与
          p.addEffect('minecraft:slowness', ShockWaver.SLOWNESS_DEBUFF, { amplifier: 4 });
        }
      }
    }
  }

  override onEnd(player: Player): void {
    // 残留しているエレメント及びスライムを取得
    for (const entity of player.dimension.getEntities()) {
      if (entity.typeId === 'bmc:shock_waver_slime' || entity.typeId === 'bmc:shock_waver_element') {

        // 座標上で起こる効果音
        entity.dimension.playSound('mob.vex.hurt', entity.location);

        // デスポーンさせる
        entity.remove();
      }
    }

    // プレイヤーに送る効果切れ効果音
    player.playSound('mob.vex.hurt');
  }

  /**
   * 衝突したかどうか
   * @param a
   * @param b
   * @returns {boolean} 
   */
  private isIntersects(a: AABB, b: AABB): boolean {
    a.extent.x += 1.75;
    a.extent.y += 1.75;
    a.extent.z += 1.75;
    return (
      a.center.x - a.extent.x <= b.center.x + b.extent.x && 
      a.center.x + a.extent.x >= b.center.x - b.extent.x &&
      a.center.y - a.extent.y <= b.center.y + b.extent.y && 
      a.center.y + a.extent.y >= b.center.y - b.extent.y &&
      a.center.z - a.extent.z <= b.center.z + b.extent.z && 
      a.center.z + a.extent.z >= b.center.z - b.extent.z
    );
  }
}

register(new ShockWaver());
