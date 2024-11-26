const mongoose = require("mongoose")


const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    items:[
        {
            cardId:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Card",
                required:true
            },
            quantity:{
                type:Number,
                required:true,
                default:1
            },
            price:{
                type:Number,
                required:true
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Cart = mongoose.model("Cart", cartSchema)

module.exports = Cart