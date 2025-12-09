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
import { ButtonState, InputButton, ItemStack, ItemUseAfterEvent, Player, PlayerButtonInputAfterEvent, PlayerLeaveBeforeEvent, PlayerSwingStartAfterEvent, world } from '@minecraft/server';
import { getWeapon } from './weaponRegistry';
import { Weapon, WeaponTicks } from './weapon';
import { delayed, repeating } from '@gollilla/keystone';

/**
 * クールダウンが進んでいるかどうか
 * @param player 
 * @param weaponItem 
 * @returns {boolean}
 */
function nowCooldown(player: Player, weaponItem: ItemStack): boolean {
  const now = Date.now();
  const until = player.getDynamicProperty(`${Weapon.COOLDOWN_PREFIX + weaponItem.typeId}`) ?? now;
  return (now < Number(until));
}

/**
 * ウェポンの効果が継続中かどうか
 * @param player 
 * @param weaponItem 
 * @returns {boolean}
 */
function nowActivated(player: Player, weaponItem: ItemStack): boolean {
  return Boolean(player.getDynamicProperty(`${Weapon.ACTIVATED_PREFIX + weaponItem.typeId}`) ?? false);
}

/**
 * ウェポンの起動
 * @param player 
 * @param weaponItem 
 * @param weaponTicks
 */
function activate(player: Player, weaponItem: ItemStack, weaponTicks: WeaponTicks) {
  player.setDynamicProperty(`${Weapon.ACTIVATED_PREFIX + weaponItem.typeId}`, true);

  delayed(weaponTicks.duration, () => {
    const weapon = getWeapon(weaponItem.typeId);
    if (weapon) weapon.onEnd?.(player);

    const now = Date.now();
    const millisecTick = weaponTicks.cooldown / 20 * 1000; 
    player.setDynamicProperty(`${Weapon.COOLDOWN_PREFIX + weaponItem.typeId}`, now + millisecTick);
    player.startItemCooldown(weaponItem.typeId, weaponTicks.cooldown);

    player.setDynamicProperty(`${Weapon.ACTIVATED_PREFIX + weaponItem.typeId}`);
  });
}

world.afterEvents.itemUse.subscribe((event: ItemUseAfterEvent) => {
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
});

world.afterEvents.playerSwingStart.subscribe((event: PlayerSwingStartAfterEvent) => {
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
});

world.afterEvents.playerButtonInput.subscribe((event: PlayerButtonInputAfterEvent) => {
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
});

repeating({
  run () {
    for (const player of world.getPlayers()) {
      if (!player || !player.isValid) continue;

      const item = player.getComponent('minecraft:inventory')?.container.getItem(player.selectedSlotIndex);
      if (!item || !item.typeId.startsWith('bmc:')) continue;

      const weapon = getWeapon(item.typeId);
      weapon?.onTick?.(player);
    }
  },
  endless: true,
  every: 1
});

world.beforeEvents.playerLeave.subscribe((event: PlayerLeaveBeforeEvent) => {
  const player = event.player;
  if (!player) return;

  for (const id of player.getDynamicPropertyIds()) {
    if (id in [ Weapon.COOLDOWN_PREFIX, Weapon.ACTIVATED_PREFIX, Weapon.TEMP_DATA_PREFIX ]) {
      player.setDynamicProperty(id);
    }
  }
});
