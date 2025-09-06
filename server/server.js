import express from 'express';
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js'
import publicRouter from './routes/publicRoutes.js';
import userRouter from './routes/userRoutes.js';
import cors from 'cors';


const app = express();

await connectDB();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.FRONTEND_URL,  // frontend origin
  credentials: true                // allow cookies/auth headers
}));

app.use('/api/auth',authRouter);
app.use('/api/topic',publicRouter);
app.use('/api/user',userRouter);


app.listen(3000);