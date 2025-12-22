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
import { ButtonState, Dimension, DimensionTypes, Entity, InputButton, ItemStack, Player, world } from '@minecraft/server';
import { delayed, EventManager, Priority, repeating, AxisAlignedBB } from 'keystonemc';
import { getWeapon } from './weapon/weaponRegistry';
import { WeaponTicks } from './weapon/weapon';
import { CustomEntity, despawnAt } from './entity/customEntity';
import { getCustomEntity } from './entity/customEntityRegistry';

/**
 * クールダウンが進んでいるかどうか
 * @param player 
 * @param weaponItem 
 * @returns {boolean}
 */
function nowCooldown(player: Player, weaponItem: ItemStack): boolean {
  const now = Date.now();
  const until = player.getDynamicProperty(`weapon_cooldown:${weaponItem.typeId}`) ?? now;
  return (now < Number(until));
}

/**
 * ウェポンの効果が継続中かどうか
 * @param player 
 * @param weaponItem 
 * @returns {boolean}
 */
function nowActivated(player: Player, weaponItem: ItemStack): boolean {
  return Boolean(player.getDynamicProperty(`weapon_activated:${weaponItem.typeId}`) ?? false);
}

/**
 * ウェポンの起動
 * @param player 
 * @param weaponItem 
 * @param weaponTicks
 */
function activate(player: Player, weaponItem: ItemStack, weaponTicks: WeaponTicks) {
  player.setDynamicProperty(`weapon_activated:${weaponItem.typeId}`, true);

  delayed(weaponTicks.duration, () => {
    const weapon = getWeapon(weaponItem.typeId);
    if (weapon) weapon.onEnd?.(player);

    const now = Date.now();
    const millisecTick = weaponTicks.cooldown / 20 * 1000; 
    player.setDynamicProperty(`weapon_cooldown:${weaponItem.typeId}`, now + millisecTick);
    player.startItemCooldown(weaponItem.typeId, weaponTicks.cooldown);

    player.setDynamicProperty(`weapon_activated:${weaponItem.typeId}`);
  });
}

// イベントマネージャーのイニシャライズ処理
EventManager.initialize();

// ウェポン使用
EventManager.registerAfter('itemUse', {
  handler(event) {
    const player = event.source;
    const item = event.itemStack;
    if (!item) return;
    if (!item.typeId.startsWith('bmc:')) return;
    
    const weapon = getWeapon(item.typeId);
    if (!weapon) return;
    if (nowCooldown(player, item)) return;
    if (nowActivated(player, item)) return;
    if (!player) return;
    
    const weaponTicks = weapon.onClick(player);
    activate(player, item, weaponTicks);
  },
  priority: Priority.HIGHEST
});

// ウェポントリガー: 腕振り
EventManager.registerAfter('playerSwingStart', {
  handler(event) {
    const player = event.player;
    const item = event.heldItemStack;
    if (!item) return;
    if (!item.typeId.startsWith('bmc:')) return;
    
    const weapon = getWeapon(item.typeId);
    if (!weapon) return;
    if (nowCooldown(player, item)) return;
    if (!nowActivated(player, item)) return;
    if (!player) return;
    
    weapon.onArmSwing?.(player);
  },
  priority: Priority.HIGHEST
});

// ウェポントリガー: スニーク
EventManager.registerAfter('playerButtonInput', {
  handler(event) {
    if (event.button != InputButton.Sneak) return;
    if (event.newButtonState != ButtonState.Pressed) return;
    
    const player = event.player;
    const item = player.getComponent('minecraft:inventory')?.container.getItem(player.selectedSlotIndex);
    if (!item) return;
    if (!item.typeId.startsWith('bmc:')) return;
    
    const weapon = getWeapon(item.typeId);
    if (!weapon) return;
    if (nowCooldown(player, item)) return;
    if (!nowActivated(player, item)) return;
    if (!player) return;
    
    weapon.onSneaking?.(player);
  },
  priority: Priority.HIGHEST
});

// カスタムエンティティのトリガー: 被攻撃
EventManager.registerAfter('entityHurt', {
  handler(event) {
    const entity = event.hurtEntity;
    if (!entity || !entity.isValid) return;
    if (!entity.typeId.startsWith('bmc:')) return;

    const owningEntityId = entity.getDynamicProperty(CustomEntity.OWNING_ENTITY_ID_TAG) as string | undefined;
    if (!owningEntityId) return;

    const owningEntity = world.getEntity(owningEntityId);
    if (!(owningEntity instanceof Player)) return;

    const customEntityObject = getCustomEntity(entity.typeId);
    if (!customEntityObject) return;

    customEntityObject.onHurt?.(entity, event.damageSource);
  },
  priority: Priority.HIGHEST
});

// カスタムエンティティのトリガー: プレイヤーのインタラクト
EventManager.registerAfter('playerInteractWithEntity', {
  handler(event) {
    const entity = event.target;
    if (!entity || !entity.isValid) return;
    if (!entity.typeId.startsWith('bmc:')) return;

    const owningEntityId = entity.getDynamicProperty(CustomEntity.OWNING_ENTITY_ID_TAG) as string | undefined;
    if (!owningEntityId) return;

    const owningEntity = world.getEntity(owningEntityId);
    if (!(owningEntity instanceof Player)) return;

    const customEntityObject = getCustomEntity(entity.typeId);
    if (!customEntityObject) return;

    customEntityObject.onInteractByPlayer?.(entity, event.player);
  },
  priority: Priority.HIGHEST
});

// カスタムエンティティのトリガー: 生成 + ティック + 衝突
EventManager.registerAfter('entitySpawn', {
  handler(event) {
    const entity = event.entity;
    if (!entity || !entity.isValid) return;
    if (!entity.typeId.startsWith('bmc:')) return;

    const customEntityObject = getCustomEntity(entity.typeId);
    if (!customEntityObject) return;

    const owningEntity = world.getPlayers().find((player: Player) => {
      return entity.getDynamicProperty(CustomEntity.OWNING_ENTITY_ID_TAG) == player.id;
    });
    if (!owningEntity) return;

    customEntityObject.onSpawn?.(entity);
  },
  priority: Priority.HIGHEST
});

// プレイヤーが退室したときに諸々のデータを処理
EventManager.registerBefore('playerLeave', {
  handler(event) {
    const player = event.player;
    if (!player) return;
    for (const id of player.getDynamicPropertyIds()) {
      if (id.includes('weapon_')) {
        player.setDynamicProperty(id);
      }
    }
  },
  priority: Priority.HIGHEST
});

// ウェポントリガー: ティック
repeating({
  run () {
    for (const player of world.getPlayers()) {
      if (!player) continue;

      for (let slot = 0; slot < 9; ++slot) {
        const item = player.getComponent('minecraft:inventory')?.container.getItem(slot);
        if (!item || !item.typeId.startsWith('bmc:')) continue;

        const weapon = getWeapon(item.typeId);
        if (!weapon) continue;

        weapon.onTick?.(player, slot == player.selectedSlotIndex, nowActivated(player, item));
      }
    }
  },
  endless: true,
  every: 1
});

// エンティティのティック
repeating({
  run() {
    for (const dimensionType of DimensionTypes.getAll()) {
      const dimension = world.getDimension(dimensionType.typeId);
      for (const entity of dimension.getEntities()) {
        if (!entity.typeId.startsWith('bmc:')) return;
        if (!entity || !entity.isValid) return;
  
        const owningEntityId = entity.getDynamicProperty(CustomEntity.OWNING_ENTITY_ID_TAG) as string | undefined;
        if (!owningEntityId) return;
        
        const customEntityObject = getCustomEntity(entity.typeId);
        if (!customEntityObject) return;
        
        const owningEntity = world.getEntity(owningEntityId);
        if (!(owningEntity instanceof Player) || entity.location.y < -100) {
          despawnAt(entity);
          return;
        }
        
        customEntityObject.onTick?.(entity);
        
        // 衝突判定処理
        const expand = customEntityObject.aabbExpand;
        const entityAABB = AxisAlignedBB.fromBDS(entity.getAABB()).expand(expand, expand, expand);
        
        // 対ブロック
        if (entity.isOnGround || isHittingCeiling(dimension, entityAABB) || isTouchingWall(dimension, entityAABB)) {
          if (entity && entity.isValid) customEntityObject.onHit?.(entity);
        }
        
        // 対エンティティ
        for (const e of dimension.getEntities().filter((ent: Entity) => ent.id != entity.id)) {
          if (AxisAlignedBB.fromBDS(e.getAABB()).intersects(entityAABB)) {
            if (entity && entity.isValid && e && e.isValid) customEntityObject.onCollidedWithEntity?.(entity, e);
          }
        }
      }
    }
  },
  every: 1,
  endless: true
});

/**
 * 天井に接したか
 * @param dimension
 * @param aabb
 * @returns {boolean}
 */
function isHittingCeiling(dimension: Dimension, aabb: AxisAlignedBB): boolean {
  if (!(dimension instanceof Dimension)) return false;

  const expanded = aabb.offset(0, 0.05, 0);

  const min = expanded.min;
  const max = expanded.max;

  for (let x = Math.floor(min.x); x <= Math.floor(max.x); x++) {
    for (let y = Math.floor(min.y); y <= Math.floor(max.y); y++) {
      for (let z = Math.floor(min.z); z <= Math.floor(max.z); z++) {
        const block = dimension.getBlock({ x, y, z });
        if (!block || block.isAir || block.isLiquid) continue;

        const blockBB = AxisAlignedBB.fromMinMax({ x: x, y: y, z: z }, { x: x + 1, y: y + 1, z: z + 1 });
        if (expanded.intersects(blockBB)) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * 壁に接したか
 * @param dimension
 * @param aabb
 * @returns {boolean}
 */
function isTouchingWall(dimension: Dimension, aabb: AxisAlignedBB): boolean {
  if (!(dimension instanceof Dimension)) return false;

  const expanded = aabb.expand(0.05, 0, 0.05);

  const min = expanded.min;
  const max = expanded.max;

  for (let x = Math.floor(min.x); x <= Math.floor(max.x); x++) {
    for (let y = Math.floor(min.y); y <= Math.floor(max.y); y++) {
      for (let z = Math.floor(min.z); z <= Math.floor(max.z); z++) {
        const block = dimension.getBlock({ x, y, z });
        if (!block || block.isAir || block.isLiquid) continue;

        const blockBB = AxisAlignedBB.fromMinMax({ x: x, y: y, z: z }, { x: x + 1, y: y + 1, z: z + 1 });
        if (expanded.intersects(blockBB)) {
          return true;
        }
      }
    }
  }

  return false;
}
