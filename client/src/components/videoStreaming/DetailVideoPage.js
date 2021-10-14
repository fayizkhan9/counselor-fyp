import React, { useEffect, useState } from "react";
import { List, Avatar, Row, Col } from "antd";
import SideVideo from "./Sections/SideVideo";
import Subscriber from "./Sections/Subscriber";
import Comments from "./Sections/Comments";
import LikeDislikes from "./Sections/LikeDislikes";
import axios from "axios";
import VideosNavBar from './VideoNavBar'



function DetailVideoPage(props) {


  const videoId = props.match.params.videoId;
  const [Video, setVideo] = useState([]);
  const [CommentLists, setCommentLists] = useState([]);

  useEffect(() => {
    axios.post("/api/video/getVideo", {videoId}).then((response) => {
      if (response.data.success) {

        setVideo(response.data.video);
      } else {
        alert("Failed to get video Info");
      }
    });

    axios.post("/api/video/getComments", {videoId}).then((response) => {
      if (response.data.success) {
        setCommentLists(response.data.comments);
      } else {
        alert("Failed to get video Info");
      }
    });
  }, [videoId]);

  const updateComment = (newComment) => {
    setCommentLists(CommentLists.concat(newComment));
  };

  if (Video.user) {
    return (
      <Row>
        <Col lg={18} xs={24}>
          <VideosNavBar/>
          <div
            className="postPage"
            style={{ width: "100%", padding: "3rem 4em" }}
          >
            <video
              style={{ width: "100%" }}
              src={`http://localhost:5000/${Video.filePath}`}
              controls
            ></video>

            <List.Item
              key="1"
              actions={[
                <LikeDislikes
                  video
                  videoId={videoId}
                  userId={localStorage.getItem("userId")}
                />,
                <Subscriber
                  userTo={Video.user._id}
                  userFrom={localStorage.getItem("userId")}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={Video.user && Video.user.profileImg} />}
                title={<a href="https://ant.design">{Video.title}</a>}
                description={Video.description}
              />
              <div></div>
            </List.Item>
              
            <Comments
              CommentLists={CommentLists}
              postId={Video._id}
              refreshFunction={updateComment}
            />
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default DetailVideoPage;
