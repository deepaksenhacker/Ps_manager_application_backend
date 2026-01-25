const { urlencoded } = require("body-parser");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const dbconn = async()=>{
    try {
       await mongoose.connect(process.env.MONGODB);
        console.log("Database is connected psmanagerbackend");
    } catch (error) {
        console.log("Connection error",error);

    }
    
}

module.exports ={
    dbconn
};