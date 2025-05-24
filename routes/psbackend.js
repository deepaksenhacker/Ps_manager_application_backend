const exp = require('express');
const uploader = require('../cloudinary/multerCloud');
const jwtUser = require('../config/jwtUser');
const driveModel = require('../models/driveModel');
const FolderModel = require('../models/FolderModel');
const bulkModel = require('../models/bulkuploadModel');
const cloudinary =require('cloudinary').v2
const ps =exp.Router();


ps.get('/', (req, res) => {
  res.send('GET request to the ps backend')
});

// bulk file upload

ps.post('/bulk_upload',jwtUser,uploader.array('files',10),async(req,res)=>{
    const {bulk_remark,bulk_no }= req.body;
    try {
      let uploadedfiles =[]
      
      
      for (const file of req.files){
        //cloudinary upload
        
        const uploaded  = await cloudinary.uploader.upload(file.path,{
          folder:'bulk_files_uploads'
        });
      let ext = file.originalname.split('.').pop();
      uploadedfiles.push({
        publicId:uploaded.public_id,
        url:uploaded.secure_url,
        extention:ext
      });
      const bulk= new bulkModel({
        bulk_no:bulk_no,
        bulk_remark:bulk_remark,
        bulk_data:uploadedfiles
      })
    const saved = await bulk.save();
    res.status(304).json({success:"uploaded files all success full"});
    console.log(`saved`, saved);
    
    }

    } catch (error) {
      res.status(400).json({error:"Internel Server Problem Contact the programmer !"});
      console.log(`error`, error);
    }
})




ps.post('/upload_file_server', jwtUser, uploader.single('file'), async (req, res) => {
  const { docType, docRemarks ,docNumber,docReminder ,docExpires} = req.body;

  // Ensure file and docType/docName are provided
  if (!req.file) {
    return res.status(400).json({ error: 'File is not existing here!' });
  }        
  try {
    const userId = req.userId; // Make sure jwtUser is setting req.userId
    
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: req.file.mimetype==='application/pdf'?'raw':'image', // Non-image files
      folder:'documentdata', // Cloudinary folder
      access_mode: "public",  
      format:req.file.mimetype==='application/pdf'?'pdf':undefined
    });
    
    
   
      const uploaded = new driveModel({
        docType:docType,
        docNumber:docNumber,
        docRemarks: docRemarks,
        docUrl: result.secure_url,
        docUser: userId,
        public_id:result.public_id,
        docExtention:req.file.mimetype==='application/pdf'?'pdf':'image',
        docExpires: docExpires,
        docReminder:docReminder,
        docSize:req.file.size
      });

      const data = await uploaded.save();
       res.json({ success :"Document is Uploaded ! "});
   

      

  } catch (error) {
    console.error(error); // Log error details
    res.json({ error: 'Internal server error' });
  }
});



// image upload


//update 

ps.post('/update/:id',jwtUser,async(req,res)=>{
  const {docNumber , docReminder ,docExpires ,docRemarks} =req.body;

  const {id} =req.params;

  try{
const doc =  await driveModel.find({_id :id , docUser:req.userId});

if(!docNumber && !docReminder && !docExpires && !docRemarks){
  return res.json({error:'Update is not found !'});
}

const updates ={};
if(docNumber){
  updates.docNumber = docNumber;
}
if(docRemarks){
  updates.docRemarks = docRemarks;
}
if(docExpires){
  updates.docExpires = docExpires;
}
if(docReminder){
  updates.docReminder = docReminder;
}


if(!doc){
  return res.json({error:"Document is not found !"});
}
const update = await driveModel.updateOne({_id:id ,docUser:req.userId},{$set:updates},{new:true});

res.json({success:"Updated Success !"})

}catch(error){
  console.error(error)
}


})






// get doc
ps.get('/getdoc',jwtUser,async(req,res)=>{
  try{
    
    const document = await driveModel.find({docUser:req.userId}).sort({docDate:-1}).limit(6);
  
    res.json({document:document})
  
  }catch(err){
    console.error(err)
  }
})


// get file

ps.get('/getfile/:fileId',jwtUser,async(req,res)=>{
  const {fileId} = req.params;
  try {
    const doc = await driveModel.findById({_id:fileId ,docUser:req.userId});
    res.json({file:doc});
  } catch (error) {
    console.log(error)
  }
})
//download
ps.get('/download/:file',jwtUser,async(req,res)=>{
  const {file }= req.params;
  try{
  const doc = await driveModel.findById({_id:file ,docUser:req.userId});
  const publicid = doc.public_id;
  let url="";
  if(doc.docExtention === "image"){
   url = cloudinary.url(publicid,{resource_type:"image"})
   
  }
 else{
  url =  cloudinary.url(publicid,{resource_type:"raw"})
  
 } 
  res.json({url})
  }catch(error){
    console.error(error)
  }
})



// create folder




ps.post('/create_folder',jwtUser,async(req,res)=>{
  const {folderName }=req.body;
  try {
    const folder = new FolderModel({
      folderName:folderName,
      user:req.userId
        });

      await folder.save(); 
      res.json({success:"Folder is Created !"})
    
  } catch (error) {
    res.json({error : "Folder is already created !"})
    console.log(error)
  }
})

//store files in a folder 

    ps.post('/store_in_folder/:folderId',jwtUser,async(req,res)=>{
      const {files} =req.body;
      const {folderId} =req.params;
    try{
        const doc = await FolderModel.findOne({_id :folderId ,user :req.userId});
        const docfileex  = await  FolderModel.find({_id:folderId ,user:req.userId ,files:{$in:files}});
        if(docfileex.length>0){
          res.json({error:"Files is already existed here !"})
        }else{
            
          doc.files.push(...files);
          await doc.save();
          res.json({success:"Files add Successfully"})
        }

    } catch(error){
      console.error(error)
    }


    })
// getfolder
ps.get('/getfolders',jwtUser,async(req,res)=>{
  try {
    const folders = await FolderModel.find({user:req.userId});
    res.json({folders})
   
  } catch (error) {
    console.log(error);
  }
})

// getfolder files
ps.get('/getfiles/:folder',jwtUser,async(req,res)=>{
  
  const {folder} =req.params;
  try {
    const folderIs = await FolderModel.findById({_id:folder}).populate('files');
    const files = folderIs.files;
    res.json({files:files})   
   
  } catch (error) {
    console.log(error);
  }
})













// analyse
const mbconvert =(file_size)=>{
      const size = (file_size /(1024 * 1024)) ;
      return Math.round(size);
    }


  ps.get('/total_document',jwtUser,async(req,res)=>{
  const userId = req.userId
    try {
      const data = await driveModel.countDocuments({docUser:userId});
      const image =await driveModel.countDocuments({docUser:userId ,docExtention:"image"}); 
      const pdf =await driveModel.countDocuments({docUser:userId ,docExtention:"pdf"}); 
      const FileSize= await driveModel.find({docUser:userId});
      const totalfilesize= FileSize.reduce((total ,doc)=>total + (doc.docSize || 0),0);
      const mb = mbconvert(totalfilesize)

      // today uploads
      const gdate = new Date();
      gdate.setHours(0,0,0,0);
      const ldate = new Date();
      ldate.setHours(23,59,99,999)
      const today = await driveModel.countDocuments({docUser:userId , docDate:{$gte:gdate,$lte:ldate}});
      const todayItems = today;
      res.json({data:data ,image:image ,pdf:pdf , FileSize:FileSize ,totalfilesize :mb ,todayItems :todayItems})
    
    } catch (error) {
      console.error(error);
    }
  })



// delete file 


ps.get('/delete_file/:fileId',jwtUser,async(req,res)=>{
  const {fileId} =req.params;
  
  try {
  const file = await driveModel.findById({_id:fileId  ,docUser:req.userId});
  
    if(file){
      const deleteCloudinary = await cloudinary.uploader.destroy(file.public_id);
 
      await driveModel.findByIdAndDelete({_id:fileId});
      await FolderModel.deleteOne({file :[fileId] , user :req.userId});
 
      
      return res.json({success:'File is Deleted Successfully !'});
    }

    res.json({error:'File is not exist ! !'})

  } catch (error) {
    console.error(error);
    res.json({error:'Please retry to delete Internel Server Error'})
  }

})

// delete many


ps.post('/deleteMany', jwtUser, async (req, res) => {
  const { List_id, public_id } = req.body;

  try {
      if (!List_id?.length || !public_id?.length) {
          return res.json({ error: "Select at least one item!" });
      }

      // Find documents in the database
      const items = await driveModel.find({ _id: { $in: List_id } });

      if (!items.length) {
          return res.json({ error: "No files found for deletion!" });
      }

      // Separate PDF and image public IDs
      const pdfPublicIds = items.filter(item => item.docExtention === "pdf").map(item => item.public_id);
      const imagePublicIds = items.filter(item => item.docExtention !== "pdf").map(item => item.public_id);

      // Delete PDFs (if any)
      if (pdfPublicIds.length) {
          await cloudinary.api.delete_resources(pdfPublicIds, { resource_type: 'raw' });
      }

      // Delete images (if any)
      if (imagePublicIds.length) {
          await cloudinary.api.delete_resources(imagePublicIds, { resource_type: 'image' });
      }

      // Delete records from the database
      await driveModel.deleteMany({ _id: { $in: List_id } });

      res.json({ success: "Deletion Successful!" });

  } catch (error) {
      console.error(error);
      res.json({ error: "Server issue! Please try again." });
  }
});




//expires

ps.get('/expires',jwtUser ,async(req,res)=>{
  try {
    const doc = await driveModel.find({docUser:req.userId ,docExpires:{$ne:null}});
    res.json({doc}) 
  } catch (error) {
    console.log(error)
  }
})











//get search doc 





ps.post('/search',jwtUser,async(req,res)=>{
  const {search, from ,to ,docNumber} = req.body;
  try{
 
  const gdate = from?new Date(from):new Date() ;
  gdate.setHours(0,0,0,0);
  const ldate = to?new Date(to):new Date() ;
  ldate.setHours(23,59,99,999)
  console.log(gdate);
  console.log(ldate);

    
if(search){
    const doc = await driveModel.find({docRemarks:{$regex:search ,$options:'i'} , docUser:req.userId });
    return res.json({doc})
  }
 
    
if(docNumber){
  const doc = await driveModel.find({docNumber:docNumber, docUser:req.userId });
  return res.json({doc})
}




  if(from && to){
    const doc = await driveModel.find({ docUser:req.userId ,docDate:{$gt:gdate,$lte:ldate} });
    return res.json({doc})
  }
    
res.json({error:"Please Fill any .."})
 
  }catch(error){
console.error(error)
  }
})






module.exports= ps;