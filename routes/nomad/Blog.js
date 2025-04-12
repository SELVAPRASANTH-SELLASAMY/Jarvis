const express = require('express');
const router = express.Router();
const { handleNewBlog, fetchAll, getContent, deleteBlog, updateBlog } = require("../../controllers/nomad/Blog");
router.post('/add',handleNewBlog);
router.get('/fetch',fetchAll);
router.get('/getcontent',getContent);
router.delete('/delete',deleteBlog);
router.patch('/update',updateBlog);
module.exports = router;