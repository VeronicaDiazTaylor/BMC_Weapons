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
import { Player } from '@minecraft/server';

/**
 * @param duration 効果継続時間 (tick)
 * @param cooldown クールダウン (tick)
 */
export type WeaponTicks = {
  duration: number,
  cooldown: number
}

export abstract class Weapon {  
  /** ビヘイビアーで設定したタイプID */
  abstract typeId: string;

  /**
   * プロパティキーの生成
   * @param key
   * @returns {string}
   */
  protected tempDataKey(key: string): string {
    return `weapon_temporary_data:${this.typeId}:${key}`;
  }

  /**
   * ウェポン起動処理
   * @param player 
   * @returns {WeaponTicks}
   */
  onClick(player: Player): WeaponTicks {
    return { duration: 0, cooldown: 0 };
  }
  
  /**
   * 腕を振ったときの処理
   * @param player
   */
  onArmSwing?(player: Player) {}
  
  /**
   * スニークをした時の処理
   * @param player
   */
  onSneaking?(player: Player) {}
  
  /**
   * 効果継続中の毎ティック処理
   * @param player
   * @param isWeaponInHand 手に持っているかどうか
   * @param isActivated 効果継続中かどうか
   */
  onTick?(player: Player, isWeaponInHand: boolean, isActivated: boolean) {}

  /**
   * 効果が切れたときの処理
   * @param player
   */
  onEnd?(player: Player) {}
}
