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
	postDateString: String,
	postDate: Date,
	postScore: Number,
	commentNumber: Number,
	comment: [{
		_postID: mongoose.SchemaTypes.ObjectId,
		commentContent: String,
		commentAuthor: String,
		commentDateString: String,
		commentDate: Date,
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
		Post.find().sort({postDate : -1}).limit(5).then((posts) => {
			resolve(posts)
		}, (err) => {
			reject(err)
		})
	})
}

exports.getSortedDateMore = function (skipNum) {
	return new Promise(function (resolve, reject) {
		Post.find().sort({postDate : -1}).skip(skipNum).limit(5).then((posts) => {
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
		Post.findOneAndUpdate({
			_id: comment._postID
		}, {
			$push: {comment: comment},
			$inc: {commentNumber: 1}
		}).then((msg) => {
			resolve(comment)
		}, (err) => {
			reject(err)
		})
	})
}

exports.edit = function (id, postTitle, postDescription) {
	return new Promise(function (resolve, reject) {
		Post.findOneAndUpdate({
			_id: id
		},{
			postTitle, postDescription
		}).then((newPost) => {
			resolve(newPost)
		}, (err) => {
			reject(err)
		})
	})
}

exports.deletePost = function (id) {
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

exports.deleteComment = function (postID, commentID) {

	console.log("post deletecomment postID is " + postID)
	console.log("post deletecomment commentID is " + commentID)
	
	return new Promise(function (resolve, reject) {

		Post.findOne({
			_id: postID
		}).then((post) => {
			if(post){
				for(let i =0; i<post.comment.length; i++){
					if(post.comment[i]._id === commentID){
						post.comment.splice(i, 1)
					}
				}

				post.save().then((newPost)=>{
					resolve(newPost)
				}, (err)=>{
					reject(err)
				})
			} else{console.log("post IS NULL")}

		}, (err) => {
			reject(err)
		})
	})
}


exports.search = function (searchTerm){

	var findPost = Post.find({postDescription: {$regex:searchTerm ,$options:"$i"}})
	var findPost2 = Post.find({postTitle: {$regex:searchTerm ,$options:"$i"}})
	let check = 0;
	console.log("im in /searchkeyword " + searchTerm);
	findPost.then((foundPosts)=>{
		findPost2.then((foundPosts2)=>{
			if(foundPosts || foundPosts2){
				console.log(foundPosts)
				console.log("foundPosts not nullll");
				res.send(foundPosts.concat(foundPosts2));
				
			}else{
				console.log("foundPosts nullll");
				res.send(null);
			}
		})
	})
}

exports.updateComment = function (postID, commentID, commentContent) {
	return new Promise(function (resolve, reject) {
		Post.findOne({
			_id: postID
		
		}).then((post) => {
			if(post){
				for(let i =0; i<post.comment.length; i++){
					if(post.comment[i]._id === commentID){
						post.comment[i].commentContent = commentContent
					}
				}

				post.save().then((newPost)=>{
					resolve(newPost)
				}, (err)=>{
					reject(err)
				})
			} else{console.log("post IS NULL")}

		}, (err) => {
			reject(err)
		})
	})
}