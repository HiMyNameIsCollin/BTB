const mongoose = require('mongoose')

const Schema = mongoose.Schema

const commentSchema = new Schema ({
	userName: String,
	body: String
})

const CommentModel = mongoose.model('comment', commentSchema)



module.exports = CommentModel