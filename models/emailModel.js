const mongoose = require('mongoose')

const Schema = mongoose.Schema


const emailSchema = new Schema({
	userName: String,
	phone: String,
	email: String,
	userAddress: String
})


const EmailModel = mongoose.model('email', emailSchema)


module.exports = EmailModel