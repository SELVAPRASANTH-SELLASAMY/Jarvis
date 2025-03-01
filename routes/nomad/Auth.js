const express = require('express');
const router = express.Router();
const { handleSignUp, handleSignIn, handleSignOut, checkAuth } = require('../../controllers/nomad/Auth');
const { isEmailExists, isAuthenticated } = require('../../middlewares/Auth');
router.post('/signup',isEmailExists,handleSignUp);
router.post('/signin',handleSignIn);
router.post('/signout',handleSignOut);
router.get('/check-auth',isAuthenticated,checkAuth);
module.exports = router;