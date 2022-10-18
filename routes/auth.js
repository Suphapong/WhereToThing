const express = require('express');
const router = express.Router();

const {register, login, forgotpassword, resetpassword, captcha} = require("../controllers/auth");
const { getLog ,addLog} = require('../controllers/log')
const { getReport, addReport, updateReportStatus, deleteReport} = require('../controllers/report')
const { getBin, addBin, deleteBin} = require('../controllers/bin')

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

router.route("/updatereportstatus").put(updateReportStatus);

router.route("/deletereport").post(deleteReport);


// //========================= Bin =========================

router.route("/getbin").get(getBin);

router.route("/addbin").post(addBin);

router.route("/deletebin").post(deleteBin);


module.exports = router;
