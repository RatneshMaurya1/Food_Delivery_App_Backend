const express = require("express")
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")
const User = require("../models/user.schema")
const userAuth  = require("../middlewares/userAuth")
const validator = require("validator")
const {validateSignup} = require("../utils/validate")
require("dotenv").config()
const userRouter = express.Router()



userRouter.post("/signup", async (req, res) => {
    try {
        validateSignup(req)
      const { name, phone, email, password } = req.body;
      if(!validator.isEmail(email)){
          return res.status(400).json({ message: "Invalid email format", status: "400" });
      }
      if(!validator.isMobilePhone(phone)){
        return res.status(400).json({ message: "Invalid phone number", status: "400" });
      }
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if(!regex.test(password)){
        return res.status(400).json({
          message: "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and symbols",
          status: "400",
        });
      }
      const isUserExists = await User.findOne({ email });
      if (isUserExists) {
        return res
          .status(400)
          .json({ message: "Email already taken", status: "400" });
      }
      if (name.length < 4) {
        return res
          .status(400)
          .json({ message: "Name is too short", status: "400" });
      }
      if (name.length > 20) {
        return res
          .status(400)
          .json({ message: "Name is too long", status: "400" });
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        password: hashPassword,
        phone,
      });
      await user.save();
      const { password: _, ...safeUserData } = user.toObject();
      return res.status(201).json({
        message: "Sign up successfully",
        status: "201",
        data: safeUserData,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message, status: "400" });
    }
  });

  userRouter.post("/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if(!email || !password){
        return res.status(400).json({message:"Email and Password are required"})
      }
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format", status: "400" });
      }
  
   
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password", status: "400" });
      }
  
     
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid email or password", status: "400" });
      }
  
      const token = JWT.sign({email}, process.env.SECRET)
  
     
      const { password: _, ...safeUserData } = user.toObject();
  
      
      return res.status(200).json({
        message: "Logged in successfully",
        status: "200",
        user: safeUserData,
        token,
      });
    } catch (error) {
      console.error("Signin error:", error);
      return res.status(500).json({ message: "Internal Server Error", status: "500" });
    }
  });

  userRouter.post("/profile",userAuth, async (req,res) => {
    try{
       const user = req.user
   

    return res.json({message: "user profile",
        user,
    })
    } catch (error) {
       return res.status(400).json({message:error.message,
        status:"400"
       })
    }
})

module.exports = userRouter
  