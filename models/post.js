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
		_postID: mongoose.SchemaTypes.ObjectId,
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

exports.get = function (id) {
	return new Promise(function (resolve, reject) {
		Post.findOne({
			_id: id
		}).then((post) => {
			resolve(post)
		}, (err) => {
			reject(err)
		})
	})
}

exports.getAll = function () {
	return new Promise(function (resolve, reject) {
		Post.find().limit(5).then((posts) => {
			resolve(posts)
		}, (err) => {
			reject(err)
		})
	})
}

exports.getAllMore = function (skipNum) {
	return new Promise(function (resolve, reject) {
		Post.find().skip(skipNum).limit(5).then((posts) => {
			resolve(posts)
		}, (err) => {
			reject(err)
		})
	})
}

exports.getSortedScore = function () {
	return new Promise(function (resolve, reject) {
		Post.find().sort({postScore : -1}).limit(5).then((posts) => {
			resolve(posts)
		}, (err) => {
			reject(err)
		})
	})
}

exports.getSortedScoreMore = function (skipNum) {
	return new Promise(function (resolve, reject) {
		Post.find().sort({postScore : -1}).skip(skipNum).limit(5).then((posts) => {
			resolve(posts)
		}, (err) => {
			reject(err)
		})
	})
}

exports.getSortedDate = function () {
	return new Promise(function (resolve, reject) {
		Post.find().sort({postDateRaw : -1}).limit(5).then((posts) => {
			resolve(posts)
		}, (err) => {
			reject(err)
		})
	})
}

exports.getSortedDateMore = function (skipNum) {
	return new Promise(function (resolve, reject) {
		Post.find().sort({postDateRaw : -1}).skip(skipNum).limit(5).then((posts) => {
			resolve(posts)
		}, (err) => {
			reject(err)
		})
	})
}

exports.put = function (post) {
	return new Promise(function (resolve, reject) {
		var p = new Post(post)
		p.save().then((newPost)=>{
		  resolve(newPost)
		}, (err)=>{
		  reject(err)
		})
	})
}

exports.putComment = function (comment) {
	return new Promise(function (resolve, reject) {
		Post.findOne({
			_id: comment._postID
		}).then((post) => {
			post.comment.push(comment)
			post.commentNumber += 1
			post.save().then((msg) => {
				resolve(comment)
			})
		}, (err) => {
			reject(err)
		})
	})
}

exports.edit = function (id, postTitle, postDescription) {
	return new Promise(function (resolve, reject) {
		Post.findOneAndUpdate({
			_id: id
		}, update, {
			postTitle, postDescription
		}).then((newPost) => {
			resolve(id)
		}, (err) => {
			reject(err)
		})
	})
}

exports.delete = function (id) {
	return new Promise(function (resolve, reject) {
		Post.remove({
			_id: id
		}).then((result) => {
			resolve(result)
		}, (err) => {
			reject(err)
		})
	})
}