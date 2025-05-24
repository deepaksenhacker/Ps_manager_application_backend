const transporter = require('nodemailer');
require('dotenv').config();


const Sender = transporter.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
})


module.exports =Sender;