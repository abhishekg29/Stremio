import React, { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";
import { Card, Avatar, Col, Typography, Row } from "antd";
import axios from "axios";
import moment from "moment";
const { Title } = Typography;
const { Meta } = Card;
const Loader = require("../../../assets/images/loader.gif");

function TrendingPage() {
  const [Videos, setVideos] = useState([]);
  const [Load, setLoad] = useState([true]);
  useEffect(() => {
    axios.get("/api/video/getTrendingVideos").then((response) => {
      if (response.data.success) {
        setLoad(false);
        setVideos(response.data.videos);
      } else {
        alert("Failed to get trending videos");
      }
    });
  }, []);
  if (!Load) {
    const renderCards = Videos.map((video, index) => {
      var minutes = Math.floor(video.duration / 60);
      var seconds = Math.floor(video.duration - minutes * 60);

      return (
        <Col lg={6} md={8} xs={24}>
          <div
            style={{
              backgroundColor: "rgb(176,224,230,0.3)",
              marginBottom: "5%",
              marginTop: "4%",
            }}
          >
            <div style={{ position: "relative" }}>
              <a href={`/video/${video._id}`}>
                <img
                  style={{ width: "100%" }}
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
            <div style={{ paddingBottom: "2%", paddingLeft: "2%" }}>
              <a
                href={`/users/${video.writer._id}`}
                style={{ textDecoration: "none", color: "#000000A6" }}
              >
                <Meta
                  avatar={<Avatar src={video.writer.image} />}
                  title={video.title}
                />
                <span>{video.writer.name} </span>
              </a>
              <br />
              <span style={{ marginLeft: "3rem" }}> {video.views}</span>-{" "}
              <span> {moment(video.createdAt).format("MMM Do YY")} </span>
            </div>
          </div>
        </Col>
      );
    });

    return (
      <div style={{ width: "85%", margin: "1rem auto 3rem" }}>
        <Title level={2}> Trending Videos </Title>
        <hr />

        <Row gutter={16}>{renderCards}</Row>
      </div>
    );
  } else {
    return (
      <div
        style={{
          textAlign: "center",
          left: "50%",
          height: "480px",
          paddingTop: "12%",
          fontSize: "2rem",
        }}
      >
        <img src={Loader} />
      </div>
    );
  }
}

export default TrendingPage;
