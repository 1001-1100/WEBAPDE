const mongoose = require("mongoose")

var commentSchema = mongoose.Schema({
    _postID: mongoose.SchemaTypes.ObjectId,
	commentContent: String,
	commentAuthor: String,
	commentDateString: String,
	commentDate: Date,
	commentScore: Number,
	nestedComments: [mongoose.SchemaTypes.ObjectId]
})

var Comment = mongoose.model("commentList",commentSchema)

exports.get = function (id) {
	return new Promise(function (resolve, reject) {
		Comment.findOne({
			_id: id
		}).then((comment) => {
			resolve(comment)
		}, (err) => {
			reject(err)
		})
	})
}

exports.deleteComment = function(commentID){
	return new Promise(function (resolve, reject) {
		Comment.remove({
			_id: commentID
		}).then((result) => {
			resolve(result)
		}, (err) => {
			reject(err)
		})
	})
}

exports.deleteCommentFromPost = function(postID){
	return new Promise(function (resolve, reject) {
		Comment.remove({
			_postID: postID
		}).then((result) => {
			resolve(result)
		}, (err) => {
			reject(err)
		})
	})
}

exports.updateComment = function(commentID, commentContent){
	return new Promise(function (resolve, reject) {
		Comment.findOneAndUpdate({
			_id: commentID
		},{
			commentContent
		}).then((newComment) => {
		//	resolve(newComment)
		}, (err) => {
			reject(err)
		})
	})
}

exports.put = function (comment) {
	return new Promise(function (resolve, reject) {
		var c = new Comment(comment)
		c.save().then((newComment)=>{
			resolve(newComment)
		}, (err)=>{
			reject(err)
		})
	})
}

exports.putNested = function (comment, commentID) {
	return new Promise(function (resolve, reject) {
		var c = new Comment(comment)
		c.save().then((newComment)=>{
			Comment.findOneAndUpdate({
				_id: commentID
			}, {
				$push: {nestedComments: newComment._id}
			}).then((msg)=>{
				resolve(newComment)
			}, (err)=>{
				reject(err)
			})
		}, (err)=>{
			reject(err)
		})

	})
}