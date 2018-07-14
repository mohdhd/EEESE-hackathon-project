const mongoose = require('../config/mongoose');

const Schema = mongoose.Schema

const MessageSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});
module.exports = MessageSchema