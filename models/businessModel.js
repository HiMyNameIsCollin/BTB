const mongoose = require('mongoose')

const Schema = mongoose.Schema

const businessSchema = new Schema ({
	business: String,
	location: String,
	posts: Array
})

const BusinessModel = mongoose.model('business', businessSchema)



module.exports = BusinessModel