const express = require("express")
const Images = require("../models/images.schema")

const imageRouter = express.Router();


imageRouter.post("/image", async (req, res) => {
    try {
      const { data } = req.body; 
      
     
      if (typeof data !== 'object' || Array.isArray(data)) {
        return res.status(400).json({ message: "Data should be an object of key-value pairs." });
      }
  
     
      const image =  new Images({ data });
  
      await image.save(); 
  
      return res.status(200).json({
        message: "Image saved successfully",
        data: image, 
      });
    } catch (error) {
      return res.status(500).json({ message: "Error saving image", error: error.message });
    }
  });
imageRouter.get("/image", async (req, res) => {
    try {
     
  
     
      const image =  await Images.find({})
      if(!image){
        return res.status(404).json({message:"images not found",status:"404"})
      }
  
  
      return res.status(200).json({
        message: "Image",
        data: image, 
      });
    } catch (error) {
      return res.status(500).json({ message: "Error saving image", error: error.message });
    }
  });
  
module.exports = imageRouter;
