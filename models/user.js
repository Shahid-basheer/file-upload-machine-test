const mongoose = require("mongoose");
const scheema = mongoose.Schema;
const uniqueValidatior = require("mongoose-unique-validator");
const User = scheema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    },
    password:{
        type:String,
        required:true
    }
})
User.plugin(uniqueValidatior);
module.exports = mongoose.model("User",User)