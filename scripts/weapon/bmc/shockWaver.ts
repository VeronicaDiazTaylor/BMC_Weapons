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
import { Player } from '@minecraft/server';
import { register } from '../weaponRegistry';
import { Weapon, WeaponTicks } from '../weapon';
import { Vector3 } from 'keystonemc';
import { despawnAt, searchAt, spawnAt } from '../../entity/customEntity';

class ShockWaver extends Weapon {
  private static DURATION = 10*20;
  private static COOLDOWN = 8*20;

  typeId = 'bmc:shock_waver';

  private canSwingKey = this.tempDataKey('can_swing');

  override onClick(player: Player): WeaponTicks {
    // スイングデータを初期化
    player.setDynamicProperty(this.canSwingKey, true);

    // 投擲速度
    const velocity = Vector3.fromBDS(player.getViewDirection()).normalize();
    velocity.x *= 2.3;
    velocity.y = -0.06;
    velocity.z *= 2.3;

    // ビヘイビアーで定義したスライムのエレメントを召喚
    spawnAt('bmc:shock_waver_element', player, player.getHeadLocation(), velocity);

    // 効果音
    player.dimension.playSound('mob.vex.charge', player.location);

    return { duration: ShockWaver.DURATION, cooldown: ShockWaver.COOLDOWN };
  }

  override onArmSwing(player: Player): void {
    // スイングできなければ無視
    const canSwing = player.getDynamicProperty(this.canSwingKey) ?? true;
    if (!canSwing) return;

    // ワールドの中からスライムを探索
    const slime = searchAt('bmc:shock_waver_slime', player).shift(); 

    // スライムがいなければ処理を終了させる
    if (!slime) return;

    // 速度の付与
    const velocity = Vector3.fromBDS(player.getViewDirection()).normalize();
    velocity.x *= 2.75;
    velocity.y = 0.8;
    velocity.z *= 2.75;
    slime.applyImpulse(velocity);

    // スイングデータを初期化
    player.setDynamicProperty(this.canSwingKey, false);
  }

  override onEnd(player: Player): void {
    // 残留しているエレメント及びスライムを取得
    for (const typeId of ['bmc:shock_waver_slime', 'bmc:shock_waver_element']) {
      for (const entity of searchAt(typeId, player)) {
        despawnAt(entity);
      }
    }

    // プレイヤーに送る効果切れ効果音
    player.playSound('mob.vex.hurt');
  }
}

register(new ShockWaver());
