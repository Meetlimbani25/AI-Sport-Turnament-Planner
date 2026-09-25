import {Router} from 'express';import {z} from 'zod';import {generatePlan,chat,Plan} from '../services/aiService.js';import {AiGeneration,Tournament,Match} from '../models/index.js';import {w} from '../middleware/auth.js';
const r=Router(),n=(d)=>z.coerce.number().int().min(1).default(d);
const In=z.object({sport:z.string().min(1),teams:z.coerce.number().int().min(2).max(64),format:z.string().min(1),startDate:z.string().min(1),endDate:z.string().optional().nullable(),grounds:n(1),matchDuration:z.coerce.number().int().min(10).default(60),restTime:z.coerce.number().int().min(0).default(15),venue:z.string().optional(),special:z.string().optional()});
r.post('/generate-plan',w(async(q,s)=>{const i=In.parse(q.body),plan=await generatePlan(i);await AiGeneration.create({type:'plan',prompt:JSON.stringify(i),response:plan,status:'success'});s.json({plan,provider:process.env.AI_PROVIDER||'mock'})}));
r.post('/chat',w(async(q,s)=>{const {message}=z.object({message:z.string().min(1).max(1000)}).parse(q.body),reply=await chat(message);await AiGeneration.create({type:'chat',prompt:message,response:{reply},status:'success'});s.json({reply})}));
r.post('/save-plan',w(async(q,s)=>{const p=Plan.parse(q.body.plan),i=In.parse(q.body.input);
const t=await Tournament.create({name:p.tournamentName,sport:i.sport,format:p.format,numTeams:i.teams,startDate:i.startDate,endDate:i.endDate||null,venue:i.venue,grounds:i.grounds,matchDuration:i.matchDuration,restTime:i.restTime,description:p.summary,rules:p.rules,status:'Draft'});
await Match.bulkCreate(p.matches.map(m=>({...m,tournamentId:t.id})));s.status(201).json(t)}));
export default r;
