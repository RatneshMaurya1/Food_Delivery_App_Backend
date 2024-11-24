const express = require("express")
const Card = require("../models/foodCard.schema")

const cardRouter = express.Router()

cardRouter.post("/card",async(req,res) => {
    try {
        const {name,title,description,price,mainImage,addImageBg,addImage} = req.body

        const cardData = new Card({
            name,
            title,
            description,
            price,
            mainImage,
            addImageBg,
            addImage
        })
    
        await cardData.save()
        return res.status(201).json({message:"card created successfullyy",
            cardData
        })
        
    } catch (error) {
        return res.status(500).json({ message: "Error saving image", error: error.message });
      }
})
cardRouter.get("/card",async(req,res) => {
    try {
        const cards =  await Card.find({})
        if(!cards){
          return res.status(404).json({message:"item not found",status:"404"})
        }
    
    
        return res.status(200).json({
            message: "cards",
            cards 
          });
        
    } catch (error) {
        return res.status(500).json({ message: "Error saving image", error: error.message });
      }
})


module.exports = cardRouter