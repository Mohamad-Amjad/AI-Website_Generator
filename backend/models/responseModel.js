const mongoose=require('mongoose');

const responseSchema=new mongoose.Schema({
    role:String,
    AiResponse:String
});

const responseModel=mongoose.model('Response',responseSchema);

module.exports=responseModel;