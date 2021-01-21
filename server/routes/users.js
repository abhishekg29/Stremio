const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const { Otp } = require("../models/OTP");
const { auth } = require("../middleware/auth");
const { sendEmail } = require("../Nodemailer/mail");
const fileupload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
//=================================
//             User
//=================================
const app = express();
app.use(
  fileupload({
    useTempFiles: true,
  })
);

cloudinary.config({
  cloud_name: "stremio",
  api_key: "437557166785672",
  api_secret: "h_RhxycU7qEINk4XOx4LsBqhgVM",
});

router.post("/upload", function (req, res, next) {
  console.log("here");
  console.log(req.files);
  console.log("there");

  const file = req.files.file;
  cloudinary.uploader.upload(file.tempFilePath, function (err, result) {
    if (result) {
      console.log(result.url);
      return res.status(200).json({
        url: result.url,
        success: true,
      });
    }
  });
});

router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

router.post("/register", (req, res) => {
  const user = new User(req.body);
  // console.log(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    else {
      sendEmail(req.body.email, req.body.name, "welcome");
      return res.status(200).json({
        success: true,
      });
    }
  });
});

router.post("/profileChange", (req, res) => {
  User.findOne({ _id: req.body.id }, (err, user) => {
    if (user) {
      user.image = req.body.url;
      user.save();
      res.status(200).json({ success: true });
    }
  });
});

router.post("/getUser", (req, res) => {
  User.findOne({ _id: req.body.userId }).exec((err, user) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, user });
  });
});

router.post("/googlesignup", (req, res) => {
  console.log(req.body);
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      // console.log('already')
      return res.json({ success: false });
    } else {
      const newuser = new User(req.body);

      newuser.save((err, doc) => {
        if (err) return res.json({ success: false });
        else {
          sendEmail(req.body.email, req.body.name, "welcome");
          return res.status(200).json({
            success: true,
          });
        }
      });
    }
  });
});

router.post("/googlesignin", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      console.log(user);
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token).status(200).json({
          success: true,
          userId: user._id,
        });
      });
    } else {
      console.log(err);
      return res.json({ success: false });
    }
  });
});

router.post("/login", (req, res) => {
  // console.log('fdscf')
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "Wrong password" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "", tokenExp: "" },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

router.post("/forgot", (req, res) => {
  console.log(req.body.email);

  User.findOne({ email: req.body.email.trim() }, (err, user) => {
    if (err) return res.status(400).send(err);
    if (!user) return res.status(200).json({ success: false });
    else {
      console.log("found!");
      return res.status(200).json({ success: true });
    } //  if(err) console.log("error");
    //  if(user) console.log("user found");
    // else console.log("user not found");
  });
});

router.post("/storeotp", (req, res) => {
  // console.log(req.body);
  Otp.findOneAndDelete({ email: req.body.email.trim() }, function (err, docs) {
    if (err) {
      console.log(err);
    }
  });
  const otp = new Otp(req.body);

  otp.save((err, otp) => {
    if (err) {
      console.log("bhai kux error aai");
      console.log(err);
      return res.status(400).send(err);
    } else {
      sendEmail(req.body.email, req.body.otp, "otpchange");

      return res.status(200).json({
        success: true,
      });
    }
  });
});

router.post("/otp", (req, res) => {
  Otp.findOne({ email: req.body.email.trim() }).exec((err, result) => {
    // console.log(req.body.email.trim())

    if (err) {
      //      console.log(err);
      return res.status(400).send(err);
    } else {
      if (result.otp == req.body.otp)
        return res.status(200).json({ success: true });
      else {
        return res.status(200).json({ success: false });
      }
    }
  });
});

router.post("/changed", (req, res) => {
  User.findOneAndUpdate(
    { email: req.body.email.trim() },
    { password: req.body.password },
    null,
    function (err, result) {
      if (err) {
        return res.status(400).send(err);
      } else {
        result.password = req.body.password;
        result.save();
        return res.status(200).json({ success: true });
      }
    }
  );
});
router.post("/getdata", (req, res) => {
  // get data of user for profile page

  User.find({ _id: req.body.id }).exec((err, about) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      // console.log(about);
      return res.status(200).json({
        success: true,
        about,
      });
    }
  });
});

module.exports = router;
