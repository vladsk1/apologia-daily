// tools/fathers/check-dropped-words.cjs — Basil (2026-11-18). From the compare-scan-chunked.cjs reports, finds short runs (1–2 words)
// that the scans print and the transcription lacks (INS), or the reverse (DEL), and tests each in context (4 words either side)
// in all three scans. Read every hit by hand. Run in the folder holding the extracted text, dl/ and the ch-*.json reports.
// Env: TEXT=<extracted.json> SCANS=<scan ids, comma-separated, files dl/<id>.txt> REPORTS=<compare reports, comma-separated> (defaults: the Basil run).
// 2026-11-18 (Augustine): each scan is indexed once as a set of word n-grams (8–10 words), so a context test is a set lookup rather
// than a search of the whole scan; the results are the same, and a long book takes minutes rather than hours. A context shorter
// than four words at the edge of a section falls back to a plain search of the scan.
const fs=require('fs');const J=JSON.parse(fs.readFileSync(process.env.TEXT||'basil-raw.json','utf8'));
const norm=s=>' '+s.toLowerCase().replace(/[’']/g,'').replace(/[^a-z ]+/g,' ').replace(/\s+/g,' ').trim()+' ';
const O=(process.env.SCANS?process.env.SCANS.split(','):['selectlibraryofn08scha','cu31924103070102','selectlibraryofn08schauoft']).map(f=>norm(fs.readFileSync('dl/'+f+'.txt','utf8').replace(/(\w)[-­]\s*\n\s*(\w)/g,'$1$2')));
const G=O.map(t=>{const w=t.trim().split(' ');const set=new Set();for(let n=8;n<=10;n++)for(let i=0;i+n<=w.length;i++)set.add(w.slice(i,i+n).join(' '));return set;});
// how many scans contain the phrase
const inScans=(phrase)=>{const p=phrase.trim().replace(/\s+/g,' ');const n=p.split(' ').length;
 if(n>=8&&n<=10)return G.filter(s=>s.has(p)).length; return O.filter(t=>t.includes(' '+p+' ')).length;};
const files=process.env.REPORTS?process.env.REPORTS.split(','):['ch-selectlibraryofn08scha.json','ch-cu31924103070102.json','ch-C.json'];
const seen=new Set();const res=[];
for(const f of files)for(const r of JSON.parse(fs.readFileSync(f,'utf8')))for(const c of r.changes){const m=c.match(/^(.*) → (.*)$/);if(!m)continue;const a=m[1].trim(),b=m[2].trim();
 // insertion (scan has extra short words) or deletion (hosted has extra short words)
 if((a&&b)||(!a&&!b))continue;const w=(a||b).split(' ');if(w.length>2)continue;const k=r.sec+'|'+a+'|'+b;if(seen.has(k))continue;seen.add(k);
 const [o,n]=r.sec.split('.').map(Number);const S=J.orations.find(x=>x.n===o).sections.find(x=>x.n===n);
 const W=norm(S.paras.join(' ').replace(/\u0001REF[^\u0002]*\u0002/g,' ').replace(/[\u0001-\u0004]/g,' ')).trim().split(' ');
 if(b){ // scan-only words: try every gap
  for(let i=1;i<W.length;i++){const bef=W.slice(Math.max(0,i-4),i).join(' '),aft=W.slice(i,i+4).join(' ');
   const np=inScans(`${bef} ${b} ${aft}`);if(np>=2){const nh=inScans(`${bef} ${aft}`);res.push(`${r.sec} INS print ${np}/3 hosted ${nh}/3 | ${bef} [+${b}] ${aft}`);}}}
 else { const aw=a.split(' ');for(let i=0;i<=W.length-aw.length;i++){if(W.slice(i,i+aw.length).join(' ')!==a)continue;const bef=W.slice(Math.max(0,i-4),i).join(' '),aft=W.slice(i+aw.length,i+aw.length+4).join(' ');
   const np=inScans(`${bef} ${aft}`);if(np>=2){const nh=inScans(`${bef} ${a} ${aft}`);res.push(`${r.sec} DEL print ${np}/3 hosted ${nh}/3 | ${bef} [-${a}] ${aft}`);}}}
}
console.log([...new Set(res)].join('\n'));
