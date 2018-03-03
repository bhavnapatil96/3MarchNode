const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost/pmt",(err,res)=>{
    if(res)
    {
        console.log('Connected.....');
    }
});