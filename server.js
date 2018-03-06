const express=require('express');
var app=express();

const bodyParser=require('body-parser');
const _=require('lodash');
const bcrypt=require('bcryptjs')
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
let token;
const conn=require('./db/conn');
const state=require('./models/state').state;
const city=require('./models/city').city;
const user=require('./models/users').user;
const project=require('./models/project').project;

var expupload=require('express-fileupload')
app.use(expupload())
app.use(express.static(__dirname+'/'))

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header("Access-Control-Allow-Headers","Content-Type,x-auth,X-Requested-With,Origin");
    res.header("Access-Control-Expose-Headers",'x-auth');
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/')
})

app.post('/state/add',(req,res)=>{
     newState=new state({
         statename:req.body.statename
     });

     newState.save().then((data)=>{
         if(data){
             res.send(data);
         }
     }).catch((e)=>{
         res.send(e);
     })

})
app.get('/state/list',(req,res)=>{
    state.find().then((data)=>{
        res.send(data)
    }).catch((e)=>{
        res.send(e)
    })
})
app.post('/city/add',(req,res)=>{
    newCity=new city({
        cityname:req.body.cityname,
        stateId:req.body.stateId
    });

    newCity.save().then((data)=>{
        if(data){
            res.send(data);
        }
    }).catch((e)=>{
        res.send(e);
    })

})
app.get('/city/list',(req,res)=>{
    city.find().then((data)=>{
        res.send(data)
    }).catch((e)=>{
        res.send(e)
    })
})

app.post('/user/add',(req,res)=>{
    newuser=new user({
        name:req.body.name,
        email:req.body.email,
        contact:req.body.contact,
        state:req.body.state,
        city:req.body.city,
        password:req.body.password
    });

    newuser.save().then((data)=>{

        let token=newuser.genAuth();
        console.log('token',token);
        token.then((t)=>{
            res.header('x-auth',t).send(data);
        })

    }).catch((e)=>{
        res.send(e);
    })

})

app.post('/project/add',(req,res)=>{

    console.log(req.body)
    //console.log(req.files)
    var sampleFile=req.files.pic
    sampleFile.mv(__dirname+'/upload/'+sampleFile.name)

    let start =new Date(req.body.startDate);
    let end =new Date(req.body.endDate);
   // console.log('Date',end);

 var newProject=new project({
        name:req.body.name,
        startDate:req.body.startDate,
        endDate:req.body.endDate,
        pic:sampleFile.name,
        client:req.body.client,
    });

    newProject.save().then((data)=>{
        if(data){
            res.send(data);
        }

    }).catch((e)=>{
        res.send(e);
    })

})
app.get('/project/list',(req,res)=>{
    project.find({flag:true}).then((data)=>{
        res.send(data);
    })
})
app.post('/project/delete',(req,res)=>{
    project.findByIdAndUpdate(req.body.id,{$set:{flag:false}}).then((data)=>{
        res.send(data);
    }).catch((e)=>{
        res.send(e);
    })
})
app.post('/project/update',(req,res)=>{
    // var body=_.pick(req.body,['id','name','startDate','endDate','client'])
    project.findById(req.body.id).then((data)=>{

        data.name=req.body.name,
            data.startDate=req.body.startDate,
            data.endDate=req.body.endDate,
            data.client=req.body.client

        if(req.files!==null){
            var sampleFile=req.files.pic
            sampleFile.mv(__dirname+'/upload/'+sampleFile.name)
            data.pic=sampleFile.name
        }


        data.save().then((success)=>{
            res.send(data);
        })
    }).catch((e)=>{
        res.send(e);
    })
})


app.post('/user/loginp',passport.authenticate('local',{
    successRedirect:'/success',
    failureRedirect:'/err'
}));


passport.serializeUser((user,done)=>{
    console.log('serialize')
    return done(null,user);
})
passport.deserializeUser((user,done)=>{
    console.log('deserialize');
    return done(null,user);
})

app.get('/success',(req,res)=>{
    res.header('x-auth',token).send('success');
})
app.get('/err',(req,res)=>{
    res.send('Invalid Username or Password');
})

passport.use(new LocalStrategy((username,password,done)=>{
    console.log('middle',username,password);

    user.findOne({email:username},(err,user1)=>{
        if(err)
        {
            console.log('error ',err)
        }
        if(user1){
            console.log(user1)
            bcrypt.compare(password,user1.password,(err,res)=>{
                if(res){
                    console.log('success')
                    token=user1.token[0].token;
                    return done(null,user1);
                }
                else{
                    console.log('err' ,err)
                    return done(null,false);
                }
            })
        }
        else{
            return done(null,false)
            console.log("Not Found")
        }
    }).catch((e)=>{
        res.send(e);
    })
}))
app.listen('8989',(err,res)=>{
    console.log('Server Connected on 8989 port');
})