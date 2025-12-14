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
import { ButtonState, InputButton, ItemStack, Player, world } from '@minecraft/server';
import { getWeapon } from './weaponRegistry';
import { WeaponTicks } from './weapon';
import { delayed, EventManager, Priority, repeating } from '@gollilla/keystone';

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

EventManager.initialize();

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
    if (!player || !player.isValid) return;
    
    const weaponTicks = weapon.onClick(player);
    activate(player, item, weaponTicks);
  },
  priority: Priority.HIGHEST
});

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
    if (!player || !player.isValid) return;
    
    weapon.onArmSwing?.(player);
  },
  priority: Priority.HIGHEST
});

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
    if (!player || !player.isValid) return;
    
    weapon.onSneaking?.(player);
  },
  priority: Priority.HIGHEST
});

EventManager.registerBefore('playerLeave', {
  handler(event) {
    const player = event.player;
    if (!player) return;
    for (let slot = 0; slot < 9; ++slot) {
        const item = player.getComponent('minecraft:inventory')?.container.getItem(slot);
        if (!item || !item.typeId.startsWith('bmc:')) continue;

        const weapon = getWeapon(item.typeId);
        if (!weapon) continue;

        weapon.onEnd?.(player);
      }
    
    for (const id of player.getDynamicPropertyIds()) {
      if (id.includes('weapon_')) {
        player.setDynamicProperty(id);
      }
    }
  },
  priority: Priority.HIGHEST
});

repeating({
  run () {
    for (const player of world.getPlayers()) {
      if (!player || !player.isValid) continue;

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
