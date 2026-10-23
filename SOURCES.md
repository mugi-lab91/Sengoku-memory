# 学習内容・素材の出典と扱い

## 画像と音

- `assets/game-design.png`：依頼時にフォルダー内に用意されていたデザイン基準画像。
- キャラクター5人、背景、道具、城の成長6段階、宝箱：上記を参照し、この制作で画像生成ツールにより新規生成。既存ゲームのキャラクターや外部素材配布サイトの画像を使用していません。
- 生成画像の同一アトラス内の完全に分離されたセルを切り出し、WebPに変換しました。文字や別のキャラクターを含む不自然な切り抜きは使用していません。
- 旗の「毘」は、生成文字の誤りを避けるため無地の旗にHTMLの正しい漢字を重ねます。
- BGM・効果音：`audio.js` のオリジナルな音列とWeb Audio APIによる合成。外部曲の録音や譜面の転用はしていません。
- キャラクター、装飾紋、城、宝箱は創作表現です。画像生成だけで史実の図案・建築復元の正確性を保証するものではありません。

## クイズ作成時に参照した主な公開資料

問題文と解説は本ゲーム用に新しく記述しました。以下は年代・主要な関係を確認するための資料です。内容は一般的な歴史学習の範囲にまとめ、軍記の伝説と確実な出来事を区別しています。

- [滋賀県：特別史跡安土城跡の調査と整備](https://www.pref.shiga.lg.jp/sd00/2591.html) — 安土城の築城開始は1576年。基準デザイン画像内にある1568年という表記は採用していません。
- [大阪城天守閣：大阪城リーフレット](https://osakacastle.net/pdf/leaflet/japanese_2025.pdf?lang=ja) — 秀吉による大坂城築城開始は1583年。
- [大阪市文化財協会：大坂城の歴史](https://www.occh.or.jp/static/pdf/data/setumeikai/2019.3.23osakajyou.pdf) — 大坂城と1590年の統一に関する年代。
- [岡崎市観光協会：徳川家康公の来歴](https://okazaki-kanko.jp/okazaki-park/feature/history/about) — 家康の経歴、関東移封、関ヶ原、幕府成立等の年表。
- [名古屋市博物館：天下統一への道](https://www.museum.city.nagoya.jp/exhibition/special/past/tenji0616.html) — 桶狭間の戦い、信長・秀吉・家康の関係。
- [長野市：川中島古戦場史跡公園](https://www.city.nagano.nagano.jp/n150800/contents/p002956.html) — 1561年の第4次川中島の戦い。
- [長野市立博物館：公園さんぽ](https://www.city.nagano.nagano.jp/museum/other/park.html) — 一騎打ちが『甲陽軍鑑』に記された話として伝わること。
- [上越市公式観光情報：上杉謙信公](https://joetsukankonavi.jp/kensinyukarinochijoetsu/) — 謙信の経歴と領国。
- [上越市：上杉氏文書集一](https://www.city.joetsu.niigata.jp/soshiki/koubunsho/koubunsyokan-shishi-beppen-01.html) — 長尾景虎から謙信への経歴と1578年の死去。
- [新発田市：御館の乱と上杉氏](https://www.city.shibata.lg.jp/kanko/bunka/shiro/gaiyo/1005179.html) — 謙信死後の後継争い。
- [山梨県公式観光情報：信玄公と風林火山](https://www.yamanashi-kankou.jp/special/shingenko_festival01.html) — 『孫子』に由来する軍旗の言葉。
- [農林水産省：検地・石高・兵農分離に関する資料](https://www.maff.go.jp/j/nousin/attach/pdf/mitotora-48.pdf) — 検地における基準統一、刀狩と兵農分離。
- [岐阜県：楽市楽座制札](https://www.pref.gifu.lg.jp/page/355032.html) — 楽市楽座と城下町の経営。

家紋5点の厳密な原図・画像利用条件の確認は未完了です。現在の図鑑では、すべて「仮画像・図案未検証」と明示しています。正式画像を追加した際はこの文書に確認元を記載してください。
