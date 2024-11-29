const mongoose = require("mongoose")



const debitCardSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    cardNumber:{
        type:String,
        required:true,
    },
    expire:{
        type:String,
        required:true
    },
    cvc:{
        type:String,
        required:true
    },
    cardName:{
        type:String,
        required:true
    }
})

const DebitCard = mongoose.model("DebitCard",debitCardSchema)

module.exports = DebitCard