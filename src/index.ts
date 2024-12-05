import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import {user, todo} from './routes/index';
import connectDatabase from './config/connection';
import errorhandler from "./error/handler.js";


dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000; 

// Database Connection
connectDatabase();

app.use(express.json());

app.use("/user", user);  
app.use("/todo", todo);  
app.use(errorhandler);


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
