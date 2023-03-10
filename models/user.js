const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalSchema = require('passport-local-mongoose')

const userSchema = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    },
    facebookId: String
})
userSchema.plugin(passportLocalSchema)

module.exports = mongoose.model('User',userSchema)