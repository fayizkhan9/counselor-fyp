import React, { useEffect, useState } from "react";
import { Tooltip } from "antd";
import {DislikeOutlined, LikeOutlined } from "@ant-design/icons"
import Axios from "axios";
import { connect } from "react-redux";
import PropTypes from "prop-types";


let variable = {};

function LikeDislikes(props) {
  const [Likes, setLikes] = useState(0);
  const [Dislikes, setDislikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [DislikeAction, setDislikeAction] = useState(null);


  if (props.video) {
    variable = { videoId: props.videoId, userId: props.auth.user._id };
  } else {
    variable = { commentId: props.commentId, userId: props.auth.user._id };
  }

  useEffect(() => {
    Axios.post("/api/video/getLikes", variable).then((response) => {
      if (response.data.success) {
        //How many likes does this video or comment have
        setLikes(response.data.likes.length);

        //if I already click this like button or not
        response.data.likes.forEach((like) => {
          if (like.userId === props.userId) {
            setLikeAction("liked");
          }
        });
      } else {
        alert("Failed to get likes");
      }
    });

    Axios.post("/api/video/getDislikes", variable).then((response) => {
      if (response.data.success) {
        //How many likes does this video or comment have
        setDislikes(response.data.dislikes.length);

        //if I already click this like button or not
        response.data.dislikes.forEach((dislike) => {
          if (dislike.userId === props.userId) {
            setDislikeAction("disliked");
          }
        });
      } else {
        alert("Failed to get dislikes");
      }
    });
  }, [props.userId]);

  const onLike = () => {
    if (LikeAction === null) {
      Axios.post("/api/video/upLike", variable).then((response) => {
        if (response.data.success) {
          setLikes(Likes + 1);
          setLikeAction("liked");

          //If dislike button is already clicked

          if (DislikeAction !== null) {
            setDislikeAction(null);
            setDislikes(Dislikes - 1);
          }
        } else {
          alert("Failed to increase the like");
        }
      });
    } else {
      Axios.post("/api/video/unLike", variable).then((response) => {
        if (response.data.success) {
          setLikes(Likes - 1);
          setLikeAction(null);
        } else {
          alert("Failed to decrease the like");
        }
      });
    }
  };

  const onDisLike = () => {
    if (DislikeAction !== null) {
      Axios.post("/api/video/unDisLike", variable).then((response) => {
        if (response.data.success) {
          setDislikes(Dislikes - 1);
          setDislikeAction(null);
        } else {
          alert("Failed to decrease dislike");
        }
      });
    } else {
      Axios.post("/api/video/upDisLike", variable).then((response) => {
        if (response.data.success) {
          setDislikes(Dislikes + 1);
          setDislikeAction("disliked");

          //If dislike button is already clicked
          if (LikeAction !== null) {
            setLikeAction(null);
            setLikes(Likes - 1);
          }
        } else {
          alert("Failed to increase dislike");
        }
      });
    }
  };

  return (
    <React.Fragment>
      <span key='comment-basic-like'>
  
      <Tooltip title='like'>
          <LikeOutlined
            type='like'
            theme={LikeAction === "liked" ? "filled" : "outlined"}
            onClick={onLike}
          />
       </Tooltip>
        
        <span style={{ paddingLeft: "8px", cursor: "auto" }}>{Likes}</span>
      </span>
      
      &nbsp;&nbsp;
      
      <span key='comment-basic-dislike'>
        <Tooltip title='Dislike'>
          <DislikeOutlined
            type='dislike'
            theme={DislikeAction === "disliked" ? "filled" : "outlined"}
            onClick={onDisLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}>{Dislikes}</span>
      </span>
    </React.Fragment>
  );
}

LikeDislikes.prototypes = {
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect (mapStateToProps)(LikeDislikes);
