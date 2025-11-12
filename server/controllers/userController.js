import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Topic from "../models/topic.model.js";
import nodemailer from "nodemailer";

export const profilePage = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ success: false, message: "Please Login" });
    }
    const user = jwt.verify(token, process.env.JWT);
    const userInfo = await User.findById(user.userId).select("-password").populate("topic");

    if (!userInfo) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, userInfo, topics: userInfo.topic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateInfo = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ success: false, message: "Please Login" });
    }
    const user = jwt.verify(token, process.env.JWT);
    const { username, email } = req.body;
    const userInfo = await User.findByIdAndUpdate(user.userId, {
      username: username,
      email: email,
    }).select("-password");

    res.json({
      success: true,
      message: "Details Updated Successfully",
      userInfo,
    });
  } catch (error) {
    res.json({ success: false, message: "User Info not updated " });
  }
};

export const createTopic = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ success: false, message: "Please Login" });
    }

    const user = jwt.verify(token, process.env.JWT);
    const foundUser = await User.findOne({ email: user.email }).select("-password");

    const { topic } = req.body;
    if (!topic) {
      return res.json({ success: false, message: "Please enter topic" });
    }
    if (foundUser?.isVerified === true) {
      const newTopic = await Topic.create({
        name: topic,
        recipient: foundUser._id,
      });

      foundUser.topic.push(newTopic._id);
      await foundUser.save();
      res.json({
        success: true,
        message: "Topic created successfully",
        topic: newTopic,
      });
    }else{
      res.json({
        success: false,
        message: "Please verify email to create Topic",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTopic = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ success: false, message: "Please Login" });
    }

    const user = jwt.verify(token, process.env.JWT);
    const foundUser = await User.findOne({ email: user.email }).select("-password");

    if (!foundUser) {
      return res.json({ success: false, message: "User not found" });
    }

    const { name } = req.params;
    if (!name) {
      return res.json({
        success: false,
        message: "Please provide a topic name",
      });
    }

    const deletedTopic = await Topic.findOneAndDelete({
      name,
      recipient: foundUser._id,
    });

    if (!deletedTopic) {
      return res.json({
        success: false,
        message: "Topic not found or not authorized",
      });
    }

    await User.findByIdAndUpdate(
      user.userId,
      { $pull: { topic: deletedTopic._id } },
      { new: true }
    );

    res.json({ success: true, message: "Deleted successfully", deletedTopic });
  } catch (error) {
    console.error("Error in deleteTopic:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendVerificationEmail = async (req,res) =>{
  try {
    const token = req.cookies.token;
    
    if(!token){
      res.json({ success: false, message: "Please Login "});
    }

    
    const decoded = jwt.verify(token,process.env.JWT);
    const id = decoded.userId;
    
    let user = await User.findById(id);

     const verifyUrl = `${process.env.BACKEND_URL}/auth/verify-email/${token}`;
      const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
        },
      });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user?.email,
      subject: "Verify your email",
      html: `<h3>Click the link to verify your email:</h3>
             <a href="${verifyUrl}">${verifyUrl}</a>`
    });
    res.json({ success: true, message: "Verification email sent!" });
  } catch (error) {
    
  }
}
