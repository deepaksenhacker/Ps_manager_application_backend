const jwt = require('jsonwebtoken')
require('dotenv').config();
const jwtUser = (req ,res ,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send('Please Authenticate valid token !');

    }
    try{
        const {userId } =jwt.verify(token,process.env.SECRET);
        req.userId = userId;
        console.log(userId);
        next();
    }catch(err){
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
};
module.exports =jwtUser;