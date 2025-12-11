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
import { delayed, Vector3 } from '@gollilla/keystone';

class Airride extends Weapon {
  // 静的な数値の定義
  private static DURATION = 5*20;
  private static COOLDOWN = 18*20;
  private static SLOW_FALLING = 25;
  private static FLAP_RECOVERY = 12;

  typeId = 'bmc:airride';

  // プロパティキーの定義
  private flapKey = this.tempDataKey('flap');

  override onClick(player: Player): WeaponTicks {
    // 羽ばたきのフラグを消す
    player.setDynamicProperty(this.flapKey);

    // 視点方向のベクトルを正規化
    const v = Vector3.fromBDS(player.getViewDirection()).normalize();
    // 任意に倍率調整をする
    v.x *= 0.75;
    v.z *= 0.75;
    v.y = 0.995;
    // 内部で計算されている速度を消す
    player.clearVelocity();
    // プレイヤーに適応
    player.applyImpulse(v);

    // 効果音
    player.dimension.playSound('mob.ghast.charge', player.location);

    // 効果継続時間とクールダウン
    return { duration: Airride.DURATION, cooldown: Airride.COOLDOWN };
  }

  override onSneaking(player: Player) {
    // 羽ばたきクールダウンの判定処理
    const canFlap = player.getDynamicProperty(this.flapKey) ?? true;
    // 羽ばたけなければここで処理を終わらせる
    if (!canFlap) return;

    // 羽ばたきベクトルを付与
    player.clearVelocity();
    const v = Vector3.fromBDS(player.getViewDirection()).normalize();
    v.x *= 1.2;
    v.z *= 1.2;
    v.y = 1;
    player.applyImpulse(v);

    // 効果音
    player.dimension.playSound('mob.enderdragon.flap', player.location, { volume: 0.27, pitch: 1 });

    // パーティクルの生成
    const location = player.location;
    location.y -= 1;
    player.dimension.spawnParticle('minecraft:knockback_roar_particle', location);

    // 低速落下の付与
    player.addEffect('minecraft:slow_falling', Airride.SLOW_FALLING, { amplifier: 1 });

    // 羽ばたきのスパム防止のためフラグを立てて不可能にする
    player.setDynamicProperty(this.flapKey, false);

    // 数ティック後に設定値にnullを渡して動的プロパティを削除する
    delayed(
      Airride.FLAP_RECOVERY,
      () => player.setDynamicProperty(this.flapKey)
    );
  }

  override onEnd(player: Player): void {
    // 効果音
    player.dimension.playSound('mob.ghast.moan', player.location);
  }
}

// 登録
register(new Airride());
