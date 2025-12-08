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

class Bastet extends Weapon {
  static DURATION = 6*20;
  static COOLDOWM = 15*20;

  typeId = 'bmc:bastet';

  override onClick(player: Player): WeaponTicks {
    // 移動速度上昇の付与
    player.addEffect('minecraft:speed', Bastet.DURATION, { amplifier: 3 });

    // 効果音
    player.dimension.playSound('mob.cat.meow', player.location);

    // 効果継続時間とクールダウン
    return { duration: Bastet.DURATION, cooldown: Bastet.COOLDOWM };
  }

  override onArmSwing(player: Player) {
    // ブースト可能か判定処理
    const canBoost = player.getDynamicProperty(`weapon_data:${this.typeId}:boost`) ?? true;
    // ブーストできなければここで処理を終わらせる
    if (!canBoost) return;

    // ブーストのベクトルを付与
    const v = Vector3.fromBDS(player.getViewDirection()).normalize();
    // 任意に倍率調整をする
    v.x *= 1.3;
    v.z *= 1.3;
    v.y = 0.1;
    player.applyImpulse(v);

    // 効果音
    player.dimension.playSound('mob.cat.hit', player.location);

    // パーティクルの生成
    const location = player.location;
    location.y -= 1;
    player.dimension.spawnParticle('minecraft:knockback_roar_particle', location);

    // ブースト使用のフラグを立てて再発動不可能にする
    player.setDynamicProperty(`weapon_data:${this.typeId}:boost`, false);
  }

  override onEnd(player: Player): void {
    // 効果音
    player.dimension.playSound('mob.cat.purreow', player.location);

    // 念のためブーストのフラグを消しておく
    player.setDynamicProperty(`weapon_data:${this.typeId}:boost`);
  }
}

// 登録
register(new Bastet());
