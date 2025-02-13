const express = require('express');
const router = express.Router();
const { handleSignUp } = require('../../controllers/nomad/Auth');
router.post('/signup',handleSignUp);
module.exports = router;