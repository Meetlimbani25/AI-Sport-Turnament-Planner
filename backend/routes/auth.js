import {Router} from 'express';import bcrypt from 'bcryptjs';import jwt from 'jsonwebtoken';import {z} from 'zod';import {User} from '../models/index.js';import {auth,w} from '../middleware/auth.js';
const r=Router(),sign=u=>({token:jwt.sign({id:u.id},process.env.JWT_SECRET,{expiresIn:'7d'}),user:{id:u.id,name:u.name,email:u.email}});
r.post('/register',w(async(q,s)=>{const b=z.object({name:z.string().min(2),email:z.string().email(),password:z.string().min(6)}).parse(q.body);if(await User.findOne({where:{email:b.email}}))return s.status(409).json({message:'Email is already registered'});s.status(201).json(sign(await User.create({...b,password:await bcrypt.hash(b.password,10)})))}));
r.post('/login',w(async(q,s)=>{const b=z.object({email:z.string().email(),password:z.string().min(1)}).parse(q.body);const u=await User.findOne({where:{email:b.email}});if(!u||!(await bcrypt.compare(b.password,u.password)))return s.status(401).json({message:'Incorrect email or password'});s.json(sign(u))}));
r.get('/profile',auth,w(async(q,s)=>s.json(await User.findByPk(q.user.id,{attributes:['id','name','email']}))));
export default r;
