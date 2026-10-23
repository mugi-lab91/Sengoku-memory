# GitHub Pagesでゲームを公開する手順

対象リポジトリ：<https://github.com/mugi-lab91/Sengoku-memory>

## 1. ファイルの置き場所

このリポジトリの一番上（ルート）に `index.html` がある構成です。

```text
Sengoku-memory/
├── index.html        ← ゲームの入り口
├── style.css
├── data.js           ← 武将・クイズ・カードデータ
├── engine.js
├── game.js
├── audio.js
├── assets/           ← 画像。中のフォルダーもそのまま保持
├── .nojekyll         ← HTML/CSS/JSをそのまま配信するための設定
├── README.md
├── GITHUB_PAGES.md
├── ASSETS.md
├── SOURCES.md
├── legacy/           ← 改修前のゲーム
├── tests/
└── scripts/
```

npmでのインストールやビルド、APIキー、サーバープログラムは必要ありません。ゲームはリポジトリ名を含むURLでも画像とCSSを読み込める相対パスになっています。

## 2. GitHub Pagesを有効にする（最初の1回）

1. [リポジトリのPages設定](https://github.com/mugi-lab91/Sengoku-memory/settings/pages)を開きます。GitHubへのログインが必要です。
2. **Build and deployment** の **Source** で **Deploy from a branch** を選びます。
3. **Branch** は **main**、右側のフォルダーは **/ (root)** を選びます。
4. **Save** を押します。
5. 少し待ってから同じ設定画面を開き直します。公開完了後、サイトのURLが表示されます。
6. 公開完了後のゲームURLは **https://mugi-lab91.github.io/Sengoku-memory/** です。

**Sourceに「GitHub Actions」を選ぶ必要はありません。** このゲームは独自のデプロイ用ワークフローを使わず、ブランチから公開します。GitHub側ではPagesのビルド・デプロイが自動実行され、[Actions画面](https://github.com/mugi-lab91/Sengoku-memory/actions)で進行を確認できます。

URLの `Sengoku-memory` は大文字・小文字も含めてそのまま入力してください。設定した直後は404になることがあります。Actionsの処理が完了してから開き直してください。

## 3. ゲームを更新するには

ブラウザーだけで更新する場合：

1. [リポジトリのトップ](https://github.com/mugi-lab91/Sengoku-memory)を開きます。
2. **Add file → Upload files** を選びます。
3. 変更したファイルや `assets` フォルダーをドラッグします。ゲーム全体を入れた外側のフォルダーを、そのまま1階層深くアップロードしないようにしてください。
4. **Commit changes** で変更を保存します。
5. Pagesの自動更新を待ちます。

フォルダーを丸ごと移動したり、既存ファイルを削除したりする必要はありません。画像を追加する場合は、その画像を参照する `data.js` なども一緒に更新します。将来パソコンのGitを使う場合は、GitHub Desktopでこのリポジトリをクローンして編集する方法もあります。この制作フォルダー自体は、現時点ではGitの作業コピーではありません。

## 4. 公開後の確認

- パソコンとスマホの両方で公開URLを開きます。
- 武将・カード・背景が表示され、カードをめくれることを確認します。
- 音は、ゲームのボタンを操作してから再生されます。右上から音量変更できます。
- ステージを進めてページを再読み込みし、記録が残ることを確認します。

保存データは端末・ブラウザー・サイトごとです。ローカルファイルで遊んだ記録は消去されませんが、GitHub PagesのURLに自動で引き継がれるわけではありません。公開版はそのURLでの新しい記録として始まります。保存用キーやゲームデータは今回変更していません。

## 5. 困ったとき

- **404になる**：Pages設定が `main / (root)` か、`index.html` が最上位にあるか、Actionsの処理が完了しているかを確認します。
- **画像が出ない**：`assets` の中身を含めてアップロードされているか、ファイル名の大文字・小文字が合っているか確認します。
- **古い画面が出る**：ブラウザーを再読み込みします。パソコンでは Shift を押しながら再読み込み、または別のタブで開いてみてください。
- **家紋が仮画像と表示される**：公開エラーではありません。正式素材の確認待ちです。`ASSETS.md` に差し替え方法があります。

## 開発者向けの確認コマンド

Node.jsが利用できる環境で、このフォルダー内から実行します。

```sh
node scripts/check-pages.cjs
node tests/engine.test.cjs
node tests/ui-flow.test.cjs
node tests/audio.test.cjs
```

`check-pages.cjs` は `/Sengoku-memory/` 配下でHTML・CSS・画像の相対URLが正しく解決されることを確認します。

GitHubの公式手順：<https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site>


## 「Sengoku-memory」という白い説明ページが出る場合

2026年10月24日の調査では、ルートの `index.html` と画像パスは正しく、公開元も `main` のルートでした。一方、ゲーム追加後のPages実行は、公開時のIDトークン取得タイムアウトで失敗していました。そのため、READMEしかなかった初期版が公開URLに残っていました。

この場合、READMEやゲームデータを削除する必要はありません。Actions画面の最新の「pages build and deployment」を開き、buildだけでなく **deployも成功したか**を確認してください。認証トークンの取得タイムアウトなら **Re-run failed jobs** で再実行します。エラーが繰り返す場合は、その実行のログを確認し、設定や権限の問題と一時的な通信障害を区別します。

公開URLにゲームのタイトルが表示され、冒険を始められることまで確認して、公開完了とします。公開に失敗したまま古いページが見えている状態は、ブラウザーの再読み込みだけでは直りません。
