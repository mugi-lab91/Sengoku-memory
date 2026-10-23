'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const D = require('../data.js');
const root = path.resolve(__dirname, '..');
const base = new URL('https://mugi-lab91.github.io/Sengoku-memory/');
function check(reference, from = 'index.html') {
  const url = new URL(reference, new URL(from, base));
  assert.equal(url.origin, base.origin, `外部URL: ${reference}`);
  assert(url.pathname.startsWith(base.pathname), `リポジトリの外に出るパス: ${reference}`);
  const relative = decodeURIComponent(url.pathname.slice(base.pathname.length));
  assert(fs.statSync(path.join(root, relative)).isFile(), `ファイルがありません: ${relative}`);
}
assert(fs.existsSync(path.join(root, '.nojekyll')), '.nojekyll が必要です');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert(html.includes('<main id="app">'), 'ルートのindex.htmlはゲームの起動ページである必要があります');
for (const script of ['data.js', 'engine.js', 'audio.js', 'game.js']) {
  assert(html.includes('src="' + script + '"'), 'ゲーム起動用のスクリプトがありません: ' + script);
}
for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) check(m[1]);
const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
for (const m of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) check(m[1], 'style.css');
for (const w of D.warriors) { check(w.image); if (w.crestVerified) check(w.crestImage); }
for (const stage of D.stages) for (const c of stage.candidates) check(c.image);
for (let i = 0; i <= 5; i++) check(`assets/castles/${i}.webp`);
for (const name of ['closed', 'open']) check(`assets/treasure/${name}.webp`);
assert(!/<base\b/.test(html), '固定のbase URLを使わない');
console.log('PASS: /Sengoku-memory/ 配下のHTML・CSS・全ステージ画像・城・宝箱のパスと .nojekyll を確認');
