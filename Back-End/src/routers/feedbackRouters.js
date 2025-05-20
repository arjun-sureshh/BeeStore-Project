const express = require("express");
const {
  createFeedBack,
  handleMulterError,
} = require("../controllers/feedbackControllers");
const upload = require("../config/multerConfig");

const router = express.Router();

router.post("/", upload.array("media", 5), handleMulterError, createFeedBack);

module.exports = router;
