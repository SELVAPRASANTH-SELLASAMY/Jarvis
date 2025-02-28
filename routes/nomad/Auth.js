const express = require('express');
const router = express.Router();
const { handleSignUp, handleSignIn } = require('../../controllers/nomad/Auth');
const { isEmailExists } = require('../../middlewares/Auth');
router.post('/signup',isEmailExists,handleSignUp);
router.post('/signin',handleSignIn);
module.exports = router;