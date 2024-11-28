const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    state:{
        type:String,
    },
    city:{
        type:String,
    },
    pinCode:{
        type:String,
    },
    phoneNumber:{
        type:String,
    },
    fullAddress:{
        type:String
    }
})

const Address = mongoose.model("Address",addressSchema)
module.exports = Address