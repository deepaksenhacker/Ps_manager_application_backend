const { Schema, default: mongoose } = require("mongoose");



const driveSchema = new Schema({
    docReminder:{
        type:Number,
        default:0
        
    }, 
    docExtention:{
        type:String
    },
    docNumber:{
        type:String,
        required:true
    }
    ,
    docRemarks:{
        type:String,
        required:true
    },
    public_id:{
        type:String,
        required:true
    },
    docUrl:{
        type:String,
        required:true
    },
    docUser:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    docExpires:{
        type:Date
    }
    
    ,docDate:{
        default:Date.now(),
        type:Date
     }
,docSize:{
    type:Number,
    required:true
}
});

driveSchema.index({docName:1});

const driveModel= mongoose.model('drive',driveSchema);
module.exports = driveModel;

