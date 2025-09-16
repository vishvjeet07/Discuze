import User from '../models/user.model.js';
import Topic from '../models/topic.model.js';
import Comment from '../models/comment.model.js';

export const homepage = async (req,res) =>{
  try {
    let topics = await Topic.find();
     for (let i = topics.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [topics[i], topics[j]] = [topics[j], topics[i]];
    }
    res.json({success: true, topics, message:"Topic Fetched Successfully"});

  } catch (error) {
    res.json({success:false, message: error.message});
  }
}

export const topicPage = async (req,res) =>{
  try {
    const name = req.params.name;
    const topic = await Topic.findOne({ name }).populate('comment');
    
    res.json({success: true, topic, comments: topic.comment });
  } catch (error) {
      res.json({success: false, message: error.message});
    }
  }
  
  export const comment = async (req,res) =>{
  try {

    let { comment } = req.body;
    const name = req.params.name;
    const topic = await Topic.findOne({ name });
    const newComment = await Comment.create({
      comment,
      topicId: topic._id
    });
    topic.comment.push(newComment._id);
    await topic.save();
    
    res.json({success:true,message:"comment added"});
    
  } catch (error) {
      res.json({success: false, message: error.message});
    }
}