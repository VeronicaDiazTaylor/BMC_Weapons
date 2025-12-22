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
import { Dimension, Entity, Player, Vector3 } from '@minecraft/server';
import { CustomEntity, despawnAt, spawnAt } from '../customEntity';
import { register } from '../customEntityRegistry';

class ShockWaverElement extends CustomEntity {
  typeId: string = 'bmc:shock_waver_element';

  override onHit(self: Entity): void {
    this.spawnSlime(self, self.location);
  }

  override onCollidedWithEntity(self: Entity, entity: Entity) {
    const hitVector = entity.location;
    if (!hitVector) return;

    this.spawnSlime(self, hitVector);
  }

  /**
   * 巨大スライムのスポーン
   * @param element
   * @param location 
   */
  private spawnSlime(element: Entity, location: Vector3) {
    try {
      const dimension = element.dimension;
      if (!(dimension instanceof Dimension)) return;

      const owningEntityId = element.getDynamicProperty(CustomEntity.OWNING_ENTITY_ID_TAG);

      // エレメントをデスポーン
      despawnAt(element);

      const owningEntity = dimension.getPlayers().find((p: Player) => p.id == owningEntityId);
      if (!owningEntity) return;

      // 巨大スライムを引き継がせて設置
      spawnAt('bmc:shock_waver_slime', owningEntity, location);
    } catch {
      return;
    }
  }
}

register(new ShockWaverElement());
