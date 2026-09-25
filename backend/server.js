import 'dotenv/config';import express from 'express';import cors from 'cors';import fs from 'fs';import {initDb} from './config/db.js';import './models/index.js';
import {auth,errors} from './middleware/auth.js';import authR from './routes/auth.js';import crudR from './routes/crud.js';import dashR from './routes/dashboard.js';import aiR from './routes/ai.js';import docR from './routes/documents.js';
if(!process.env.JWT_SECRET){console.error('Missing JWT_SECRET. Copy .env.example to .env');process.exit(1)}
fs.mkdirSync('uploads',{recursive:true});
const app=express();app.use(cors({origin:(process.env.CORS_ORIGINS||'').split(',')}));app.use(express.json());
app.use('/api/auth',authR);app.use('/api/dashboard',auth,dashR);app.use('/api/ai',auth,aiR);app.use('/api/documents',auth,docR);app.use('/api',auth,crudR);
app.use(errors);
await initDb();app.listen(process.env.PORT||5000,()=>console.log(`API running on http://localhost:${process.env.PORT||5000}`));
