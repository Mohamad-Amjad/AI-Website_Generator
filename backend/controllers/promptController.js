const promptModel=require('../models/promptModel');

exports.getPrompts=async(req,res,next)=>{
    const prompts=await promptModel.find({});
    res.json({
        success:true,
        prompts
    })
}

exports.getResponse=(req,res,next)=>{
    res.json({
        success:true,
        message:"Get responses working"
    })
}

exports.getSinglePrompt=async(req,res,next)=>{
    try {
        const prompt=await promptModel.findById(req.params.id);
       res.json({
           success:true,
           prompt
       }) 
    } catch (error) {
        res.json({
            success:false,
            message:"item not found"
        })
    }
}

exports.deletePrompt=async(req,res,next)=>{
    try {
        const delPrompt=await promptModel.findByIdAndDelete(req.params.id);
        res.json({
            success:true,
            message:"Item deleted successfully"
        })
    } catch (error) {
                res.json({
            success:false,
            message:"item deleted failed"
        })
    }
}