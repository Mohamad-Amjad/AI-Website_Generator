const promptModel=require('../models/promptModel');
const responseModel=require('../models/responseModel');
exports.createUserPrompts=(req,res,next)=>{
    promptModel.create(req.body);
    res.json({
        success:true,
        message:"Create prompt successfully"
    })
}

exports.createUserResponses=(req,res,next)=>{
    responseModel.create(req.body);
    res.json({
        success:true,
        message:"Create response successfully"
    })
}