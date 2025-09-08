import bcrypt from 'bcrypt'
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken'

export const register = async (req,res) =>{
    const { username, email, password } = req.body;
    if(username == "" || email == "" || password == ""){
        res.json({ success: false, message: "All fields are required"});
    }
    try {
        let user = await User.findOne({email});
        if(user){
        res.json({ success: false, message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({
            username,
            email,
            password:hashedPassword
        });

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT,
        );

        res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only on production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
        });

        res.json({ success: true, message: "Account created ",token});
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
    
}


export const login = async (req,res) =>{
    const { email, password } = req.body;
    if(email == "" || password == ""){
        return res.json({success: false, message: "Please enter email or password"});
    }

    try {
        const user = await User.findOne({email});
        if(!user){
            return res.json({ success: false, message: "User not found"});
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            return res.json({ success: false, message: "Invalid credentials"});
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT,
        );
        res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only on production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
        });

        res.json({success: true, message: "Login successful ",token});
    }catch (error) {
        res.json({ success: false, message: error.message});
    }
}

export const logout = async (req,res) => {
    try {
        res.cookie("token","");
        res.json({success:true, message:"Logout Successful"})
    } catch (error) {
        console.error("Login error:", error);
        res.json({ success: false, message: error.message});
    }
}
