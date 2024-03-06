const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Schema for Users. You can customise the variables as it should be in a user.
var User = new Schema({
    email: {
        type: String
    },
    password: {
        type: String
    }
})

module.exports = mongoose.model('User', User) //Exports the User schema to communicate with main app