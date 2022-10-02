const express = require('express');
const router = express.Router();
const { getPrivateData } = require('../controllers/private');
const { protect } = require('../middleware/auth')

const { getLog ,addLog} = require('../controllers/log')

router.route("/").get(protect, getPrivateData);

//========================= Log Accountant =========================

router.route("/getlog").get(protect, getLog);
// router.route("/addlog").post(protect, addLog);

module.exports = router;