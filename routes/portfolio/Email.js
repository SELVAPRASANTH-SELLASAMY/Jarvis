const express = require('express');
const router = express.Router();
const {sendMessage} = require('../../controllers/portfolio/Email');
const {validateFormData,validateEmail} = require('../../middlewares/Validation');
router.post("/sendEmail",validateFormData,validateEmail,sendMessage);
router.get("/sendEmail",(req,res)=>{res.send("Hi")});
module.exports = router;