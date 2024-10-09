const express = require("express");
const router = express.Router();
const {addBlogs} = require('../../controllers/portfolio/Blog');
const {saveImages} = require('../../middlewares/Blog');
router.post("/add",saveImages,addBlogs);
module.exports = router;