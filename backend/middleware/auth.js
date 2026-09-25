import jwt from 'jsonwebtoken';
export const auth=(q,s,n)=>{try{q.user=jwt.verify((q.headers.authorization||'').replace('Bearer ',''),process.env.JWT_SECRET);n()}catch{s.status(401).json({message:'Session expired. Please sign in again.'})}};
export const w=f=>(q,s,n)=>Promise.resolve(f(q,s,n)).catch(n);
export const errors=(e,q,s,n)=>{if(e.name==='ZodError')return s.status(400).json({message:e.issues.map(i=>`${i.path.join('.')||'input'}: ${i.message}`).join('; ')});if(e.code==='LIMIT_FILE_SIZE')return s.status(413).json({message:'File is larger than 10 MB'});if(!e.status)console.error(e);s.status(e.status||500).json({message:e.status?e.message:'Something went wrong on the server'})};
