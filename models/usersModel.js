const { Schema, default: mongoose } = require("mongoose");



const userSchema = new Schema({
    username:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:Number,
        required:true
    },
    admin:{
        type:String
       },
    Date:{
        default:Date.now(),
        type:Date
     },
    
});

userSchema.index({email:1});


const userModel= mongoose.model('user',userSchema);


module.exports = userModel;

