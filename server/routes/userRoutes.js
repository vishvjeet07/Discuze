import express from "express";
import { createTopic, deleteTopic, profilePage } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/profile',profilePage);
userRouter.post('/create',createTopic);
userRouter.delete('/delete/:name',deleteTopic);

export default userRouter;