const express = require("express")
require("dotenv").config()
const connectDb = require("./config/database")
const userRouter = require("./router/userRouter")
const imageRouter = require("./router/imageRouter")
const cors = require("cors")
const cardRouter = require("./router/foodCardRouter")
const reviewRouter = require("./router/reviewRouter")
const cartRouter = require("./router/cartRouter")
const checkoutRouter = require("./router/checkoutRouter")
const app = express()
const corsOptions = {
    origin:[
        process.env.LOCAL_FRONTEND_URL,
        process.env.FRONTEND_URL
    ],
    method:["GET","POST","PUT","DELETE"]
}
app.use(cors(corsOptions))

const PORT = process.env.PORT || 7000
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/", userRouter)
app.use("/api/", imageRouter)
app.use("/api/", cardRouter)
app.use("/api/", reviewRouter)
app.use("/api/",cartRouter)
app.use("/api/",checkoutRouter)

connectDb()
.then(() => {
    console.log("MongoDB connected successfully...")
    app.listen(PORT,() => {
        console.log(`server is running on ${PORT}`)
    })
}).catch((err) => {
    console.log("mongodb connection failed" + err)
})