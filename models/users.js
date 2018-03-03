const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
var UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    contact:{
        type:Number,
        required:true,
    },
    state:{
        type:String,

    },
    city:{
        type:String
    },
    password:{
      type:String
    },
    token:[{
        access:{
            type:String,
        },
        token:{
            type:String
        }
    }]
});
UserSchema.pre('save',function (next) {
    let  user=this;
    if(user.isModified('password'))
    {
        bcrypt.genSalt(10,(err,salt)=>{
            if(err){
                console.log(err);
            }
            else{
                bcrypt.hash(user.password,salt,(err,hash)=>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        user.password=hash;
                        next();
                    }
                })
            }
        })
    }
    else{
        next();
    }
})

UserSchema.methods.genAuth=function () {

    let user=this;
    let access='auth';
    let token=jwt.sign({_id:user._id.toHexString(),access},'abc').toString();

    user.token.push({access,token:token});
    return user.save().then(()=>{
        return token;
    });

}


let user=mongoose.model('user',UserSchema);
module.exports={user};