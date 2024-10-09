const express = require("express");
const router = express.Router();
const {addBlogs} = require('../../controllers/portfolio/Blog');
const {saveImage} = require('../../middlewares/Blog');
router.post("/add",saveImage,addBlogs);
module.exports = router;