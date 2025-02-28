const express = require('express');
const router = express.Router();
const { handleSignUp } = require('../../controllers/nomad/Auth');
const { isEmailExists } = require('../../middlewares/Auth');
router.post('/signup',isEmailExists,handleSignUp);
module.exports = router;