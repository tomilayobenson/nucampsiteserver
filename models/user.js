const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalSchema = require('passport-local-mongoose')

const userSchema = new Schema({
    admin: {
        type: Boolean,
        default: false
    }
})
userSchema.plugin(passportLocalSchema)

module.exports = mongoose.model('User',userSchema)