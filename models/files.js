const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Files = schema({
filename:{
    type:String,
    required:[true,"name's required"]
},
url:{
    type:String,
    required:[true,"file's required"]
},
user:{
  type:mongoose.Schema.Types.ObjectId,
  required:true,
  ref:"User"
} 
})

module.exports = mongoose.model("Files",Files);