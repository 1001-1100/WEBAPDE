const mongoose = require("mongoose")

var commentSchema = mongoose.Schema({
    postID: String,
	commentContent: String,
	commentAuthor: String,
	commentDate: String,
	commentScore: Number,
	nestedComments: [{
		commentID: String
	}]
})

var Comment = mongoose.model("commentList",commentSchema)

module.exports = {
    Comment
}