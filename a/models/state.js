const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
var StateSchema=new mongoose.Schema({
    statename:{
        type:String,
        required:true,
    },
});

let state=mongoose.model('state',StateSchema);
module.exports={state};