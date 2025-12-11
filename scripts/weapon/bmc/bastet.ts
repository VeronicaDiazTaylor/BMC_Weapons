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
import { MolangVariableMap, Player } from '@minecraft/server';
import { register } from '../weaponRegistry';
import { Weapon, WeaponTicks } from '../weapon';
import { Vector3 } from '@gollilla/keystone';

class Bastet extends Weapon {
  private static DURATION = 6*20;
  private static COOLDOWN = 15*20;

  typeId = 'bmc:bastet';

  private boostKey = this.tempDataKey('boost');

  override onClick(player: Player): WeaponTicks {
    // ブーストのフラグを消す
    player.setDynamicProperty(this.boostKey);
    
    // 移動速度上昇の付与
    player.addEffect('minecraft:speed', Bastet.DURATION, { amplifier: 4 });

    // 効果音
    player.dimension.playSound('mob.cat.meow', player.location);

    // 効果継続時間とクールダウン
    return { duration: Bastet.DURATION, cooldown: Bastet.COOLDOWN };
  }

  override onArmSwing(player: Player) {
    // ブースト可能か判定処理
    const canBoost = player.getDynamicProperty(this.boostKey) ?? true;
    // ブーストできなければここで処理を終わらせる
    if (!canBoost) return;

    // ブーストのベクトルを付与
    player.clearVelocity();
    const v = Vector3.fromBDS(player.getViewDirection()).normalize();
    v.x *= 2.1;
    v.z *= 2.1;
    v.y = 0.1;
    player.applyImpulse(v);

    // 効果音
    player.dimension.playSound('mob.cat.hit', player.location);

    // パーティクルの生成
    const location = player.location;
    location.y -= 1;

    const molang = new MolangVariableMap();
    molang.setColorRGB('variable.color', { red: 0.2, green: 0.4, blue: 1.0 });
    player.dimension.spawnParticle('minecraft:mob_effect', location, molang);

    // ブースト使用のフラグを立てて再発動不可能にする
    player.setDynamicProperty(this.boostKey, false);
  }

  override onEnd(player: Player): void {
    // 効果音
    player.dimension.playSound('mob.cat.purreow', player.location);
  }
}

// 登録
register(new Bastet());
