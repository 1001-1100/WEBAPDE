const mongoose = require("mongoose")

var postSchema = mongoose.Schema({
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
})

var Post = mongoose.model("postList", postSchema)

module.exports = {
    Post
}