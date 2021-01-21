import React, { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";
import { Card, Avatar, Col, Typography, Row } from "antd";
import axios from "axios";
import moment from "moment";
const { Title } = Typography;
const { Meta } = Card;
const Loader = require("../../../assets/images/loader.gif");

function UserProfile(props) {
  const userId = props.match.params.userId;
  console.log(userId);
  const [User, setUser] = useState([]);
  const [Videos, setVideos] = useState([]);
  const [Load, setLoad] = useState([true]);
  const [SubscribeNumber, setSubscribeNumber] = useState(0);

  const userVariable = {
    userId: userId,
  };
  let subscribeVariables = {
    userTo: userId,
  };

  useEffect(() => {
    axios
      .post("/api/subscribe/subscribeNumber", subscribeVariables)
      .then((response) => {
        if (response.data.success) {
          setSubscribeNumber(response.data.subscribeNumber);
        } else {
          alert("Failed to get subscriber Number");
        }
      });

    axios.post("/api/users/getUser", userVariable).then((response) => {
      if (response.data.success) {
        console.log(response.data.user);
        setUser(response.data.user);
      } else {
        alert("Failed to get user Info");
      }
    });
    axios.post("/api/video/getUsersVideos", userVariable).then((response) => {
      if (response.data.success) {
        setLoad(false);

        console.log(response.data.videos);
        setVideos(response.data.videos);
      } else {
        alert("Failed to get video Info");
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
              <a href={`/users/${User._id}`}>
                <Meta
                  avatar={<Avatar src={User.image} />}
                  title={video.title}
                />
              </a>
              <span>{User.name} </span>
              <br />
              <span style={{ marginLeft: "3rem" }}> {video.views}</span>-{" "}
              <span> {moment(video.createdAt).format("MMM Do YY")} </span>
            </div>
          </div>
        </Col>
      );
    });

    return (
      <div
        style={{
          width: "85%",
          margin: "1rem auto 3rem",
        }}
      >
        <div
          style={{ backgroundImage: "linear-gradient(45deg,#f046ff,#9b00e8)" }}
        >
          <Row
            gutter={16}
            style={{
              padding: "1% 2% 2%",
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            <Col lg={6} xs={24}>
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "2%",
                  marginTop: "2%",
                }}
              >
                <img
                  style={{
                    borderRadius: "50%",
                    height: "60%",
                    width: "60%",
                    marginRight: "4%",
                    marginBottom: "0px",
                  }}
                  src={User.image}
                />
              </div>
            </Col>
            <Col
              lg={6}
              xs={24}
              style={{
                textAlign: "center",
                marginBottom: "0px",
                marginTop: "auto",
              }}
            >
              <Title letterSpacing="1" level={2}>
                {User.name}
              </Title>{" "}
            </Col>
            <Col
              lg={6}
              xs={24}
              style={{
                textAlign: "center",
                marginBottom: "0px",
                marginTop: "auto",
              }}
            >
              <p
                style={{
                  fontSize: "25px",
                  color: "black",
                  marginBottom: "0px",
                }}
              >
                Video
              </p>
              <p
                style={{
                  fontSize: "25px",
                  color: "black",
                  marginBottom: "0px",
                }}
              >
                {Videos.length}
              </p>
            </Col>
            <Col
              lg={6}
              xs={24}
              style={{
                textAlign: "center",
                marginBottom: "0px",
                marginTop: "auto",
              }}
            >
              <p
                style={{
                  fontSize: "25px",
                  color: "black",
                  marginBottom: "0px",
                }}
              >
                Subcribers
              </p>
              <p
                style={{
                  fontSize: "25px",
                  color: "black",
                  marginBottom: "0px",
                }}
              >
                {SubscribeNumber}
              </p>
            </Col>{" "}
          </Row>
        </div>

        <hr />
        <Title letterSpacing="2" level={2}>
          Videos
        </Title>
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
export default UserProfile;
