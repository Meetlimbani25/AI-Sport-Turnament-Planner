import axios from 'axios';
const api=axios.create({baseURL:'/api'});
api.interceptors.request.use(c=>{const t=localStorage.getItem('token');if(t)c.headers.Authorization=`Bearer ${t}`;return c});
api.interceptors.response.use(r=>r,e=>{if(e.response?.status===401&&!e.config.url.includes('/auth/')){localStorage.clear();location.href='/login'}return Promise.reject(e)});
export const errMsg=e=>e.response?.data?.message||'Cannot reach the server. Is the backend running?';
export default api;
