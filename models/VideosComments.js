const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VideoCommentsSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }, 
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'video'
    },
    responseTo: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    content: {
        type: String
    }

}, { timestamps: true })


module.exports = mongoose.model('VideosComments', VideoCommentsSchema);
