const express = require('express');
const router = express.Router();
const { handleNewBlog, fetchAll, getContent, deleteBlog } = require("../../controllers/nomad/Blog");
router.post('/addblog',handleNewBlog);
router.get('/fetchblogs',fetchAll);
router.get('/getcontent',getContent);
router.delete('/deleteBlog',deleteBlog);
module.exports = router;