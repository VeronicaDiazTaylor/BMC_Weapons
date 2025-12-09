# BMC_Weapons
<img alt="" src="https://raw.githubusercontent.com/BowyersMC/bowyersmc.github.io/wiki/images/banner/banner_phasing.png" />        
BowyersMCの武器機構を実装したビヘイビアパックとリソースパック
<br /><br />

## 注意
scripts直下のコードは、私が参加している[ScriptAPIの開発支援フレームワーク](https://github.com/XxPMMPERxX/Keystone) (以降Keystoneと表記) を用いたコードであるため、コンパイルしないと**動きません**。

Releasesに添付するつもりであるものは使えるようにする予定ですが、あくまでもコードの公開とこれを機に勉強をしてみたいといった人間がいる可能性があると想定してコメント付きで分かりやすくまとめてます。  

基本的にjavascriptでScriptAPIは開発しますが、この言語は暗黙の了解(動的)で型の変換がされるため、型の部分で混乱を招く可能性があるためそれを避けるためにTypeScriptで書いてます。  
どうしてもjavascriptでコードを見たい場合は*.mcpackを*.zipに変えて解凍してください。
<br /><br />

## ウェポンの移植状況
22種類すべての実装はする予定ありません。労力に対し何のリターンもないからです。  
正直な話、Xrayなどのブロック透視などはScriptAPIのみで行える範疇を超えているため、実装が厳しいものが多いため。  
パケットなどを使えるようになり次第、実装してみたくは思ってますが期待しないでください。  
- [x] <img width="20" height="20" alt="" src="https://raw.githubusercontent.com/BowyersMC/bowyersmc.github.io/wiki/images/weapon/airride.png" /> Airride  -  スニークトリガーの実装例として作成
- [x] <img width="20" height="20" alt="" src="https://raw.githubusercontent.com/BowyersMC/bowyersmc.github.io/wiki/images/weapon/bastet.png" /> Bastet  -  腕振りトリガーの実装例として作成
- [x] <img width="20" height="20" alt="" src="https://raw.githubusercontent.com/BowyersMC/bowyersmc.github.io/wiki/images/weapon/leaper.png" /> Leaper  -  効果継続時間を持たない実装例として作成
- [x] <img width="20" height="20" alt="" src="https://raw.githubusercontent.com/BowyersMC/bowyersmc.github.io/wiki/images/weapon/parallel.png" /> Parallel  -  可変クールタイムの実装例として作成
- [ ] <img width="20" height="20" alt="" src="https://raw.githubusercontent.com/BowyersMC/bowyersmc.github.io/wiki/images/weapon/shock_waver.png" /> ShockWaver  -  エンティティを扱う実装例として作成

<br />

## ※開発者向け
以下はScriptAPIのこのビヘイビア―パックをKeystoneで開発してみようとしている方へ向けたもの。  
環境のセットアップは省略させていただきます。

### カスタムウェポンの実装方法
例として「テスト/Test」というカスタムウェポンを作ってみます。

#### ≫リソースパック側の追加
1. `texts/ja_JP.lang` (必要なら`texts/en_US.lang`も) を編集
    ```diff
    item.bmc:airride=エアライド
    item.bmc:bastet=バステト
    item.bmc:leaper=リーパー
    item.bmc:parallel=パラレル
    item.bmc:shock_waver=ショックウェーバー
    +item.bmc:test=テスト
    ```
2. `textures\bmc`に`test.png`でアイテムのアイコンを入れる
3. `textures\item_texture.json`でアイテムアイコンの割り振りを登録
    ```diff
    {
      "resource_pack_name": "bmc_weapon",
      "texture_name": "atlas.items",
      "texture_data": {
        "airride": {
          "textures": "textures/bmc/airride"
        },
        "bastet": {
          "textures": "textures/bmc/bastet"
        },
        "leaper": {
          "textures": "textures/bmc/leaper"
        },
        "parallel": {
          "textures": "textures/bmc/parallel"
        },
        "shock_waver": {
          "textures": "textures/bmc/shock_waver"
    -   }
    +   },
    +   "test": {
    +     "textures": "textures/bmc/test"
    +   }
      }
    }
    ```

#### ≫ビヘイビア―パック側の処理
1. `items\test.json`を作成
    ```json
    {
      "format_version": "1.21.0",
      "minecraft:item": {
        "description": {
          "identifier": "bmc:test"
        },
        "components": {
          "minecraft:icon": "test",
          "minecraft:max_stack_size": 1,
          "minecraft:glint": true,
          "minecraft:cooldown": {
            "category": "bmc:test",
            "duration": 10
          }
        }
      }
    }
    ````
    ここの`minecraft:cooldown -> duration`の部分にはクールダウンの**最大値**を入力してください。Parallelのように初回だけ1sであっても、基本的な13sをここに指定してください。  
2. ScriptAPIでウェポン処理を書く
    ```ts
    // weapon/bmc/test.ts
    import { Player } from '@minecraft/server';
    import { register } from '../weaponRegistry';
    import { Weapon, WeaponTicks } from '../weapon';

    class Test extends Weapon {
      static DURATION = 1*20; // 1sは20tick
      static COOLDOWN = 1*20; // 1sは20tick
    
      typeId = 'bmc:test'; // test.jsonで指定したidentifier

      override onClick(player: Player): WeaponTicks {
        // -- ウェポン起動処理 --
        return { duration: Test.DURATION, cooldown: Test.COOLDOWN };
      }

      override onArmSwing(player: Player) {
        // -- トリガー: 腕振り --
      }

      override onSneaking(player: Player) {
        // -- トリガー: スニーク --
      }
    }

    register(new Test());
    ```
3. 起動処理箇所でウェポンのスクリプトのインポートをする
    ```ts
    // index.ts
    import './weapon/weaponListener';
    import './weapon/bmc/airride';
    import './weapon/bmc/bastet';
    import './weapon/bmc/leaper';
    import './weapon/bmc/parallel';
    import './weapon/bmc/shockWaver';
    import './weapon/bmc/test';
    ```
