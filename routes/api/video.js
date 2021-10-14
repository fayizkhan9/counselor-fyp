const express = require("express");
const router = express.Router();

const { Video } = require("../../models/Video");
const { Subscriber } = require("../../models/Subscriber");
const VideosComments = require("../../models/VideosComments");
const { Like } = require("../../models/Like");
const { Dislike } = require("../../models/Dislike");




const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");
var path = require("path");
ffmpeg.setFfmpegPath(path.join(__dirname, '../../bin/ffmpeg.exe'));
ffmpeg.setFfprobePath(path.join(__dirname, '../../bin/ffprobe.exe'));




var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".mp4") {
      return cb(res.status(400).end("only jpg, png, mp4 is allowed"), false);
    }
    cb(null, true);
  },
});

var upload = multer({ storage: storage }).single("file");

//=================================
//             User
//=================================

router.post("/uploadfiles", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});




router.post("/thumbnail", (req, res) => {
  let thumbsFilePath = "";
  let fileDuration = "";

  ffmpeg.ffprobe(req.body.filePath, function (err, metadata) {

    fileDuration = metadata.format.duration;

  });

  ffmpeg(req.body.filePath)
    .on("filenames", function (filenames) {
      console.log("Will generate " + filenames.join(", "));
      thumbsFilePath = "uploads/thumbnails/" + filenames[0];
    })
    .on("end", function () {
      console.log("Screenshots taken");
      return res.json({
        success: true,
        thumbsFilePath: thumbsFilePath,
        fileDuration: fileDuration,
      });
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 3,
      folder: "uploads/thumbnails",
      size: "320x240",
      // %b input basename ( filename w/o extension )
      filename: "thumbnail-%b.png",
    });
});





router.get("/getVideos", async (req, res) => {
  
  try {
    const videos = await Video.find().populate('user');
    res.status(200).json({ success: true, videos });
  } catch (err) {
    res.status(400).send(err);
  }

});





router.post("/uploadVideo", (req, res) => {

  const video = new Video(req.body);

  video.save((err, video) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});





router.post("/getVideo", async (req, res) => {
    try {
        const {videoId} = req.body;
        const video = await Video.findOne({_id: videoId}).populate('user');
        res.status(200).json({ success: true, video });

    } catch (err) {
      res.status(400).send(err)
    }

});





router.post("/getSubscriptionVideos", (req, res) => {
  //Need to find all of the Users that I am subscribing to From Subscriber Collection

  Subscriber.find({ userFrom: req.body.userFrom }).exec((err, subscribers) => {
    if (err) return res.status(400).send(err);

    let subscribedUser = [];

    subscribers.map((subscriber, i) => {
      subscribedUser.push(subscriber.userTo);
    });

    //Need to Fetch all of the Videos that belong to the Users that I found in previous step.
    Video.find({ user: { $in: subscribedUser } })
      .populate("user")
      .exec((err, videos) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, videos });
      });
  });
});




// Video Comments

router.post("/saveComment", async (req, res) => {

 try {

  const comment = new VideosComments(req.body)

  const newComment = new VideosComments({
    user: req.body.user,
    content: req.body.content,
    postId: req.body.postId,
    responseTo: req.body.user
  });

  const newComm =  await newComment.save();
  

  const result = await VideosComments.find({'_id':newComm._id}).populate('user');
  res.status(200).json({ success: true, result })
   
 } 
 catch (err) {
  res.json({ success: false, err })
 }

})




router.post("/getComments", (req, res) => {

  VideosComments.find({ "postId": req.body.videoId })
      .populate('user')
      .exec((err, comments) => {
          if (err) return res.status(400).send(err)
          res.status(200).json({ success: true, comments })
      })

});




//=================================
//             Likes DisLikes
//=================================

router.post("/getLikes", (req, res) => {

  let variable = {}
  if (req.body.videoId) {
      variable = { videoId: req.body.videoId }
  } else {
      variable = { commentId: req.body.commentId }
  }

  Like.find(variable)
      .exec((err, likes) => {
          if (err) return res.status(400).send(err);
          res.status(200).json({ success: true, likes })
      })
})



router.post("/getDislikes", (req, res) => {

  let variable = {}
  if (req.body.videoId) {
      variable = { videoId: req.body.videoId }
  } else {
      variable = { commentId: req.body.commentId }
  }

  Dislike.find(variable)
      .exec((err, dislikes) => {
          if (err) return res.status(400).send(err);
          res.status(200).json({ success: true, dislikes })
      })

})


router.post("/upLike", (req, res) => {

  let variable = {}
  if (req.body.videoId) {
      variable = { videoId: req.body.videoId, userId: req.body.userId }
  } else {
      variable = { commentId: req.body.commentId , userId: req.body.userId }
  }

  const like = new Like(variable)
  //save the like information data in MongoDB
  like.save((err, likeResult) => {
      if (err) return res.json({ success: false, err });
      //In case disLike Button is already clicked, we need to decrease the dislike by 1 
      Dislike.findOneAndDelete(variable)
          .exec((err, disLikeResult) => {
              if (err) return res.status(400).json({ success: false, err });
              res.status(200).json({ success: true })
          })
  })

})



router.post("/unLike", (req, res) => {

  let variable = {}
  if (req.body.videoId) {
      variable = { videoId: req.body.videoId, userId: req.body.userId }
  } else {
      variable = { commentId: req.body.commentId , userId: req.body.userId }
  }

  Like.findOneAndDelete(variable)
      .exec((err, result) => {
          if (err) return res.status(400).json({ success: false, err })
          res.status(200).json({ success: true })
      })

})



router.post("/unDisLike", (req, res) => {

  let variable = {}
  if (req.body.videoId) {
      variable = { videoId: req.body.videoId, userId: req.body.userId }
  } else {
      variable = { commentId: req.body.commentId , userId: req.body.userId }
  }

  Dislike.findOneAndDelete(variable)
  .exec((err, result) => {
      if (err) return res.status(400).json({ success: false, err })
      res.status(200).json({ success: true })
  })


})




router.post("/upDisLike", (req, res) => {

  let variable = {}
  if (req.body.videoId) {
      variable = { videoId: req.body.videoId, userId: req.body.userId }
  } else {
      variable = { commentId: req.body.commentId , userId: req.body.userId }
  }

  const disLike = new Dislike(variable)
  //save the like information data in MongoDB
  disLike.save((err, dislikeResult) => {
      if (err) return res.json({ success: false, err });
      //In case Like Button is already clicked, we need to decrease the like by 1 
      Like.findOneAndDelete(variable)
          .exec((err, likeResult) => {
              if (err) return res.status(400).json({ success: false, err });
              res.status(200).json({ success: true })
          })
  })


})



//=================================
//             Subscribe
//=================================


router.post("/subscribeNumber", (req, res) => {

  Subscriber.find({ "userTo": req.body.userTo })
  .exec((err, subscribe) => {
      if(err) return res.status(400).send(err)

      res.status(200).json({ success: true, subscribeNumber: subscribe.length  })
  })

});



router.post("/subscribed", (req, res) => {

  Subscriber.find({ "userTo": req.body.userTo , "userFrom": req.body.userFrom })
  .exec((err, subscribe) => {
      if(err) return res.status(400).send(err)

      let result = false;
      if(subscribe.length !== 0) {
          result = true
      }

      res.status(200).json({ success: true, subcribed: result  })
  })

});



router.post("/subscribe", (req, res) => {

  const subscribe = new Subscriber(req.body);

  subscribe.save((err, doc) => {
      if(err) return res.json({ success: false, err })
      return res.status(200).json({ success: true })
  })

});


router.post("/unSubscribe", (req, res) => {

  console.log(req.body)

  Subscriber.findOneAndDelete({ userTo: req.body.userTo, userFrom: req.body.userFrom })
      .exec((err, doc)=>{
          if(err) return res.status(400).json({ success: false, err});
          res.status(200).json({ success: true, doc })
      })
});


module.exports = router;
