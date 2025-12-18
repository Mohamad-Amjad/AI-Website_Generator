const express=require('express');
const { getPrompts, getSinglePrompt, deletePrompt } = require('../controllers/promptController');
const router=express.Router();

router.route('/workspace').get(getPrompts);
router.route('/workspace/:id').get(getSinglePrompt);
router.route('/workspace/:id').delete(deletePrompt);

module.exports=router;