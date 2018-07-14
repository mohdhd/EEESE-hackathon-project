const mongoose = require('./../config/mongoose')
const Schema = mongoose.Schema

// Set the Post Schema
const CommentSchema = Schema({
    author: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
        trim: true,
    },
    num: {
      type: Number,
    },
})

// Export the Post model
module.exports = CommentSchema;
