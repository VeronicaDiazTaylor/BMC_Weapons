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
   * 毎ティックの処理
   * @param player
   */
  onTick?(player: Player) {}
  /**
   * 効果が切れたときの処理
   * @param player
   */
  onEnd?(player: Player) {}
}
