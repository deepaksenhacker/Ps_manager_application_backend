const { Schema, default: mongoose } = require("mongoose");



const psSchema = new Schema({
    username:{
        type:String,
        required:true,
     
    },
    password:{
        type:String,
        required:true
    },
    media:{
        type:String,
        required:true
    },p_User:{
        type:String,
        required:true
    },
    byuser:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    Date:{
        default:Date.now(),
        type:Date
     }

});



psSchema.index({byuser:1});


const psModel= mongoose.model('psmodel',psSchema);
module.exports = psModel;

