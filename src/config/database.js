const mongoose = require("mongoose")
require("dotenv").config()
const MONGO_URI = process.env.MANGO_URI
const connectDb = async () => {
    try {
        await mongoose.connect(MONGO_URI,{
            dbName: 'FoodApp',  
        })
    } catch (error) {
        console.log("mongodb connection failed" + error)
        process.exit(1)
    }
}

module.exports = connectDb