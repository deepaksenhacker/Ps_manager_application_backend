const exp = require('express');
const jwtUser = require('../config/jwtUser');
const psModel = require('../models/psModel');


const password = exp.Router();

password.post('/create_password',jwtUser,async(req,res)=>{
    const {username,p_User, password,media} = req.body;
try {
    const userId = req.userId;
    const pass = new psModel({
    username:username,
    password:password,
    media:media,
    p_User:p_User,
    byuser:userId
    })
    await pass.save();
    res.json({success:"Password is created Successfully !"});
} catch (error) {
    console.error(error);
}
});

password.get('/show-passwords',jwtUser,async(req,res)=>{
    const userId =req.userId;
    try {
        const pass = await psModel.find({byuser: userId});
        res.json({data :pass});
    } catch (error) {
        console.error(error);
    }
})

password.get('/show-insta-passwords',jwtUser,async(req,res)=>{
    const userId =req.userId;
    try {
        const pass = await psModel.countDocuments({byuser: userId,media:'instagram'});
        res.json({data :pass});
    } catch (error) {
        console.error(error);
    }
})





module.exports = password;