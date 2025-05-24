const {Schema,model ,default:mongoose} =require('mongoose')

const folderSchema = new mongoose.Schema({
folderName:{
    type:String,
    required:true,
    unique:true
},

files:[{
    type:Schema.Types.ObjectId,
    ref:'drive',

  
}],

user:{
    type:Schema.Types.ObjectId,
    ref:'user',
    required:true
}
});

folderSchema.index({user:1});

const FolderModel =  mongoose.model('folder',folderSchema);

module.exports =FolderModel;
