import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import "./LoginPage.css";
import "./../../Mid.css";
import { loginUser } from "../../../_actions/user_actions";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import GoogleLogin from "react-google-login";
import axios from "axios";

const Image = require("../../../assets/images/user.png");
const google = require("../../../assets/images/google.png");

function LoginPage(props) {
  const dispatch = useDispatch();
  const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;

  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(rememberMeChecked);

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const initialEmail = localStorage.getItem("rememberMe")
    ? localStorage.getItem("rememberMe")
    : "";

  const responseGoogle = (response) => {
    // console.log(response.profileObj.email);
    // console.log(response.profileObj)
    const value = {
      email: response.profileObj.email,
    };

    axios.post("/api/users/googlesignin", value).then((response) => {
      if (response.data.success === true) {
        window.localStorage.setItem("userId", response.data.userId);
        //console.log(response);
        window.location = "/";
        // window.location.reload();
      } else {
        // console.log("nahi hua");
        alert("Login Failed!!!");
        // window.location.reload();
      }
    });
  };

  const responsegoogle = (response) => {
    // console.log(response);
    alert("Login Failed!!!");
  };

  return (
    <Formik
      initialValues={{
        email: initialEmail,
        password: "",
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Email is invalid")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            email: values.email,
            password: values.password,
          };

          dispatch(loginUser(dataToSubmit))
            .then((response) => {
              if (response.payload.loginSuccess) {
                window.localStorage.setItem("userId", response.payload.userId);
                window.localStorage.setItem(
                  "username",
                  response.payload.username
                );

                if (rememberMe === true) {
                  window.localStorage.setItem("rememberMe", values.id);
                } else {
                  localStorage.removeItem("rememberMe");
                }
                props.history.push("/");
              } else {
                setFormErrorMessage("Check out your Account or Password again");
              }
            })
            .catch((err) => {
              setFormErrorMessage("Check out your Account or Password again");
              setTimeout(() => {
                setFormErrorMessage("");
              }, 3000);
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
        return (
          <div
            className="container login-container"
            style={{
              position: "absolute",
              maxWidth: "400px",
              margin: "50px auto auto",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="myCardd">
              <div className="row">
                <div className="myCtnn">
                  <form onSubmit={handleSubmit} className="myForm text-center">
                    <div className="login_img">
                      <img src={Image} alt="Image"></img>
                    </div>

                    <header> Login to Stremio ! </header>
                    <div className="form-group">
                      <i className="fas fa-envelope"></i>
                      <input
                        className="myInput"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Email"
                        id="email"
                        required
                      />
                    </div>
                    {errors.email && touched.email && (
                      <div className="input-feedback">{errors.email}</div>
                    )}

                    <div className="form-group">
                      <i className="fas fa-lock"></i>
                      <input
                        className="myInput"
                        id="password"
                        placeholder="Password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                    </div>
                    {errors.password && touched.password && (
                      <div className="input-feedback">{errors.password}</div>
                    )}

                    <div>
                      <a href="/reset_user" className="forgot_pass">
                        Forgot Password?
                      </a>
                    </div>

                    <button
                      className="butt"
                      disabled={isSubmitting}
                      onSubmit={handleSubmit}
                      style={{ letterSpacing: "1px" }}
                    >
                      Login
                    </button>

                    <br></br>

                    <p className="signup_butt">
                      New to Stremio? <a href="/register"> Sign Up Here.</a>{" "}
                    </p>
                    <div style={{ marginBottom: "2%" }}>
                      <GoogleLogin
                        clientId="669039036648-ecgp6nmt8419roger008nobtp5n7q14j.apps.googleusercontent.com"
                        onSuccess={responseGoogle}
                        onFailure={responsegoogle}
                        cookiePolicy={"single_host_origin"}
                      ></GoogleLogin>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}

export default withRouter(LoginPage);
