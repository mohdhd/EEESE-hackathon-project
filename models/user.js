// User model


const mongoose = require('./../config/mongoose')
const validator = require('validator')
const bctypt = require('bcryptjs')
const messagesSchema = require('./message')
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: "Invalid Email"
        }

    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    faculty: {
        type: String,
        trim: true
    },
    avg: {
        type: Number
    },
    msg:{
        type:Array
    }

})

UserSchema.methods.validPassword = function(password) {

    return bctypt.compareSync(password, this.password)
}
let User = module.exports = mongoose.model('User', UserSchema)