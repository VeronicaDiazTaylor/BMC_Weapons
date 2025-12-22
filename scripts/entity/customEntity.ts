/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

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
import { Dimension, Entity, EntityDamageSource, Player, Vector3 } from '@minecraft/server';
import { getCustomEntity } from './customEntityRegistry';

export abstract class CustomEntity {
  static OWNING_ENTITY_ID_TAG = 'custom_entity:owning_entity_id';

  /** ビヘイビアーで設定したタイプID */
  abstract typeId: string;
  
  /** 当たり判定の拡張幅 */
  aabbExpand: number = 0;

  /**
   * スポーンしたときの処理
   * @param self 
   */
  onSpawn?(self: Entity) {}

  /**
   * 攻撃を喰らった時の処理
   * @param self
   * @param damageSource
   */
  onHurt?(self: Entity, damageSource: EntityDamageSource) {}

  /**
   * 面に接したときの処理
   * @param self 
   */
  onHit?(self: Entity) {}

  /**
   * プレイヤーに接触したときの処理
   * @param self 
   */
  onCollidedWithEntity?(self: Entity, entity: Entity) {}

  /**
   * プレイヤーに触られたときの処理
   * @param self 
   * @param player 
   */
  onInteractByPlayer?(self: Entity, player: Player) {}

  /**
   * デスポーン時の処理
   * @param self 
   */
  onDespawn?(self: Entity) {}

  /**
   * ティック処理
   * @param self 
   */
  onTick?(self: Entity) {}
}

/**
 * スポーンさせる
 * @param typeId 
 * @param owningEntity 
 * @param location 
 * @param velocity
 */
export function spawnAt(typeId: string, owningEntity: Player, location: Vector3, velocity?: Vector3) {
  const dimension = owningEntity?.dimension;
  if (!(dimension instanceof Dimension)) return;

  // as anyでIDEの構文エラーを回避
  const entity = owningEntity?.dimension?.spawnEntity(typeId as any, location);

  if (!(entity instanceof Entity)) return;

  // プロパティをここで設定
  entity.setDynamicProperty(CustomEntity.OWNING_ENTITY_ID_TAG, owningEntity.id);

  // 速度の付与
  if (velocity) entity.applyImpulse(velocity);
}

/**
 * 所有者データのあるエンティティの取得
 * @param typeId 
 * @param owningEntity
 * p@returns {Entity[]}
 */
export function searchAt(typeId: string, owningEntity: Player): Entity[] {
  return owningEntity?.dimension?.getEntities({type: typeId}).filter((e: Entity) => {
    return e.getDynamicProperty(CustomEntity.OWNING_ENTITY_ID_TAG) == owningEntity.id;
  }) ?? [];
}

/**
 * 所有者データのあるエンティティの取得
 * @param entity
 */
export function despawnAt(entity: Entity) {
  if (entity && entity.isValid) {
    const customEntityObject = getCustomEntity(entity.typeId);
    if (!customEntityObject) return;
    
    customEntityObject.onDespawn?.(entity);
    
    // リムーブ
    entity.remove();
  }
}
