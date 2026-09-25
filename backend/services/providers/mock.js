import {knockout,roundRobin,groupKO,schedule} from '../tournamentService.js';
const SPORT={Cricket:'Each match is 20 overs per side; standard playing conditions apply.',Football:'Two halves of 45 minutes; extra time and penalties decide knockout ties.',Basketball:'Four 10-minute quarters; 5-minute overtime if tied.',Volleyball:'Best of five sets, 25 points per set, win by two.',Badminton:'Best of three games to 21 points.',Tennis:'Best of three sets with a tie-break at 6-6.',Kabaddi:'Two halves of 20 minutes with standard scoring.'};
const names=n=>Array.from({length:n},(_,i)=>`Team ${i+1}`);
const recommend=n=>n<=8?'Knockout':n<=12?'Round Robin':'Group + Knockout';
const rules=s=>[SPORT[s]||'Match format and scoring follow the organizer\'s custom rules.','Teams must report 15 minutes before the scheduled start.','Each team submits its squad list before its first match.','A team that is 15 minutes late forfeits the match.','Ties are broken by head-to-head result, then score difference.','Organizer decisions on disputes are final.'];
export default {
async plan(prompt,i){const f=i.format,t=names(i.teams),base=f==='Round Robin'?roundRobin(t):f==='Group + Knockout'?groupKO(t):knockout(t),matches=schedule(base,{...i,venue:i.venue||'Main Venue'});
const days=new Set(matches.map(m=>m.date)).size,rec=recommend(i.teams),last=matches.at(-1)?.date,rc=[`${matches.length} matches fit in ${days} day(s) using ${i.grounds} ground(s).`];
if(rec!==f)rc.push(`For ${i.teams} teams, ${rec} usually balances fairness and time better than ${f}.`);
if(i.endDate&&last>i.endDate)rc.push(`The schedule ends on ${last}, after your end date. Add a ground or shorten matches.`);
if(i.special)rc.push(`Special requirement noted: ${i.special}`);
rc.push('Keep one spare slot per day for weather delays.');
return {tournamentName:`${i.sport} ${f==='Round Robin'?'League':f==='Knockout'?'Cup':'Championship'} ${new Date(i.startDate).getUTCFullYear()}`,format:f,summary:`${i.teams} teams play a ${f} ${i.sport} tournament from ${i.startDate} to ${last} at ${i.venue||'the main venue'}.`,rules:rules(i.sport),matches,recommendations:rc}},
async chat(msg){const l=msg.toLowerCase(),n=+(l.match(/\d+/)||[8])[0],sport=Object.keys(SPORT).find(s=>l.includes(s.toLowerCase()))||'Cricket';
if(l.includes('rule'))return `Suggested rules for a ${sport} tournament:\n`+rules(sport).map((r,i)=>`${i+1}. ${r}`).join('\n');
if(l.includes('format'))return `For ${n} teams I recommend ${recommend(n)}. Knockout is fastest, Round Robin is fairest, and Group + Knockout suits 13 or more teams.`;
if(/knockout|schedule|fixture/.test(l)){const m=schedule(knockout(names(Math.min(n,32))),{startDate:new Date(),grounds:2});return `${n} teams need ${m.length} knockout matches. Opening round:\n`+m.slice(0,4).map(x=>`${x.round}: ${x.team1} vs ${x.team2} (${x.date} ${x.time}, ${x.ground})`).join('\n')+'\nOpen the Plan Generator for the full schedule.'}
return 'I can suggest formats, fixtures, schedules and rules. Try "What format should I use for 12 teams?" (Demo reply: no LLM connected yet.)'}};
