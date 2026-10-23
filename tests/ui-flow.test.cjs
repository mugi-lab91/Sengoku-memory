/* 実ブラウザーを使わないDOMハーネス。画面遷移と入力・保存・演出の接続を検証します。 */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let doc;
class Element{
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.attrs={};this.dataset={};this._classes=new Set();this.style={setProperty(){}};this.events={};this.open=false;this.hidden=false;this.disabled=false;this.classList={add:(...c)=>c.forEach(v=>this._classes.add(v)),remove:(...c)=>c.forEach(v=>this._classes.delete(v)),contains:c=>this._classes.has(c),toggle:(c,v)=>{if(v??!this._classes.has(c))this._classes.add(c);else this._classes.delete(c)}}}
 set className(v){this._classes=new Set(v.split(/\s+/))}get className(){return [...this._classes].join(' ')}
 setAttribute(k,v){this.attrs[k]=String(v);if(k==='class')this.className=v;if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,s)=>s.toUpperCase())]=String(v);if(k==='disabled')this.disabled=true;if(k==='hidden')this.hidden=true}getAttribute(k){return this.attrs[k]??null}hasAttribute(k){return Object.hasOwn(this.attrs,k)}
 set innerHTML(html){this.html=html;this.children=[];let stack=[this];for(const m of html.matchAll(/<(\/?)([a-zA-Z][\w-]*)([^>]*)>/g)){let [,close,tag,attrs]=m;if(close){if(stack.length>1)stack.pop();continue}let e=new Element(tag);for(const a of attrs.matchAll(/([^\s=/'"<>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g))e.setAttribute(a[1],a[2]??a[3]??a[4]??'');stack.at(-1).append(e);if(!['img','br','input','meta','link','hr'].includes(tag.toLowerCase()))stack.push(e)}}get innerHTML(){return this.html||''}
 append(e){e.parent=this;this.children.push(e)}remove(){if(this.parent)this.parent.children=this.parent.children.filter(c=>c!==this)}
 addEventListener(k,f){this.events[k]=f}focus(){doc.focused=this}showModal(){this.open=true}close(){this.open=false}
 matches(sel){if(sel.includes(':not(:disabled)'))return !this.disabled&&this.matches(sel.replace(':not(:disabled)',''));if(sel.startsWith('.'))return sel.slice(1).split('.').every(c=>this._classes.has(c));if(sel.startsWith('#'))return this.attrs.id===sel.slice(1);if(sel.startsWith('[')){let m=sel.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);return m&&(m[2]===undefined?this.hasAttribute(m[1]):this.attrs[m[1]]===m[2])}return this.tagName.toLowerCase()===sel.toLowerCase()}
 querySelectorAll(sel){let found=[];for(let c of this.children){if(c.matches(sel))found.push(c);found.push(...c.querySelectorAll(sel))}return found}querySelector(sel){return this.querySelectorAll(sel)[0]||null}closest(sel){return this.matches(sel)?this:this.parent?.closest(sel)}
}
doc=new Element('document');doc.innerHTML=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');doc.createElement=t=>new Element(t);doc.hidden=false;let timers=[],id=0,now=0,mem=new Map(),sounds=[];
const ctx={document:doc,window:{scrollTo(){},},matchMedia:()=>({matches:true}),localStorage:{getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,v)},setTimeout:(f,ms)=>{timers.push({f,at:now+ms,id:++id});return id},clearTimeout:id=>timers=timers.filter(t=>t.id!==id),GameAudio:{enabled:false,activate(){this.enabled=true;return true},settings(){},play:s=>sounds.push(s)},console};vm.createContext(ctx);const run=s=>vm.runInContext(s,ctx);for(const f of ['data.js','engine.js','game.js'])vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../'+f),'utf8'),ctx,{filename:f});
function advance(ms){let end=now+ms;while(timers.some(t=>t.at<=end)){timers.sort((a,b)=>a.at-b.at);let t=timers.shift();now=t.at;t.f()}now=end}
assert.equal(run('GameAudio.enabled'),false);
run('handle({target:app.querySelector("[data-help]")})');assert.equal(run('GameAudio.enabled'),false,'遊び方を開いてもBGMはまだ始まらない');run('modal.close()');
run('handle({target:app.querySelector("[data-adventure]")})');assert.equal(run('GameAudio.enabled'),true,'冒険開始操作で音声を有効化');run('go("title")');
assert.equal(run('screen'),'title');assert(doc.querySelector('[data-go="stages"]'));run('go("stages")');assert.equal(doc.querySelectorAll('[data-start]').length,10);
for(let level=1;level<=10;level++){
 run(`start(${level})`);assert.equal(run('screen'),'game');assert.equal(doc.querySelectorAll('[data-card]').length,(level+4)*2);
 if(level===1){run('flip(state.active.order[0]);flip(state.active.order[0])');assert.equal(run('selected.length'),1);run('selected=[]');run('gameView()')}
 while(run('!!state.active')){
 const pair=run(`(()=>{let a=state.active,x=a.order.find(id=>id.endsWith(':w')&&!a.matched.includes(id));let owner=E.card(a,x,D).owner;let y=a.order.find(id=>id.endsWith(':i')&&!a.matched.includes(id)&&E.card(a,id,D).owner===owner);return [x,y]})()`);
 run(`flip(${JSON.stringify(pair[0])});flip(${JSON.stringify(pair[1])})`);advance(701);assert.equal(doc.querySelector('#modal').open,true);
 // 誤答で答えと解説、再挑戦ボタンが表示されることを確認。
 run(`answer(quizOptions.findIndex(o=>o!==D.quizzes.find(q=>q.id===state.active.pending.id).answer))`);assert(doc.querySelector('[data-retry-quiz]'));assert.equal(run('state.active.pending.solved'),false);run('showQuiz()');run(`answer(quizOptions.findIndex(o=>o===D.quizzes.find(q=>q.id===state.active.pending.id).answer))`);assert(doc.querySelector('[data-next-pair]'));assert.equal(run('state.active.pending.solved'),true);run('nextPair()');
 }
 assert.equal(run('screen'),'clear');assert.equal(run('E.points(state)'),level*100);
}
assert.equal(run('state.proof'),true);assert.equal(run('state.crests.length'),5);
run('go("collection")');assert.equal(doc.querySelectorAll('[data-detail]').length,5);run('detail("nobunaga")');assert(doc.querySelector('.history-details'));run('modal.close();go("castle")');assert(doc.querySelector('.castle-panel'));
run('finale()');assert(doc.querySelector('[data-open-chest]'));run('openChest()');advance(1300);assert(doc.querySelector('#treasure-scene').classList.contains('leaking'));advance(1200);assert(doc.querySelector('#treasure-scene').classList.contains('opened'));advance(1700);assert(doc.querySelector('#treasure-scene').classList.contains('celebrate'));assert(doc.querySelectorAll('.coin').length>=60);assert.equal(doc.querySelectorAll('.rice').length,12);advance(1200);assert.equal(doc.querySelector('#final-title').textContent,'天下統一達成！');assert(sounds.includes('win'));assert(sounds.includes('clear'));assert(sounds.includes('wrong'));assert(sounds.includes('correct'));
run('finale();openChest();finishFinale()');assert.equal(doc.querySelector('#final-title').textContent,'天下統一達成！');
run('go("title")');assert.equal(run('E.load(storage,D).cleared.length'),10);assert.equal(run('E.load(storage,D).proof'),true);
// ナビゲーション後に古いタイマーがゲームを変えない。
run('startFresh(1);flip(state.active.order[0]);flip(state.active.order.find(k=>E.card(state.active,k,D).owner!==E.card(state.active,state.active.order[0],D).owner));go("stages")');advance(2000);assert.equal(run('screen'),'stages');
console.log('PASS: DOMハーネスで8画面・全10ステージ95ペアの実UI処理・誤答→再挑戦→正解・家紋図鑑・城・宝箱10段階演出/スキップ・保存・古いタイマー無効化を確認（描画/実音は対象外）');
