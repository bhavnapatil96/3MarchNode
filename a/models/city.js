const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
var CitySchema=new mongoose.Schema({
    cityname:{
        type:String,
        required:true,
    },
    stateId:{
        type:String
    }
});

let city=mongoose.model('city',CitySchema);
module.exports={city};