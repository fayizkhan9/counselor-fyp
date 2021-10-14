import React, { useEffect, useState } from "react";
import { Card, Avatar, Col, Typography, Row } from "antd";
import api from "../../utils/api";
import moment from "moment";
import VideosNavBar from "./VideoNavBar";

const { Title } = Typography;
const { Meta } = Card;



function AllVideos() {

  const [Videos, setVideos] = useState([]);

  useEffect(() => {
    
    api.get("/video/getVideos").then((response) => {
      if (response.data.success) {
        setVideos(response.data.videos);
      } else {
        alert("Failed to get Videos");
      }
    });
  }, []);

  const renderCards = Videos.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col key={video._id} lg={6} md={8} xs={24}>
        <div style={{ position: "relative", marginTop: "50px"}}>
          <a href={`/video/${video._id}`}>
            <img
              style={{ width: "100%",  borderRadius: "10px" }}
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
          avatar={<Avatar src={video.user.profileImg} alt="Not Found"/>}
          title={video.title}
        />
        <span>{video.user.name} </span>
        <br />
        <span style={{ marginLeft: "3rem" }}> {video.views}</span>-{" "}
        <span> {moment(video.createdAt).format("MMM Do YY")} </span>
      </Col>
    );
  });

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
        <VideosNavBar/>
      <Title level={2}>  </Title>
      
      <Row gutter={16}>{renderCards}</Row>
    </div>
  );
}

export default AllVideos;
