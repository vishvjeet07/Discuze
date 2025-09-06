import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    topic: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Topic'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },

});

const User = mongoose.model('User',userschema);

export default User;