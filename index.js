import express from 'express';
import accountsRouter from './routes/accounts.js'
import { promises as fs } from "fs";
import winston from 'winston';
import cors from 'cors';

const { readFile, writeFile } = fs;

const { combine, printf, label, timestamp } = winston.format;
const format = printf(({
    level, message, label, timestamp
  })=>{ return `${timestamp} [${label}] ${level}: ${message}`});
global.fileName = "accounts.json"
global.logger = winston.createLogger({
    level: "silly",
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({filename: "my-bank-api.log"}),
    ],
    format: combine(label({label: 'backend'}),
    timestamp(),
    format) 
});

const app= express();
app.use(express.json());
app.use(cors());
app.use('/account',accountsRouter);
app.listen(3000, async ()=>{
    try{
        await readFile(global.fileName);
        logger.info("API iniciada");
    }
    catch(err){
        const initialJson = {
            nextId: 1,
            accounts: []
        }
        writeFile(global.fileName, JSON.stringify(initialJson)).then(()=>{
            logger.info("API iniciada");
        }).catch((err)=>{
            logger.error(err);
        })
        
    }
   
   
});