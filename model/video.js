const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
    filePath: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('video', videoSchema)