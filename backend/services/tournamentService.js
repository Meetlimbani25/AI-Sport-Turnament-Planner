const rn=c=>c===1?'Final':c===2?'Semi Final':c===4?'Quarter Final':`Round of ${c*2}`;
export function knockout(t){const size=2**Math.ceil(Math.log2(Math.max(t.length,2))),m=[];let c=size/2;
for(let i=0;i<c;i++)m.push({round:rn(c),team1:t[i]||'BYE',team2:t[size-1-i]||'BYE'});
while(c>1){const prev=rn(c);c/=2;for(let i=0;i<c;i++)m.push({round:rn(c),team1:`Winner ${prev} ${2*i+1}`,team2:`Winner ${prev} ${2*i+2}`})}return m}
export function roundRobin(t){const a=[...t];if(a.length%2)a.push('BYE');const n=a.length,m=[];
for(let r=0;r<n-1;r++){for(let i=0;i<n/2;i++){const x=a[i],y=a[n-1-i];if(x!=='BYE'&&y!=='BYE')m.push({round:`Round ${r+1}`,team1:x,team2:y})}a.splice(1,0,a.pop())}return m}
export function groupKO(t){const h=Math.ceil(t.length/2),g=(x,l)=>roundRobin(x).map(m=>({...m,round:`Group ${l} - ${m.round}`}));
return [...g(t.slice(0,h),'A'),...g(t.slice(h),'B'),{round:'Semi Final',team1:'Winner Group A',team2:'Runner-up Group B'},{round:'Semi Final',team1:'Winner Group B',team2:'Runner-up Group A'},{round:'Final',team1:'Winner Semi Final 1',team2:'Winner Semi Final 2'}]}
export function schedule(ms,{startDate,grounds=1,matchDuration=60,restTime=15,venue=''}){
const g=Math.max(+grounds,1),step=+matchDuration+ +restTime,per=Math.max(Math.floor(540/step),1),d0=new Date(startDate||Date.now()),p=x=>String(x).padStart(2,'0');
return ms.map((m,i)=>{const slot=Math.floor(i/g),d=new Date(d0);d.setUTCDate(d.getUTCDate()+Math.floor(slot/per));const t=540+(slot%per)*step;
return {...m,date:d.toISOString().slice(0,10),time:`${p(Math.floor(t/60))}:${p(t%60)}`,ground:`Ground ${i%g+1}`,venue}})}
