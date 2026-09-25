import {Router} from 'express';import {Tournament,Team,Match} from '../models/index.js';import {w} from '../middleware/auth.js';
const r=Router(),cnt=(a,k)=>Object.entries(a.reduce((o,x)=>{const v=x[k]||'Other';o[v]=(o[v]||0)+1;return o},{})).map(([name,value])=>({name,value}));
r.get('/stats',w(async(q,s)=>{const [t,teams,m]=await Promise.all([Tournament.findAll({order:[['id','DESC']]}),Team.count(),Match.findAll({include:[{model:Tournament,attributes:['name']}],order:[['date','ASC'],['time','ASC']]})]);
const today=new Date().toISOString().slice(0,10),up=m.filter(x=>x.status!=='Completed'&&x.date>=today);
s.json({totals:{tournaments:t.length,active:t.filter(x=>x.status==='Active').length,teams,upcoming:up.length},bySport:cnt(t,'sport'),byStatus:cnt(t,'status'),recent:t.slice(0,5),upcoming:up.slice(0,6)})}));
export default r;
