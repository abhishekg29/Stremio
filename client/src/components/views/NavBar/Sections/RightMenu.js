/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Menu } from "antd";
import axios from "axios";
import { USER_SERVER } from "../../../Config";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
const Upload = require("../../../../assets/images/upload.png");
const UserIcon = require("../../../../assets/images/usericon.png");
const Logout = require("../../../../assets/images/logout.png");

function RightMenu(props) {
  const user = useSelector((state) => state.user);

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert("Log Out Failed");
      }
    });
  };

  const id = window.localStorage.getItem("userId");

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a className="home-img" style={{ fontWeight: "bold" }} href="/login">
            Login
          </a>
        </Menu.Item>
        <Menu.Item key="app" maxWidth="10%">
          <a
            className="home-img"
            style={{ fontWeight: "bold" }}
            href="/register"
          >
            Register
          </a>
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="user">
          <a
            className="home-img"
            style={{ fontWeight: "bold" }}
            href={`/user/${id}`}
          >
            <img style={{ marginRight: "4%" }} src={UserIcon} alt="User" />
            Profile
          </a>
        </Menu.Item>

        <Menu.Item key="create">
          <a
            className="home-img"
            style={{ fontWeight: "bold" }}
            href="/video/upload"
          >
            <img style={{ marginRight: "4%" }} src={Upload} alt="Upload" />
            Upload
          </a>
        </Menu.Item>
        <Menu.Item key="logout">
          <a
            className="home-img"
            style={{ fontWeight: "bold" }}
            onClick={logoutHandler}
          >
            <img style={{ marginRight: "4%" }} src={Logout} alt="Logout" />
            Logout
          </a>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(RightMenu);
