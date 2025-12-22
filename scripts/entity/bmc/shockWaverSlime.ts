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
import { Entity } from '@minecraft/server';
import { CustomEntity } from '../customEntity';
import { register } from '../customEntityRegistry';
import { Vector3 } from 'keystonemc';

class ShockWaverSlime extends CustomEntity {
  private static SLOWNESS_DEBUFF = 5*20;

  typeId: string = 'bmc:shock_waver_slime';
  aabbExpand: number = 1.75;

  override onCollidedWithEntity(self: Entity, entity: Entity): void {
    // 吹き飛ばし
    entity.clearVelocity();
    const velocity = Vector3.fromBDS(entity.location).subtractVector(self.location).normalize();
    velocity.x *= 2.25;
    velocity.y = 0.95;
    velocity.z *= 2.25;
    entity.applyImpulse(velocity);

    // 効果音
    entity.dimension.playSound('item.trident.riptide_2', entity.location);

    if (self.getDynamicProperty(CustomEntity.OWNING_ENTITY_ID_TAG) != entity.id) {
      // 鈍足の付与
      entity.addEffect('minecraft:slowness', ShockWaverSlime.SLOWNESS_DEBUFF, { amplifier: 4 });
    }
  }

  override onDespawn(self: Entity) {
    // 座標上で起こる効果音
    self.dimension.playSound('mob.vex.hurt', self.location);
  }
}

register(new ShockWaverSlime());
