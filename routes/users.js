
const exp = require('express');
const userModel = require('../models/usersModel');
const bcrypt = require('bcrypt')
const router =exp.Router();
const otp = require('otp-generator');
const env = require('dotenv');
const Sender = require('../config/Nodemailer');
const jwt = require('jsonwebtoken');
const jwtUser = require('../config/jwtUser');
const salt = 10;
env.config();





let verificationCodes=""; 

router.post('/register', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user already exists
        const exUser = await userModel.findOne({email:{$regex:email,$options:"i"}});
        if (exUser) {
            return res.json({ error: 'Existing user found' });
        }

        // Generate OTP
        const code =  otp.generate(6, { upperCaseAlphabets: false, specialChars: false });
        const codeSend = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Verification Code',
            text: `Ps Locker Mail this verification code is only for 20 sec so please take..., this is your verification code: ${code}`
        };

        
        
        console.log("Verification codes object after storing:", verificationCodes); // Debugging

        // Send OTP email
        const sendResult = await Sender.sendMail(codeSend);
        verificationCodes =code;
        if (sendResult) {
            return res.json({ success: 'Verification code sent successfully!' });
             
        
        } else {
            return res.json({ error: 'Failed to send verification code!' });
        }
    } catch (error) {
        console.error("Error in /register route:", error); // Log the error for debugging
        res.json({ error: 'Something went wrong!' });
    }
});


// sending forgot password verification code

router.post('/send/verification', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user already exists
        const exUser = await userModel.findOne({email:{$regex:email,$options:"i"}});
        if (!exUser) {
            return res.json({ error: 'user is found' });
        }

        // Generate OTP
        const code =  otp.generate(6, { upperCaseAlphabets: false, specialChars: false });
        const codeSend = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Forgot Password ! Verification Code hurry Up',
            text: `Ps Locker Mail this verification code is only for 20 sec so please take..., this is your verification code: ${code}`
        };

        
        
        console.log("Verification codes object after storing:", verificationCodes); // Debugging

        // Send OTP email
        const sendResult = await Sender.sendMail(codeSend);
        verificationCodes =code;
        if (sendResult) {
            return res.json({ success: 'Verification code sent successfully!' });
             
        
        } else {
            return res.json({ error: 'Failed to send verification code!' });
        }
    } catch (error) {
        console.error("Error in /register route:", error); // Log the error for debugging
        res.json({ error: 'Something went wrong!' });
    }
});





router.post('/verifyCode', async (req, res) => {
    const { verifyCode } = req.body;

    try {

        const verifiedCode = verificationCodes;

        setTimeout(() => {
            verificationCodes="";
        }, 20000);

        // Check if the verification code exists for the provided email
        console.log(verifiedCode);
        if (verifiedCode==="") {
            console.log("Verification codes object on /verifyCode:", verificationCodes); // Debugging
            return res.json({ error: 'Verification code not sent or expired!' });
        }
        console.log(verifyCode)
        // Validate the provided verification code
        if (verifiedCode !== verifyCode) {
            return res.json({ error: 'Verification code is incorrect!' });
        }
        
        // If successful
        res.json({ success: "Verification Success" });
    } catch (error) {
        console.error("Error in /verifyCode route:", error); // Log the error for debugging
        res.json({ error: 'An error occurred during verification. Please try again!' });
    }
});


router.post('/update/password', async (req, res) => {
    const { email,password } = req.body;

    try {
        // Check if the user already exists
        const exUser = await userModel.findOne({email:{$regex:email,$options:"i"}});
        if (exUser) {
            return res.json({ error: 'Existing user found' });
        }
        const encypt = await bcrypt.hash(password,salt)
     await userModel.findOneAndUpdate({email,email},{$set:{password:encypt}});
        // Generate OTP
        const Message = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password is Have been updated',
            text: `Ps Locker Password is Updated Don't Share Password as Public.. Keep Safe !`        
        };
        
   

        // Send OTP email
        const sendResult = await Sender.sendMail(Message);

        if (sendResult) {
            return res.json({ success: 'Password is Updated successfully!' });
             
        
        } else {
            return res.json({ error: 'Failed to send verification code!' });
        }
    } catch (error) {
        console.error("Error in /register route:", error); // Log the error for debugging
        res.json({ error: 'Something went wrong!' });
    }
});












router.post('/signup', async (req, res) => {
    const { email, password, username ,token } = req.body;

    try {

        if (!email || !password || !username) {
            return res.status(400).json({ error: 'All fields are required' });
      
        }
        // Check if user already exists
        const existingUser = await userModel.findOne({email:{$regex:email,$options:"i"}});
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Encrypt the password
        const saltRounds = 10;
        const encPass = await bcrypt.hash(password, saltRounds);

        // Generate a token (you can use JWT or any other method)
   
        // Create a new user
        const user = new userModel({
            email,
            password: encPass,
            token,
            username
        });

        // Save the user to the database
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});














router.get('/sendmail', async(req, res) => {
try {
    const reciver = 'care.deepaksen@gmail.com';
    const mail = {
        from:process.env.EMAIL,
        to:reciver,
        subject:'Verification',
        text:'hey this is the testing mail !'
    }
    console.log(mail)
    const sendmail = await Sender.sendMail(mail);
    res.send(sendmail)
    console.log(sendmail);
} catch (error) {
    res.send(error)    
}

})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Check if the user exists
        const user = await userModel.findOne({email:{$regex:email,$options:"i"}});
        
        if (!user) {
            return res.json({ error: 'Email is not registered!' });
        }
        if (!email || !password) {
            return res.json({ error: 'Email and password are required!' });
        }
        

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.json({ error: 'Incorrect password!' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, userEmail: user.email }, 
            process.env.SECRET,  // The secret key should be in your .env file
            { expiresIn: '2d' }  // Token expires in 1 hour
        );

        // Send the token in the response
        res.json({ token :token });

    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).json({ error: 'Internal error. Please try again later.' });
    }
});

// 
router.get('/getuser',jwtUser,async (req, res) => {

try {
    const user = await userModel.findById({_id:req.userId}).select('-password');
    res.json({user});
} catch (error) {
    console.log(error)        
}

})



module.exports= router;