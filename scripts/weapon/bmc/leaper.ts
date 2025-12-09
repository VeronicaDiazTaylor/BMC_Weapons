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
import { Vector3 } from '@gollilla/keystone';

class Leaper extends Weapon {
  private static DURATION = 0;
  private static DEFAULT_COOLDOWN = 10*20;
  private static SHIFT_COOLDOWN = 8*20;

  typeId = 'bmc:leaper';

  override onClick(player: Player): WeaponTicks {
    // 視点方向のベクトルを正規化
    const v = Vector3.fromBDS(player.getViewDirection()).normalize();
    // スニークの判定
    const isSneaking = player.isSneaking;
    // 任意に倍率調整をする (ifは長いので三項演算子使います)
    v.x *= isSneaking ? 0.5 : 0.01;
    v.z *= isSneaking ? 0.5 : 0.01;
    v.y = isSneaking ? 0.8 : 2.5;
    // 内部で計算されている速度を消す
    player.clearVelocity();
    // プレイヤーに適応
    player.applyImpulse(v);

    return { 
      duration: Leaper.DURATION,
      cooldown: isSneaking ? Leaper.SHIFT_COOLDOWN : Leaper.DEFAULT_COOLDOWN
    };
  }
}

register(new Leaper());
