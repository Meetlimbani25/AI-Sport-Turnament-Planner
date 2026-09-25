import {Router} from 'express';import multer from 'multer';import path from 'path';import fs from 'fs';import {Document} from '../models/index.js';import {w} from '../middleware/auth.js';import {ingest} from '../services/ragService.js';
const up=multer({dest:'uploads/',limits:{fileSize:10*1024*1024},fileFilter:(q,f,cb)=>['.pdf','.txt','.docx'].includes(path.extname(f.originalname).toLowerCase())?cb(null,true):cb(Object.assign(new Error('Only PDF, TXT and DOCX files are allowed'),{status:400}))});
const r=Router();
r.get('/',w(async(q,s)=>s.json(await Document.findAll({order:[['id','DESC']]}))));
r.post('/upload',up.single('file'),w(async(q,s)=>{if(!q.file)return s.status(400).json({message:'Choose a file to upload'});const d=await Document.create({name:q.file.originalname,path:q.file.path,sport:q.body.sport||'General',category:q.body.category||'Rules',status:'Pending'});await ingest(d);s.status(201).json(d)}));
r.delete('/:id',w(async(q,s)=>{const d=await Document.findByPk(q.params.id);if(!d)return s.status(404).json({message:'Not found'});fs.rm(d.path,()=>{});await d.destroy();s.json({ok:true})}));
export default r;
