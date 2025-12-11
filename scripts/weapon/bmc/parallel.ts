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
import { Player, Vector3 as BDSVector3 } from '@minecraft/server';
import { register } from '../weaponRegistry';
import { Weapon, WeaponTicks } from '../weapon';
import { delayed, Vector3 } from '@gollilla/keystone';

class Parallel extends Weapon {
  private static DELAY_SOUND = 4; // 0.2s
  private static MAX_LAGGING = 2*20;
  private static ROAR_RANGE = 8;
  private static ROAR_BLIND = 2*20;

  typeId = 'bmc:parallel';

  private lastLocationKey = this.tempDataKey('last_location');
  private lastRotationKey = this.tempDataKey('last_rotation');

  override onClick(player: Player): WeaponTicks {
    // ひとつ前の座標を呼び出し
    const lastLocation = player.getDynamicProperty(this.lastLocationKey) as BDSVector3 | undefined;
    const lastRotation = player.getDynamicProperty(this.lastRotationKey) as BDSVector3 | undefined;

    // 交換する今の座標を取得
    const currentLocation = player.location;
    const rotation = player.getRotation();
    const currentRotation = Vector3.zero().add(rotation.x, rotation.y, 0);

    // 効果音
    delayed(Parallel.DELAY_SOUND, () => {
      player.dimension.playSound('mob.evocation_illager.prepare_summon', player.location, { volume: 0.85 });
    });

    // データの保存
    player.setDynamicProperty(this.lastLocationKey, currentLocation);
    player.setDynamicProperty(this.lastRotationKey, currentRotation);

    // 過去の座標データが存在しない場合はここで処理終わり
    if (!lastLocation) {
      return { duration: 0, cooldown: 1*20 };
    }

    // 周囲の敵へ喚きの盲目デバフを付与
    const playerV3 = Vector3.fromBDS(player.location);
    for (const nearPlayer of player.dimension.getPlayers( { excludeNames: [player.name] } )) {
      if (playerV3.distance(nearPlayer.location) <= Parallel.ROAR_RANGE) {
        nearPlayer.addEffect('minecraft:slowness', Parallel.ROAR_BLIND, { amplifier: 3 });
        nearPlayer.playSound('mob.endermen.scream', { volume: 0.85 });
      }
    }

    // 硬直時間の計算
    const distance = Vector3.fromBDS(player.location).distance(lastLocation);
    const lagging = Math.min((distance * 0.75), Parallel.MAX_LAGGING);

    // 首の向きの取り出し
    let yaw = 0;
    let pitch = 0;
    if (lastRotation) {
      yaw = lastRotation.x;
      pitch = lastRotation.y;
    }

    // テレポート
    player.teleport(lastLocation, { rotation: { x: yaw, y: pitch }, facingLocation: undefined });

    // パーティクル
    for (let i = 0; i < 3; ++i) {
      player.dimension.spawnParticle('minecraft:mob_portal', lastLocation);
    }

    // TODO:硬直

    return { duration: lagging, cooldown: 13*20 };
  }

  override onEnd(): void {
    // TODO:硬直を戻す
  }
}

// 登録
register(new Parallel());
