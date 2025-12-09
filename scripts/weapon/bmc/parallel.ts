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

class Parallel extends Weapon {
  private static DELAY_SOUND = 4; // 0.2s
  private static MAX_LAGGING = 2*20;
  private static ROAR_RANGE = 8;
  private static ROAR_BLIND = 2*20;

  typeId = 'bmc:parallel';

  override onClick(player: Player): WeaponTicks {
    // ひとつ前の座標を呼び出し
    const lastLocation = player.getDynamicProperty(`${Weapon.TEMP_DATA_PREFIX + this.typeId}:last_location`);
    const lastRotation = player.getDynamicProperty(`${Weapon.TEMP_DATA_PREFIX + this.typeId}:last_rotation`);

    // 交換する今の座標を取得
    const currentLocation = player.location;
    const rotation = player.getRotation();
    const currentRotation = Vector3.zero().add(rotation.x, rotation.y, 0);

    // 効果音
    delayed(Parallel.DELAY_SOUND, () => {
      player.dimension.playSound('mob.evocation_illager.prepare_summon', player.location, { volume: 0.85 });
    });

    // 過去の座標データが存在しない場合
    if (!(lastLocation instanceof Vector3)) {
      // データの保存
      player.setDynamicProperty(`${Weapon.TEMP_DATA_PREFIX + this.typeId}:last_location`, currentLocation);
      player.setDynamicProperty(`${Weapon.TEMP_DATA_PREFIX + this.typeId}:last_rotation`, currentRotation);

      // 処理終わり
      return { duration: 0, cooldown: 1*20 }; 
    }

    // 距離
    const distance = Vector3.fromBDS(player.location).distance(lastLocation);
    const lagging = Math.min((distance * 0.75), Parallel.MAX_LAGGING);

    // 首の向きの取り出し
    let yaw = 0;
    let pitch = 0;
    if (lastRotation instanceof Vector3) {
      yaw = lastRotation.x;
      pitch = lastRotation.y;
    }

    // テレポート
    player.teleport(lastLocation, { rotation: { x: yaw, y: pitch } });

    // パーティクル
    for (let i = 0; i < 3; ++i) {
      player.dimension.spawnParticle('minecraft:mob_portal', lastLocation);
    }

    // 硬直
    const movement = player.getComponent('minecraft:movement');
    if (movement) movement.setCurrentValue(0);

    // データの保存
    player.setDynamicProperty(`${Weapon.TEMP_DATA_PREFIX + this.typeId}:last_location`, currentLocation);
    player.setDynamicProperty(`${Weapon.TEMP_DATA_PREFIX + this.typeId}:last_rotation`, currentRotation);

    return { duration: lagging, cooldown: 13*20 };
  }

  override onEnd(player: Player): void {
    // 硬直を戻す
    const movement = player.getComponent('minecraft:movement');
    if (movement) movement.setCurrentValue(movement.defaultValue);
  }
}

// 登録
register(new Parallel());
