import React from "react";
import { Icon } from "antd";
import "./Footer.css";

function Footer() {
  return (
    <div
      className="footer1"
      style={{
        bottom: "0",
        height: "80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1rem",
      }}
    >
      <p>
        {" "}
        @ A.A.A.
        <Icon type="smile" />
      </p>
    </div>
  );
}

export default Footer;
