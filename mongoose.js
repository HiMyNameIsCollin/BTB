const mongoose = require('mongoose')

const Schema = mongoose.Schema

const BusinessSchema = new Schema ({
	business: String,
	location: String,
	posts: Array
})

const CommentSchema = new Schema ({
	userName: String,
	body: String,
	date: String
})

const EmailSchema = new Schema({
	userName: String,
	phone: String,
	email: String,
	userAddress: String
})

const PostSchema = new Schema({
	business: String,
	location: String,
	userName: String,
	email: String,
	title: String, 
	body: String,
	date: String,
	imageRefs: Array,
	comments: Array,
	approved: Boolean,
})

const AdminSchema = new Schema({
	adminName: String,
	password: String
})



module.exports = {
	AdminSchema,
	BusinessSchema,
	CommentSchema,
	EmailSchema,
	PostSchema,
	mongoose
}