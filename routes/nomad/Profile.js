const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../../middlewares/Auth');
const { handleProfileUpdate, handlePasswordUpdate, upload } = require('../../controllers/nomad/Profile');
router.patch('/update',isAuthenticated,upload.single('image'),handleProfileUpdate);
router.patch('/updatePassword',isAuthenticated,handlePasswordUpdate);
module.exports = router;