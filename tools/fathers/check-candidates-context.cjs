// tools/fathers/check-candidates-context.cjs — Basil (2026-11-18). For each candidate difference {sec,a,b} (a = transcription words,
// b = scan words) taken from two or more compare-scan-chunked.cjs reports, tests "<3 words before> b <3 words after>" and the
// transcription's own reading in all three scans (normalised) and prints how many scans print each. Read every hit by hand.
// Usage (run in a folder holding basil-raw.json and dl/<scan>.txt): node check-candidates-context.cjs <cands.json> <out.json>
const fs=require('fs');const J=JSON.parse(fs.readFileSync('basil-raw.json','utf8'));const C=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const norm=s=>' '+s.toLowerCase().replace(/[’']/g,'').replace(/[^a-z ]+/g,' ').replace(/\s+/g,' ').trim()+' ';
const O=['selectlibraryofn08scha','cu31924103070102','selectlibraryofn08schauoft'].map(f=>norm(fs.readFileSync('dl/'+f+'.txt','utf8').replace(/(\w)[-­]\s*\n\s*(\w)/g,'$1$2')));
const out=[];
for(const c of C){const [o,n]=c.sec.split('.').map(Number);const S=J.orations.find(x=>x.n===o).sections.find(x=>x.n===n);
 const W=norm(S.paras.join(' ').replace(/\u0001REF[^\u0002]*\u0002/g,' ').replace(/[\u0001-\u0004]/g,' ')).trim().split(' ');
 const a=norm(c.a).trim().split(' '),b=norm(c.b).trim();let best=null;
 for(let i=0;i<=W.length-a.length;i++){if(W.slice(i,i+a.length).join(' ')!==a.join(' '))continue;
  const bef=W.slice(Math.max(0,i-3),i).join(' '),aft=W.slice(i+a.length,i+a.length+3).join(' ');
  const pr=` ${bef} ${b} ${aft} `.replace(/\s+/g,' '),ho=` ${bef} ${a.join(' ')} ${aft} `.replace(/\s+/g,' ');
  const np=O.filter(t=>t.includes(pr)).length,nh=O.filter(t=>t.includes(ho)).length;
  if(!best||np>best.np)best={np,nh,ctx:`${bef} [${a.join(' ')}→${b}] ${aft}`};}
 out.push({...c,...(best||{np:0,nh:0,ctx:'(no occurrence)'})});}
fs.writeFileSync(process.argv[3],JSON.stringify(out,null,1));
for(const x of out.filter(x=>x.np>=1))console.log(`${x.sec} print ${x.np}/3 hosted ${x.nh}/3 | ${x.ctx}`);
