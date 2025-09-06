import bcrypt from 'bcrypt'
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken'

export const register = async (req,res) =>{
    const { username, email, password } = req.body;
    if(username == "" || email == "" || password == ""){
        return res.status(400).json({ 
        message: "All fields are required",
        success: false 
        });
    }
    try {
        let user = await User.findOne({email});
        if(user){
                return res.status(400).json({ 
                message: "User already exists",
                success: false 
            });
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

        res.cookie('token',token);

        res.json({ message: "account created ",token, success: true });
        
    } catch (error) {
        console.log(error);
        res.json({ message: "account not created ", success: false });
    }
    
}


export const login = async (req,res) =>{
    const { email, password } = req.body;
    if(email == "" || password == ""){
        return res.status(204).json({
            message: "please enter email or password",
            success: false
        });
    }

    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({ 
            message: "User not found",
            success: false 
            });
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
                return res.status(401).json({ 
                message: "Invalid credentials",
                success: false 
            });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT,
        );
        res.cookie('token',token);
        res.json({ message: "account created ",token, success: true });
    }catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            message: "Server error",
            success: false 
        });
    }
}

export const logout = async (req,res) => {
    try {
        res.cookie("token","");
        res.json({success:true,message:"Logout Successfully"})
    } catch (error) {
        console.error("Login error:", error);
        res.json({ 
            message: "Server error",
            success: false 
        });
    }
}
