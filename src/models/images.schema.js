const mongoose = require("mongoose")

const imagesSchema = new mongoose.Schema({
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    }
})

const Images = mongoose.model("Images",imagesSchema)

module.exports = Images