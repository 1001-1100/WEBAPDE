const mongoose = require("mongoose")

var userSchema = mongoose.Schema({
	emailAddress : String,
	username : String,
	password : String,
	shortBio : String,
	avatar: String,
	post: [{
		postID: String,
		postTitle: String,
		postDescription: String,
		postAuthor: String,
		postDate: String,
		postScore: Number,
		commentNumber: Number
	}],
	comment: [{
		commentID: String,
		commentContent: String,
		commentAuthor: String,
		commentDate: String,
		commentScore: Number
	}]
})

var User = mongoose.model("userList",userSchema)

module.exports = {
    User
}