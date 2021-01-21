import React from "react";
import { Menu } from "antd";
const Home = require("../../../../assets/images/home.png");
const Fire = require("../../../../assets/images/fire.png");
const Subscription = require("../../../../assets/images/subscription.png");

function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
      <Menu.Item key="mail">
        <a className="home-img" style={{ fontWeight: "bold" }} href="/">
          <img style={{ marginRight: "11px" }} src={Home} />
          Home
        </a>
      </Menu.Item>
      <Menu.Item key="trending">
        <a className="home-img" style={{ fontWeight: "bold" }} href="/trending">
          <img style={{ marginRight: "9px" }} src={Fire} />
          Trending
        </a>
      </Menu.Item>
      <Menu.Item key="subscription">
        <a
          className="home-img"
          style={{ fontWeight: "bold" }}
          href="/subscription"
        >
          <img style={{ marginRight: "9px" }} src={Subscription} />
          Subscription
        </a>
      </Menu.Item>
    </Menu>
  );
}

export default LeftMenu;
