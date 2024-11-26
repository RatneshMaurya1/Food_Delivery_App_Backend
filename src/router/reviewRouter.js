const express = require("express")
const Review = require("../models/reviews.schema")

const reviewRouter = express.Router()

reviewRouter.post("/review", async(req,res) => {
    try {
        const {name,location,description,date} = req.body
        if(!name || !location || !description || !date){
            return res.status(400).json({message:"All fields are required"})
        }
        const userReview = new Review({
            name,
            location,
            description,
            date
        })
        await userReview.save()
    
        return res.status(201).json({message:"Review added successfully",
            data:userReview
        })
    } catch (error) {
        return res.status(400).json({message:error.message,
            status:"400"
        })
    }
})
reviewRouter.get("/review", async(req,res) => {
    try {

        const userReview = await Review.find({})
        if(!userReview){
            return res.status(404).json({message:"review not found"})
        }

        return res.status(200).json({message:"User reviews",
            data:userReview
        })
    } catch (error) {
        return res.status(400).json({message:error.message,
            status:"400"
        })
    }
})


module.exports = reviewRouter
