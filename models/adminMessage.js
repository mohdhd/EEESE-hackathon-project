const mongoose = require('../config/mongoose');

const Schema = mongoose.Schema

const MessageSchema = new Schema({
    author:{
        type:String,
        trim:true,
    },
    authorEmail:{
        type:String,
    },
    title: {
        type: String,
        required: true, 
        trim:true
    },
    body: {
        type: String,
        required: true
    },
    target:{
        type:String,
        required:true
    }
});
const adminMessage = module.exports = mongoose.model("adminMessage", MessageSchema)
