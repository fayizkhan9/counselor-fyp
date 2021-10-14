const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = mongoose.Schema({
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


const Like = mongoose.model('Like', likeSchema);

module.exports = { Like }
