const express = require('express');
const router = express.Router();

const {register, login, forgotpassword, resetpassword, captcha} = require("../controllers/auth");
const { getLog ,addLog} = require('../controllers/log')
const { getReport, addReport} = require('../controllers/report')

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/forgotpassword").post(forgotpassword);

router.route("/resetpassword/:resetToken").put(resetpassword);

router.route("/captcha").post(captcha);

// //========================= Log Accountant =========================

router.route("/getlog").get(getLog);

router.route("/addlog").post(addLog);

// //========================= Report =========================

router.route("/getreport").get(getReport);

router.route("/addreport").post(addReport);

module.exports = router;
