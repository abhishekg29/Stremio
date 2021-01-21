import React from "react";
import moment from "moment";
import { Formik } from "formik";
import "./RegisterPage.css";

import * as Yup from "yup";
import { registerUser } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import GoogleLogin from "react-google-login";
import axios from "axios";

import { Form, Input, Button } from "antd";

const Image = require("../../../assets/images/user.png");
const google = require("../../../assets/images/google.png");

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function RegisterPage(props) {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{
        email: "",
        lastName: "",
        name: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required("Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        email: Yup.string()
          .email("Email is invalid")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Confirm Password is required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            email: values.email,
            password: values.password,
            name: values.name,
            lastname: values.lastname,
            image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`,
          };

          dispatch(registerUser(dataToSubmit)).then((response) => {
            if (response.payload.success) {
              props.history.push("/login");
            } else {
              alert(response.payload.err.errmsg);
            }
          });

          setSubmitting(false);
        }, 500);
      }}
    >
      {(props) => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
        } = props;

        const responseGoogle = (response) => {
          // console.log(response.profileObj.email);
          console.log(response.profileObj);
          const value = {
            email: response.profileObj.email,
            name: response.profileObj.name,
            image: response.profileObj.imageUrl,
          };

          axios.post("/api/users/googlesignup", value).then((response) => {
            if (response.data.success === true) {
              alert("user registered");
              window.location = "/login";
            } else {
              console.log("nahi hua");
              alert("nahi hua");
            }
          });
        };

        const responsegoogle = (response) => {
          console.log(response);
          alert("error in registering user");
        };

        return (
          <div
            className="container"
            style={{
              position: "absolute",
              maxWidth: "400px",
              margin: "50px auto auto",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="myCard">
              <div className="row">
                <div className="myCtn">
                  <form onSubmit={handleSubmit} className="myForm text-center">
                    <div className="login_img">
                      <img src={Image} alt="Image"></img>
                    </div>

                    <header>Sign up</header>
                    <div className="form-group">
                      <input
                        className="myInput"
                        id="name"
                        placeholder="Enter your name"
                        type="text"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.name && touched.name && (
                        <div className="input-feedback">{errors.name}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <input
                        id="lastName"
                        className="myInput"
                        placeholder="Enter your Last Name"
                        type="text"
                        required
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.lastName && touched.lastName && (
                        <div className="input-feedback">{errors.lastName}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <input
                        id="email"
                        placeholder="Enter your Email"
                        className="myInput"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      {errors.email && touched.email && (
                        <div className="input-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="form-group">
                      <input
                        required
                        id="password"
                        placeholder="Enter your password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="myInput"
                      />
                      {errors.password && touched.password && (
                        <div className="input-feedback">{errors.password}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <input
                        required
                        id="confirmPassword"
                        placeholder="Enter your confirmPassword"
                        type="password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="myInput"
                      />
                      {errors.confirmPassword && touched.confirmPassword && (
                        <div className="input-feedback">
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>
                    <button
                      className="butt"
                      disabled={isSubmitting}
                      onSubmit={handleSubmit}
                      style={{ letterSpacing: "1px" }}
                    >
                      Register
                    </button>
                    <br></br>

                    <p className="signup_butt">
                      Already a Stremian? <a href="/login"> Login Here.</a>{" "}
                    </p>
                    <div style={{ marginBottom: "2%" }}>
                      <GoogleLogin
                        clientId="669039036648-ecgp6nmt8419roger008nobtp5n7q14j.apps.googleusercontent.com"
                        onSuccess={responseGoogle}
                        onFailure={responsegoogle}
                        cookiePolicy={"single_host_origin"}
                      ></GoogleLogin>
                    </div>
                    <br></br>
                    <br></br>
                  </form>
                </div>
              </div>
            </div>
            <br></br>
            <br></br>
          </div>
        );
      }}
    </Formik>
  );
}

export default RegisterPage;
