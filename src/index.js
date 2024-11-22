const express = require("express")
require("dotenv").config()
const connectDb = require("./config/database")
const userRouter = require("./router/userRouter")
const imageRouter = require("./router/imageRouter")
const cors = require("cors")
const app = express()
const corsOptions = {
    origin:[
        "http://localhost:5173"
    ],
    method:["GET","POST","PUT","DELETE"]
}
app.use(cors(corsOptions))

const PORT = process.env.PORT || 7000
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/", userRouter)
app.use("/api/", imageRouter)

connectDb()
.then(() => {
    console.log("MongoDB connected successfully...")
    app.listen(PORT,() => {
        console.log(`server is running on ${PORT}`)
    })
}).catch((err) => {
    console.log("mongodb connection failed" + err)
})