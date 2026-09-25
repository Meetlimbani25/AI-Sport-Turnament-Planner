import {Sequelize} from 'sequelize';import mysql from 'mysql2/promise';import 'dotenv/config';
const {DB_HOST:host='localhost',DB_PORT:port=3306,DB_NAME:name='sports_planner',DB_USER:user='root',DB_PASS:pass=''}=process.env;
const db=new Sequelize(name,user,pass,{host,port,dialect:'mysql',logging:false});
export const initDb=async(force=false)=>{const c=await mysql.createConnection({host,port,user,password:pass});await c.query(`CREATE DATABASE IF NOT EXISTS \`${name}\``);await c.end();await db.sync({force})};
export default db;
