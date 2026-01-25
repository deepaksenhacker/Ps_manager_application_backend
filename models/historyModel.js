const {Schema, model} = require("mongoose");

const historySchema = new Schema({
     docFromDate:{
        type:Date,
        required:true      
    },
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

historySchema.index({docNumber :1});

const historyModel = model('history',historySchema);

module.exports = historyModel;