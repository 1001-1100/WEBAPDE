const Post = require("./models/post.js").Post
const Comment = require("./models/comment.js").Comment
const User = require("./models/user.js").User

module.exports.returnComment = function returnComment(req, res){
	var findComment = Comment.find({
		_id: req.body.commentID
	})
	findComment.then((foundComment) => {
		res.send(foundComment)
	})
}

module.exports.returnNewComment = function returnNewComment(req, res){
	var dateNow = new Date()
	var findPost = Post.findOne({
		_id: req.body.postID
	})
	findPost.then((foundPost) => {
		var newComment = new Comment({
			postID: foundPost._id,
			commentContent: req.body.commentContent,
			commentAuthor: req.session.username,
			commentDate: (dateNow.getMonth() + 1) + "/" + dateNow.getDate() + "/" + dateNow.getFullYear() + " " + dateNow.toLocaleTimeString(),
			commentScore: 0,
			nestedComments: []
		})
		foundPost.comment.push(newComment)
		foundPost.commentNumber += 1
		foundPost.save().then((msg) => {
			res.send(newComment)
		})
	})
}
