/* オリジナルの五音音階BGMと効果音。外部素材・ダウンロード不要。 */
'use strict';
const GameAudio=(()=>{let ctx,master,timer,step=0,volume=.35,muted=false,enabled=false;const melody=[62,69,74,76,74,69,67,69,62,67,69,74,76,81,76,74,69,67,62,57,62,67,69,62];
function setup(){try{if(!ctx){let AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;ctx=new AC();master=ctx.createGain();master.connect(ctx.destination)}if(ctx.state==='suspended')ctx.resume().catch(()=>{});return true}catch{return false}}
function settings(v,m){volume=v;muted=m;if(master)master.gain.setTargetAtTime(muted?0:volume*.42,ctx.currentTime,.05)}
function note(midi,start=0,duration=.3,type='triangle',gain=.3){if(!enabled||!ctx)return;let t=ctx.currentTime+start,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=440*2**((midi-69)/12);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(gain,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(master);o.start(t);o.stop(t+duration+.02)}
function bgm(){if(!enabled||document.hidden)return;note(melody[step%melody.length],0,.55,'triangle',.19);if(step%4===0){note([38,43,45,43][Math.floor(step/4)%4],0,.8,'sine',.2);note(86,0,.08,'triangle',.025)}step++}
function activate(){if(!setup())return false;enabled=true;settings(volume,muted);if(!timer){bgm();timer=setInterval(bgm,420)}return true}
function play(name){if(!enabled||muted)return;let seq={flip:[83],pair:[74,81,86],correct:[74,78,81,86],wrong:[62,59],clear:[62,66,69,74,78,81,86],open:[38,45,50,62,74],coin:[93,98,105],win:[62,69,74,78,81,86,81,86,90,93],grow:[62,67,69,74,81]}[name]||[74];seq.forEach((m,i)=>note(m,i*(name==='flip'?.03:.105),name==='flip'?.12:.6,name==='open'?'sine':'triangle',name==='wrong'?.15:.26));if(name==='clear'||name==='win')for(let i=0;i<4;i++)note(38+i*5,i*.32,1,'sine',.22)}
function stop(){if(timer)clearInterval(timer);timer=null;enabled=false;if(ctx)ctx.suspend().catch(()=>{})}
return {settings,activate,play,stop,get enabled(){return enabled}}})();
