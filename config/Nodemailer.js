const transporter = require('nodemailer');
require('dotenv').config();


const Sender = transporter.createTransport({
    service:'gmail',
    auth:{
        user:"codebeta7.official@gmail.com" || process.env.EMAIL,
        pass:"hpkscjcjrtaknkqy"|| process.env.PASSWORD
    }
})


module.exports =Sender;