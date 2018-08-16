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

exports.put = function (comment) {
	var c = new Comment(comment)
    c.save().then((newComment)=>{
      resolve(newComment)
    }, (err)=>{
      reject(err)
    })
}