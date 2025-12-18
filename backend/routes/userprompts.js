const express=require('express');
const { createUserPrompts, createUserResponses } = require('../controllers/userPromptController');
const router=express.Router();

router.route('/prompts').post(createUserPrompts);
router.route('/response').post(createUserResponses);
module.exports=router;