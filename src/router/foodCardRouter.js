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
cardRouter.get("/card", async (req, res) => {
    try {
      const { search } = req.query;
  
      let query = {};
      if (search) {
     
        query = {
          $or: [
            { name: { $regex: search, $options: "i" } }, 
            { description: { $regex: search, $options: "i" } }
          ]
        };
      }
  
      const cards = await Card.find(query);
  
      if (!cards || cards.length === 0) {
        return res.status(404).json({ message: "No items found matching the search criteria" });
      }
  
      return res.status(200).json({
        message: "Cards found",
        cards
      });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching cards", error: error.message });
    }
  });
  

module.exports = cardRouter