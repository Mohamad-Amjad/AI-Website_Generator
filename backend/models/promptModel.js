const mongoose=require('mongoose');

const promptSchema=new mongoose.Schema({
    role:String,
    inputPrompt:String
});

const promptModel=mongoose.model('Prompt',promptSchema);

module.exports=promptModel;