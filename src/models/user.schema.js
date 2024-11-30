const mongoose = require("mongoose")
const { trim } = require("validator")

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim:true
    },
    phone:{
        type: String,
        required: true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required: true,
        lowercase:true,
        trim:true
    },
    password:{
        type: String,
        required: true,
        trim:true
    },
   
    fullName:{
        type: String,
        trim:true
    },
    gender:{
        type: String,
        trim:true
    },
    
    country:{
        type: String,
        trim:true
    },

   
},{
    timestamps: true
})

const User = mongoose.model("User", userSchema)
module.exports = User