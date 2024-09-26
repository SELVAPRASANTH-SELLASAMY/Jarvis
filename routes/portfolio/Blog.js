const express = require("express");
const router = express.Router();
const {upload,handleImageUpload} = require('../../controllers/portfolio/Blog');
router.post("/uploadimage",upload.single("image"),handleImageUpload);
module.exports = router;