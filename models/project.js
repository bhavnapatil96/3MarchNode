const mongoose=require('mongoose');

var ProjectSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    startDate:{
        type:Date

    },
    endDate:{
        type:Date,
    },
    pic:{
        type:String,
    },
    client:{
        type:String
    },
    flag:{
        type:Boolean,
        default:true
    }

});
let project=mongoose.model('project',ProjectSchema);
module.exports={project}