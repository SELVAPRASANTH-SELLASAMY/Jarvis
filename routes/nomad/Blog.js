const express = require('express');
const router = express.Router();
const { handleNewBlog, fetchAll, getContent } = require("../../controllers/nomad/Blog");
router.post('/addblog',handleNewBlog);
router.get('/fetchblogs',fetchAll);
router.get('/getcontent',getContent);
module.exports = router;