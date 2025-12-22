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
import { CustomEntity } from './customEntity';

const registry = new Map<string, CustomEntity>();

/**
 * カスタムエンティティの登録
 * @param customEntity
 */
export function register(customEntity: CustomEntity) {
  registry.set(customEntity.typeId, customEntity);
}

/**
 * TypeIdからカスタムエンティティを取得
 * @param typeId
 * @returns {CustomEntity|undefined}
 */
export function getCustomEntity(typeId: string): CustomEntity | undefined {
  return registry.get(typeId);
}

/**
 * すべてのカスタムエンティティを取得
 * @returns {Map<{string}, {CustomEntity}>}
 */
export function getAllCustomEntity(): Map<string, CustomEntity> {
  return registry;
}
