const express = require('express');
const router = express.Router();

const {register, login, forgotpassword, resetpassword, captcha} = require("../controllers/auth");
const { getLog ,addLog} = require('../controllers/log')

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/forgotpassword").post(forgotpassword);

router.route("/resetpassword/:resetToken").put(resetpassword);

router.route("/captcha").post(captcha);

// //========================= Log Accountant =========================

 router.route("/getlog").get(getLog);
 router.route("/addlog").post(addLog);



module.exports = router;
