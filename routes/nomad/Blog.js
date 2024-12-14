const express = require('express');
const router = express.Router();
const { handleNewBlog, getBlogs } = require("../../controllers/nomad/Blog");
router.post('/addblog',handleNewBlog);
router.get('/fetchblogs',getBlogs);
module.exports = router;