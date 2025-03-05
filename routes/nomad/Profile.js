const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../../middlewares/Auth');
const { handleProfileUpdate, upload } = require('../../controllers/nomad/Profile');
router.patch('/update',isAuthenticated,upload.single('image'),handleProfileUpdate);
module.exports = router;