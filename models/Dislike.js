const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dislikeSchema = mongoose.Schema({
   userId: {
       type: Schema.Types.ObjectId,
       ref: 'user'
   },
   commentId: {
       type: Schema.Types.ObjectId,
       ref: 'videoscomments'
   },
   videoId: {
       type: Schema.Types.ObjectId,
       ref: 'video'
   }

}, { timestamps: true })


const Dislike = mongoose.model('Dislike', dislikeSchema);

module.exports = { Dislike }
