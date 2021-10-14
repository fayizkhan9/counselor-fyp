import React, { useEffect, useState } from "react";
import { Card, Avatar, Col, Typography, Row } from "antd";
import axios from "axios";
import moment from "moment";
import VideosNavBar from './VideoNavBar'




const { Title } = Typography;
const { Meta } = Card;
let variable = {};

function SubscribedVideos() {
  const [Videos, setVideos] = useState([]);


  useEffect(() => {
    variable = { userFrom: localStorage.getItem("userId") };
    axios.post("/api/video/getSubscriptionVideos", variable)
      .then((response) => {
        if (response.data.success) {
          setVideos(response.data.videos);
        } else {
          alert("Failed to get subscription videos");
        }
      });
  }, []);

  const renderCards = Videos.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col lg={6} md={8} xs={24}>
        <div style={{ position: "relative" }}>
          <a href={`/video/${video._id}`}>
            <img
              style={{ width: "100%", borderRadius:'10px' }}
              alt="thumbnail"
              src={`http://localhost:5000/${video.thumbnail}`}
            />
            <div
              className=" duration"
              style={{
                bottom: 0,
                right: 0,
                position: "absolute",
                margin: "4px",
                color: "#fff",
                backgroundColor: "rgba(17, 17, 17, 0.8)",
                opacity: 0.8,
                padding: "2px 4px",
                borderRadius: "2px",
                letterSpacing: "0.5px",
                fontSize: "12px",
                fontWeight: "500",
                lineHeight: "12px",
              }}
            >
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </a>
        </div>
        <br />
        <Meta
          avatar={<Avatar src={video.user.profileImg} />}
          title={video.title}
        />
        <span>{video.user.name} </span>
        <br />
        <span style={{ marginLeft: "3rem" }}> {video.views}</span>-{" "}
        <span> {moment(video.createdAt).format("MMM DD YY")} </span>
      </Col>
    );
  });

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      
      <VideosNavBar/>
      <Title level={2} style={{top:"12%"}}> Subscribed Videos </Title>
      <Row gutter={16}>{renderCards}</Row>

    </div>
  );
}

export default SubscribedVideos;