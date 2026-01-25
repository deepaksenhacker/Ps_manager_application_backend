const { CloudinaryStorage } = require('multer-storage-cloudinary');

require('dotenv').config();


const cloudinary =require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET
})


const multer = require('multer');


const upload = multer.diskStorage({});
const uploader = multer({storage:upload})

module.exports = uploader;
