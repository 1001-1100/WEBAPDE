const mongoose = require("mongoose")

var userSchema = mongoose.Schema({
	emailAddress : String,
	username : String,
	password : String,
	shortBio : String,
	avatar: String,
	post: [{
		postTitle: {
			type: String,
			required: true,
			minlength: 6,
			trim: true
		},
		postDescription: String,
		postAuthor: String,
		postDate: String,
		postDateRaw: Date,
		postScore: Number,
		commentNumber: Number,
		comment: [{
			postID: String,
			commentContent: String,
			commentAuthor: String,
			commentDate: String,
			commentScore: Number,
			nestedComments: [{
				commentID: String
			}]
		}]
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