# 画像素材の一覧と差し替え方法

画像はすべて `assets/` 内で読み込みます。同じファイル名で置き換えれば、プログラムの修正は不要です。拡張子を変える場合は `data.js` や該当画面のパスも修正します。ブラウザーの再読み込みで反映します。

## 導入済み

| 保存先 | 用途 | 現在のサイズ / 推奨サイズ |
|---|---|---|
| `assets/game-design.png` | 提供された基準デザイン。ゲーム画面への貼り付けはしていません | 元画像 |
| `assets/characters/nobunaga.webp` | 信長：黒髪、黒赤金の甲冑 | 376×504 / 768×1024以上 |
| `assets/characters/hideyoshi.webp` | 秀吉：金の兜、明るい表情 | 同上 |
| `assets/characters/ieyasu.webp` | 家康：紺緑金、落ち着いた表情 | 同上 |
| `assets/characters/shingen.webp` | 信玄：白髪、赤い甲冑、軍配 | 同上 |
| `assets/characters/kenshin.webp` | 謙信：白銀髪、青白の装備 | 同上 |
| `assets/backgrounds/adventure.webp` | 桜の城下町と山々、全画面の背景 | 1536×1024 / 1920×1080以上 |
| `assets/backgrounds/castle-town.webp` | 予備の縦長背景 | 376×504 |
| `assets/items/azuchi.webp` | 創作表現の安土城 | 374×502 / 768×1024 |
| `assets/items/osaka.webp` | 創作表現の豊臣大坂城 | 同上 |
| `assets/items/edo.webp` | 創作表現の江戸城 | 同上 |
| `assets/items/furin.webp` | 風林火山の旗 | 同上 |
| `assets/items/bi.webp` | 無地の旗。正しい「毘」の文字はHTMLで重ねます | 376×504 |
| `assets/items/gunbai.webp` | 軍配 | 374×502 |
| `assets/items/tea.webp` | 金の茶室と茶碗 | 同上 |
| `assets/items/map.webp` | 事件・人間関係・地理カードの共通装飾 | 同上 |
| `assets/castles/0.webp`〜`5.webp` | 未開発の領地から大城郭への6段階 | 504×504 / 1024×1024 |
| `assets/treasure/closed.webp` | 赤と金の閉じた宝箱 | 376×504 / 768×1024 |
| `assets/treasure/open.webp` | 小判と米俵があふれる同じ宝箱 | 同上 |

人物は一枚ずつ同じ素材を使い回して外見の一貫性を保っています。現在は明るいクリームの背景付きで、画面に合わせてブレンド・マスクしています。透明背景版へ交換する場合はPNG/WebPのアルファチャンネル付き画像にできます。

## 必須の未導入素材：正確な家紋5点

いずれも **512×512以上・背景透過PNG** を推奨します。文献・博物館等の原図で紋の細部と利用条件を確認してください。現在は図案を推測して描かず、「仮画像・図案未検証」と表示しています。

| 保存先 | 必要な図案 |
|---|---|
| `assets/crests/nobunaga.png` | 織田木瓜 |
| `assets/crests/hideyoshi.png` | 五七桐 |
| `assets/crests/ieyasu.png` | 三つ葉葵 |
| `assets/crests/shingen.png` | 武田菱 |
| `assets/crests/kenshin.png` | 竹に二羽飛び雀 |

導入時は `data.js` の武将データの `crestVerified` を、その武将だけ `true` に変更します。確認資料と使用条件を `SOURCES.md` に追記してください。PNGを置くだけでは正式画像に切り替わらない設計です。

## 専用絵への追加差し替えを推奨するもの

現状はカード名と共通地図で遊べますが、テーマごとに絵を増やすとさらにわかりやすくなります。各素材は768×1024、文字なし、主要な物を中央に収めた構図を推奨します。

| 推奨保存先 | 内容 |
|---|---|
| `assets/items/kasugayama.webp` | 春日山城（山城） |
| `assets/items/tsutsujigasaki.webp` | 躑躅ヶ崎館 |
| `assets/items/okazaki.webp` | 岡崎城 |
| `assets/items/gifu.webp` | 岐阜城 |
| `assets/items/matchlock.webp` | 火縄銃と弾 |
| `assets/items/kenchi.webp` | 検地帳・枡・米 |
| `assets/items/armor.webp` | 甲冑・弓・太刀の個別素材 |
| `assets/items/battles/` | 桶狭間、長篠、山崎、関ヶ原、川中島などの戦場絵 |
| `assets/items/regions/` | 尾張、三河、甲斐、信濃、越後などの学習用地図 |
| `assets/characters/relations/` | 明智光秀、豊臣秀頼、徳川秀忠、武田勝頼などの人物 |

`data.js` の `artFor()` に条件を追加すると一括で変更できます。カード候補の `image` に直接パスを指定することも可能です。実際の地理を教える地図は、生成画像に頼らず正しい地図データから用意してください。現状の絵地図は学習用地理資料ではなく装飾です。

## 音の交換

`audio.js` の `GameAudio` は `activate()`、`settings(volume, muted)`、`play(name)`、`stop()` を公開します。同じ呼び出し口を保つことで、将来は録音したオリジナル音源にも交換できます。

効果音名：`flip`、`pair`、`correct`、`wrong`、`clear`、`open`、`coin`、`win`、`grow`。
