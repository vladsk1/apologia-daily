// tools/fathers/check-spellings.cjs — for every modern spelling in the hosted text, counts how many scans print the older form at that place (Hilary, 2026-11-18). Usage: node check-spellings.cjs <extracted.json> <ocrA> <ocrB> <ocrC>; writes form-sweep.json in the current directory.
// For every occurrence of a modern form in the hosted text, test whether 2+ of 3 scans print the old form in the same context.
const fs=require('fs');const [, , jsonPath, ...ocr]=process.argv;
const J=JSON.parse(fs.readFileSync(jsonPath,'utf8'));
const norm=s=>' '+s.toLowerCase().replace(/[’']/g,'').replace(/[^a-z ]+/g,' ').replace(/\s+/g,' ').trim()+' ';
const O=ocr.map(p=>norm(fs.readFileSync(p,'utf8').replace(/(\w)[-­]\s*\n\s*(\w)/g,'$1$2')));
const PAIRS=[['begot','begat'],['spoke','spake'],['honor','honour'],['honors','honours'],['honored','honoured'],['dishonor','dishonour'],['showing','shewing'],['show','shew'],['shows','shews'],['showed','shewed'],['shown','shewn'],['naught','nought'],['recognize','recognise'],['recognized','recognised'],['realize','realise'],['wrath','wroth'],['color','colour'],['labor','labour'],['favor','favour'],['savior','saviour'],['behavior','behaviour'],['splendor','splendour'],['fulfill','fulfil'],['judgment','judgement'],['fullness','fulness'],['clothed','clad']];
const res={};
for(const o of J.orations)for(const s of o.sections){const W=norm(s.paras.join(' ').replace(/\u0001REF[^\u0002]*\u0002/g,' ').replace(/[\u0001-\u0004]/g,' ')).trim().split(' ');
 W.forEach((w,i)=>{for(const [m,old] of PAIRS){if(w!==m)continue;const b=W.slice(Math.max(0,i-3),i).join(' '),a=W.slice(i+1,i+3).join(' ');
  const keep=O.filter(t=>t.includes(` ${b} ${m} ${a} `)).length, chg=O.filter(t=>t.includes(` ${b} ${old} ${a} `)).length;
  const k=`${m}→${old}`;(res[k]=res[k]||[]).push({sec:`${o.n}.${s.n}`,i,ctx:`${b} [${m}] ${a}`,keep,chg});}});}
for(const [k,v] of Object.entries(res)){const c=v.filter(x=>x.chg>=2),kp=v.filter(x=>x.keep>=2),u=v.filter(x=>x.chg<2&&x.keep<2);
 console.log(`${k}: total ${v.length}, print-old(2+) ${c.length}, print-modern(2+) ${kp.length}, unclear ${u.length}`);u.forEach(x=>console.log(`   ? ${x.sec} ${x.ctx} keep=${x.keep} chg=${x.chg}`));}
fs.writeFileSync('form-sweep.json',JSON.stringify(res,null,1));
