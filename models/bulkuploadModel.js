const mongoose = require('mongoose');

const bulkschema = new mongoose.Schema({
    bulk_no:{
        type:Number,
    
    },
    bulk_remark:{
        type:String,
        required:true
    },
    bulk_data:[
        {
            publicId:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            },
            extention:{
                type:String,
                required:true
            }
        }
    ],
    
},{
    timestamps:true
    });


const bulkModel = mongoose.model('bulk',bulkschema);


module.exports = bulkModel