'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const E=require('../engine.js'),D=require('../data.js');
(async()=>{
 const initial=E.blank();assert.equal(initial.muted,false);assert(initial.volume>0);
 let stored;const storage={getItem:()=>stored,setItem:(k,v)=>stored=v};
 initial.muted=true;initial.cleared=[1,2];initial.crests=['nobunaga'];E.save(storage,initial);
 const restored=E.load(storage,D);assert.equal(restored.muted,true);assert.deepEqual(restored.cleared,[1,2]);assert.deepEqual(restored.crests,['nobunaga']);
 let resumes=0,contexts=0,intervals=0,shouldReject=true,notes=0,ac;
 class AC{
 constructor(){contexts++;ac=this;this.currentTime=0;this.state='suspended';this.destination={}}
 createGain(){return {connect(){},gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(){}}}}
 createOscillator(){return {frequency:{value:0},connect(){},start(){notes++},stop(){}}}
 resume(){resumes++;if(shouldReject)return Promise.reject(Error('NotAllowedError'));this.state='running';this.onstatechange?.();return Promise.resolve()}
 suspend(){this.state='suspended';return Promise.resolve()}}
 const c={window:{AudioContext:AC},document:{hidden:false},setInterval:()=>++intervals,clearInterval(){}};vm.createContext(c);vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../audio.js'),'utf8'),c);const run=s=>vm.runInContext(s,c);
 assert.equal(contexts,0,'ページを開いただけではAudioContextを作らない');
 run('GameAudio.settings(.35,false);GameAudio.activate()');assert.equal(resumes,1,'開始操作内でresumeを直接呼ぶ');await Promise.resolve();assert.equal(run('GameAudio.enabled'),false,'拒否されたら再試行できる状態に戻る');
 shouldReject=false;run('GameAudio.activate()');assert.equal(resumes,2);assert.equal(run('GameAudio.status'),'playing');assert.equal(contexts,1,'再試行でも同じAudioContextを使う');
 let before=notes;run('GameAudio.play("flip");GameAudio.play("correct");GameAudio.play("clear")');assert(notes>before,'効果音がON');
 run('GameAudio.settings(.35,true)');before=notes;run('GameAudio.play("flip")');assert.equal(notes,before,'OFFでは発音しない');
 run('GameAudio.settings(.35,false)');ac.state='interrupted';run('GameAudio.activate()');assert.equal(resumes,3,'スマホのinterrupted状態もユーザー操作で再開する');
 let previous=intervals;run('GameAudio.activate()');assert.equal(intervals,previous,'操作を繰り返してもBGMタイマーを増やさない');
 console.log('PASS: 初回ON・OFF保存とゲーム記録保持・開始操作でresume・自動再生拒否後の再試行・interruptedからの復帰・効果音・BGM重複防止');
})().catch(e=>{console.error(e);process.exitCode=1});
