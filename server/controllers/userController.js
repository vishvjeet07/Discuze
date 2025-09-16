import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Topic from '../models/topic.model.js';

export const profilePage = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ success: false, message: "Please Login" });
    }
    const user = jwt.verify(token, process.env.JWT);
    const userInfo = await User.findById(user.userId).populate('topic');
    
    if (!userInfo) {
      return res.json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, userInfo, topics: userInfo.topic });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateInfo = async (req, res) => {
  try {
    const token = req.cookies.token;
    console.log(token);
    if (!token){
      return res.json({ success: false, message: "Please Login" });
    }
    console.log(req.body);
    const user = jwt.verify(token, process.env.JWT);
    const { username, email } = req.body;
    const userInfo = await User.findByIdAndUpdate(user.userId,{
      username: username,
      email: email
    });

    res.json({ success: true, message: "Details Updated Successfully", userInfo})
  } catch (error) {
    res.json({ success: false, message: "User Info not updated "});
  }
}


export const createTopic = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ success: false, message: "Please Login" });
    }

    const user = jwt.verify(token, process.env.JWT);
    const foundUser = await User.findOne({ email: user.email });

    const { topic } = req.body;
    if (!topic) {
      return res.json({ success: false, message: "Please enter topic" });
    }
    const newTopic = await Topic.create({
      name: topic,
      recipient: foundUser._id,
    });

    foundUser.topic.push(newTopic._id);
    await foundUser.save();

    res.json({ success: true, message: "Topic created successfully", topic: newTopic });

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
    const foundUser = await User.findOne({ email: user.email });

    if (!foundUser) {
      return res.json({ success: false, message: "User not found" });
    }

    const { name } = req.params;
    if (!name) {
      return res.json({ success: false, message: "Please provide a topic name" });
    }

    const deletedTopic = await Topic.findOneAndDelete({ name, recipient: foundUser._id });

    if (!deletedTopic) {
      return res.json({ success: false, message: "Topic not found or not authorized" });
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
