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
    addresses: [
        {
          state: String,
          city: String,
          pinCode: Number,
          phoneNumber: Number,
          fullAddress: String,
        },
      ],
},{
    timestamps: true
})

const User = mongoose.model("User", userSchema)
module.exports = User