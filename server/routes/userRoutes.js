import express from "express";
import { createTopic, deleteTopic, profilePage, sendVerificationEmail, updateInfo } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/profile',profilePage);
userRouter.post('/create',createTopic);
userRouter.delete('/delete/:name',deleteTopic);
userRouter.post('/update',updateInfo);
userRouter.post('/sendmail',sendVerificationEmail);
export default userRouter;