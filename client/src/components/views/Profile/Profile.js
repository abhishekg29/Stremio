import React, { useState, useEffect } from "react";
import {
  Card,
  Avatar,
  Col,
  Typography,
  Row,
  Button,
  Form,
  message,
  Input,
  Icon,
} from "antd";
import Dropzone from "react-dropzone";

import axios from "axios";
import moment from "moment";
const { Meta } = Card;
const { Title } = Typography;

function Profile(props) {
  const [Thumbnail, setThumbnail] = useState("");

  const onDrop = (files) => {
    console.log(files);
    let data = new FormData();
    data.append("file", files[0], files[0].fileName);
    console.log(data);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post("/api/users/upload", data, config)
      .then((response) => {
        if (response.data.success) {
          console.log(response.data.url);
          setThumbnail(response.data.url);
        }
      })
      .catch((error) => {
        //handle error
      });

    // axios.post("/api/users/upload", formData, config).then((response) => {
    //   if (response.data.success) {
    //     console.log("successfull");
    //   }
    // });
  };
  const deletevideo = (event) => {
    const videoid = {
      video: event.currentTarget.id,
    };

    axios.post("/api/video/deletevideo", videoid).then((response) => {
      if (response.data.success) {
        alert("delete hogya");
        window.location.reload();
      } else {
        alert("failed to delete video");
        window.location.reload();
      }
    });
  };

  const userId = props.match.params.userid;

  let user = {
    id: window.localStorage.getItem("userId"),
  };

  if (user.id !== userId) {
    alert("You cannot access this profile");
    window.location = "/";
  }
  if (Thumbnail !== "") {
    const profileUrl = {
      id: user.id,
      url: Thumbnail,
    };
    axios.post("/api/users/profileChange", profileUrl).then((response) => {
      if (response.data.success) {
        console.log("updated profile");
      }
    });
  }
  const [Userdata, setdata] = useState([]);
  const [Videos, setVideos] = useState([]);
  const [SubscribeNumber, setSubscribeNumber] = useState(0);

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

    axios.post("/api/users/getdata", user).then((response) => {
      if (response.data.success) {
        setdata(response.data.about);
        // console.log(Userdata);
      } else {
        alert("failed to get user data");
      }
    });

    axios.post("/api/video/getuservideos", user).then((response) => {
      if (response.data.success) {
        setVideos(response.data.videos);
        // console.log(response.data.videos);
      } else {
        alert("failed to fetch videos");
      }
    });
  }, []);

  const renderdata = Userdata.map((user, index) => {
    return (
      <div
        style={{
          backgroundImage: "linear-gradient(45deg,#f046ff,#9b00e8)",
          marginBottom: "4%",
        }}
      >
        <Row gutter={16} style={{ padding: "2% 2% 1%" }}>
          <Col lg={4} xs={12}>
            <div style={{ textAlign: "center" }}>
              {Thumbnail === "" ? (
                <img
                  style={{
                    borderRadius: "50%",
                    height: "60%",
                    width: "60%",
                    maxHeight: "60%",
                    maxWidth: "60%",
                    marginRight: "4%",
                  }}
                  src={user.image}
                />
              ) : (
                <img
                  style={{
                    borderRadius: "50%",
                    height: "60%",
                    width: "60%",
                    marginRight: "4%",
                  }}
                  src={Thumbnail}
                />
              )}
            </div>
          </Col>
          <Col lg={6} xs={12} style={{ paddingTop: "2%", textAlign: "center" }}>
            <Title letterSpacing="1" level={2}>
              {user.name}
            </Title>{" "}
          </Col>
          <Col lg={6} xs={12} style={{ paddingTop: "2%", textAlign: "center" }}>
            <p style={{ fontSize: "25px", color: "black" }}>Videos</p>
            <p style={{ fontSize: "25px", color: "black" }}>{Videos.length}</p>
          </Col>
          <Col lg={6} xs={12} style={{ paddingTop: "2%", textAlign: "center" }}>
            <p style={{ fontSize: "25px", color: "black" }}>Subcribers</p>
            <p style={{ fontSize: "25px", color: "black" }}>
              {SubscribeNumber}
            </p>
          </Col>{" "}
          {/* <Col lg={6} xs={12} style={{ paddingTop: "2%", textAlign: "center" }}>
            <Dropzone onDrop={onDrop} multiple={false} maxSize={80000000000}>
              {({
                getRootProps,
                getInputProps,
                isDragActive,
                isDragReject,
              }) => (
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  {!isDragActive && "Click here or drop a file to upload!"}
                  {isDragActive && !isDragReject && "Drop it like it's hot!"}
                  {isDragReject && "File type not accepted, sorry!"}
                </div>
              )}
            </Dropzone>
          </Col>{" "} */}
        </Row>
      </div>
    );
  });

  const renderCards = Videos.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col lg={6} md={8} xs={24}>
        <div
          style={{
            backgroundColor: "rgb(176,224,230,0.3)",

            margin: "4% 2% 5% 0px",
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
    <div
      style={{
        width: "85%",
        margin: "1rem auto 3rem",
      }}
    >
      {renderdata}
      <hr />
      <Title letterSpacing="2" level={2}>
        Videos
      </Title>
      <Row gutter={16}>{renderCards}</Row>
    </div>
  );
}

export default Profile;
