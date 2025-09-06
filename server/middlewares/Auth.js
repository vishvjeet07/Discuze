import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const isAuthenticated = async (req,res,next) =>{
    let token = req.cookies.token;

    if(!token) res.redirect('/user/login');

    const decoded = jwt.verify(token,process.env.JWT);
    const id = decoded.userId;

    let user = await User.findById(id);

    if(!user) res.redirect('/user/login');

    next();

}