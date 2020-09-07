const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
	business: String,
	location: String,
	userName: String,
	email: String,
	title: String, 
	body: String
})

const PostModel = mongoose.model('post', postSchema)

module.exports = PostModel