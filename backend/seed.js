import bcrypt from 'bcryptjs';import {initDb} from './config/db.js';import {User,Tournament,Team,Player,Match} from './models/index.js';import {knockout,roundRobin,schedule} from './services/tournamentService.js';
await initDb(true);
await User.create({name:'Demo Organizer',email:'demo@planner.com',password:await bcrypt.hash('demo1234',10)});
const day=n=>{const d=new Date();d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
const names=['Thunder XI','Royal Strikers','Blue Hawks','Iron Wolves','Storm Riders','Golden Eagles','Night Owls','Red Dragons'],pos=['Batsman','Bowler','All-rounder','Wicket-keeper','Batsman'];
for(const [i,name] of names.entries()){const t=await Team.create({name,sport:'Cricket',captain:`Captain ${i+1}`,coach:`Coach ${i+1}`});
for(let p=0;p<5;p++)await Player.create({name:`Player ${i+1}.${p+1}`,age:19+p*2,jersey:p+1,position:pos[p],contact:`98${String(i).padStart(2,'0')}00${String(p).padStart(4,'0')}`,teamId:t.id})}
const v='City Sports Complex';
const t1=await Tournament.create({name:'City Cricket Cup',sport:'Cricket',format:'Knockout',numTeams:8,startDate:day(0),endDate:day(5),venue:v,grounds:2,matchDuration:120,restTime:30,description:'Annual inter-club knockout cricket tournament.',status:'Active',rules:['20 overs per side','15 minute late-arrival forfeit']});
for(const [i,m] of schedule(knockout(names),{startDate:day(0),grounds:2,matchDuration:120,restTime:30,venue:v}).entries())await Match.create({...m,tournamentId:t1.id,...(i<2?{status:'Completed',result:`${m.team1} won by 24 runs`}:{})});
const t2=await Tournament.create({name:'Summer Football League',sport:'Football',format:'Round Robin',numTeams:4,startDate:day(14),endDate:day(30),venue:'Riverside Ground',grounds:1,matchDuration:90,restTime:20,status:'Upcoming'});
for(const m of schedule(roundRobin(names.slice(0,4)),{startDate:day(14),matchDuration:90,restTime:20,venue:'Riverside Ground'}))await Match.create({...m,tournamentId:t2.id});
await Tournament.create({name:'Winter Badminton Open',sport:'Badminton',format:'Knockout',numTeams:16,startDate:day(-60),endDate:day(-55),venue:'Indoor Arena',status:'Completed'});
console.log('Seeded. Login: demo@planner.com / demo1234');process.exit(0);
