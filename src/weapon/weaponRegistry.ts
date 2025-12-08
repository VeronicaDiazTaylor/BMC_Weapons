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
import { Weapon } from './weapon';

const registry = new Map<string, Weapon>();

/**
 * ウェポンの登録
 * @param weapon
 */
export function register(weapon: Weapon) {
  registry.set(weapon.typeId, weapon);
}

/**
 * TypeIdからウェポンを取得
 * @param typeId
 * @returns {Weapon|undefined}
 */
export function getWeapon(typeId: string): Weapon | undefined {
  return registry.get(typeId);
}

/**
 * すべてのウェポンを取得
 * @returns {Map<{string}, {Weapon}>}
 */
export function getAllWeapon(): Map<string, Weapon> {
  return registry;
}
