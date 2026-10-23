'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const D=require('../data.js'),E=require('../engine.js');
let mem=new Map(),storage={getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,v)},s=E.blank();
assert.equal(D.stages.length,10);assert.equal(D.quizzes.length,100);
assert.equal(E.start(s,2,D),null,'次の章はクリアするまで開かない');
let allQuestions=new Set();
for(const q of D.quizzes){assert.equal(q.options.length,3);assert.equal(new Set(q.options).size,3);assert(q.options.includes(q.answer));assert(q.explanation);assert(!allQuestions.has(q.id));allQuestions.add(q.id)}
for(let level=1;level<=10;level++){
 const a=E.start(s,level,D),expected=(level+4)*2,asked=new Set();
 assert.equal(a.order.length,expected);assert.equal(new Set(a.order).size,expected);
 assert.equal(new Set(a.pairIds.map(id=>D.stages[level-1].candidates.find(c=>c.id===id).owner)).size,5);
 assert.equal(E.complete(s),null,'途中では報酬を得ない');
 const remaining=()=>a.order.filter(id=>!a.matched.includes(id));
 while(remaining().length){let x=remaining().find(id=>id.endsWith(':w'));let owner=E.card(a,x,D).owner;
 let wrong=remaining().find(id=>id.endsWith(':i')&&E.card(a,id,D).owner!==owner);
 if(wrong)assert(!E.isPair(a,x,wrong,D));assert(!E.isPair(a,x,x,D));
 let y=remaining().find(id=>id.endsWith(':i')&&E.card(a,id,D).owner===owner);assert(E.isPair(a,x,y,D));a.matched.push(x,y);a.moves++;
 let q=E.question(s,owner,D);assert(q.level<=level);assert.equal(q.owner,owner);assert(!asked.has(q.id),'ステージ内で問題を重複させない');asked.add(q.id);
 // 不正解は状態を進めず、正解だけで家紋を追加する。
 assert.notEqual(q.options.find(o=>o!==q.answer),q.answer);assert.equal(a.pending.solved,false);
 a.pending.solved=true;if(!s.crests.includes(owner))s.crests.push(owner);
 assert.equal(E.complete(s),null,'クイズ結果の確認前にクリア扱いにしない');
 E.save(storage,s);let restored=E.load(storage,D);assert.deepEqual(restored.active.pending,a.pending);assert.deepEqual(restored.active.matched,a.matched);assert.deepEqual(restored.active.usedQuestions,a.usedQuestions);
 a.pending=null;
 }
 const reward=E.complete(s);assert.equal(reward.gain,100);assert.equal(E.points(s),level*100);E.save(storage,s);s=E.load(storage,D);assert.equal(E.points(s),level*100);assert.equal(E.unlocked(s,Math.min(10,level+1)),true);
 const repeat=E.start(s,level,D);repeat.matched=[...repeat.order];repeat.pending=null;const again=E.complete(s);assert.equal(again.gain,0);assert.equal(E.points(s),level*100,'再挑戦で加点しない');
}
assert.equal(E.points(s),1000);assert.equal(E.castle(s),5);assert.equal(s.proof,true);assert.equal(s.crests.length,5);
for(const [p,rank] of [[0,0],[100,1],[200,1],[300,2],[500,3],[700,4],[1000,5]])assert.equal(E.castle({...E.blank(),cleared:Array.from({length:p/100},(_,i)=>i+1)}),rank);
assert.equal(E.load({getItem:()=>'{bad'},D).cleared.length,0);assert.equal(E.save({setItem:()=>{throw Error('quota')}},s),false);
let invalid={...s,active:{level:10,pairIds:['not-real']}};storage.setItem(E.KEY,JSON.stringify(invalid));assert.equal(E.load(storage,D).active,null);
let replay=E.blank();E.start(replay,1,D);let q1=E.question(replay,D.warriors[0].id,D);replay.active.pending=null;let q2=E.question(replay,D.warriors[0].id,D);assert.notEqual(q1.id,q2.id);
// 全ての参照画像、8画面の素材とデータ構造を検証。
const root=path.resolve(__dirname,'..');let assets=new Set(['assets/backgrounds/adventure.webp','assets/treasure/closed.webp','assets/treasure/open.webp',...D.warriors.map(w=>w.image),...D.stages.flatMap(s=>s.candidates.map(c=>c.image)),...Array.from({length:6},(_,i)=>`assets/castles/${i}.webp`)]);for(const file of assets)assert(fs.existsSync(path.join(root,file)),file+' が存在する');
for(const file of ['data.js','engine.js','game.js','audio.js'])new (require('node:vm').Script)(fs.readFileSync(path.join(root,file),'utf8'),{filename:file});
console.log('PASS: 全10ステージ・100問・10〜28枚・95ペア・誤答/再挑戦の状態・1000pt上限・重複加点防止・家紋5人・5段階の城・途中保存/復元・問題の重複防止・破損保存対応・全画像参照・構文');
