import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, {
  timestamps: true // ✅ adds createdAt and updatedAt
});

const Topic = mongoose.model('Topic',topicSchema)

export default Topic;