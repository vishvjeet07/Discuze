import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic'
    }
},{
  timestamps: true // ✅ adds createdAt and updatedAt
})

const Comment = mongoose.model('Comment',commentSchema);

export default Comment;