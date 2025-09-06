import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Topic from '../models/topic.model.js';

export const profilePage = async (req,res) =>{
    const token = req.cookies.token;

    if (!token) {
      return res.json({success: false, message:"Please Login"})
    }

    const user = jwt.verify(token, process.env.JWT);
    const userInfo = await User.findById(user.userId).populate('topic');

    if(!userInfo){
        res.json({success: false, message: 'user not found'})
    }
    res.json({success: true, userInfo, topics: userInfo.topic})
}

export const createTopic = async (req,res) =>{
  const token = req.cookies.token;
  if(!token){
    return res.json({success: false, message:"Please Login"})
  }
  const user = jwt.verify(token, process.env.JWT);
  const foundUser = await User.findOne({email: user.email});
  const { topic } = req.body;
  if (!topic) {
      res.json({success: false, message: 'please enter topic'})
  }
  const newTopic = await Topic.create({
    name:topic,
    recipient:foundUser._id
  });

  foundUser.topic.push(newTopic._id);
  foundUser.save();

  res.json({success: true, message: 'topic created successfully'})
}

export const deleteTopic = async(req,res)=>{

  const token = req.cookies.token;
    if(!token){
    return res.json({success: false, message:"Please Login"})
  }

  const user = jwt.verify(token, process.env.JWT);
  const foundUser = await User.findOne({email: user.email});
  const { name } = req.params;
  if (!name) {
      res.json({success: false, message: 'please enter topic'})
  }
  const deletedTopic = await Topic.findOneAndDelete({name});
  if(deletedTopic){
      await User.findByIdAndUpdate(
      user.userId,
      { $pull: { topic: deletedTopic._id } },
      { new: true }
    );
    res.json({success:true,message:"deleted successfully"});
  }
}