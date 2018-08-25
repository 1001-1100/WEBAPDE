const mongoose = require("mongoose")

var userSchema = mongoose.Schema({
	emailAddress: String,
	username: String,
	password: String,
	shortBio: String,
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
				_commentID: mongoose.SchemaTypes.ObjectId
			}]
		}]
	}],
	comment: [{
		_postID: mongoose.SchemaTypes.ObjectId,
		commentContent: String,
		commentAuthor: String,
		commentDateString: String,
		commentDate: Date,
		commentScore: Number
	}],
})

var User = mongoose.model("userList", userSchema)

exports.get = function (username) {
	return new Promise(function (resolve, reject) {
		User.findOne({
			username
		}).then((user) => {
			resolve(user)
		}, (err) => {
			reject(err)
		})
	})
}

exports.deletePost = function(username, id){
	return new Promise(function(resolve, reject){
		User.findOne({
			username
		}).then((user)=>{

			for(let i = 0; i < user.post.length; i++ ){
				if(user.post[i]._id == id){
					user.post.splice(i, 1)
				}
			}

			user.save().then((newUser)=>{
				resolve(newUser)
			}, (err)=>{
				reject(err)
			})
			
		})
	})
}

exports.deleteComment = function(username, postID, commentID){
	console.log("deleteComment postID is " + postID)
	console.log("deleteComment commentID is " + commentID)
	console.log("deleteComment username is " + username)
	return new Promise(function(resolve, reject){
		User.findOne({
			username
		}).then((user)=>{

			if(user){
			// deletes in comment array in the post array of user
			for(let i = 0; i < user.post.length; i++ ){
				if(user.post[i]._id == postID){
					if(user.post[i].comment.length >0){
						for(let j = 0; j<user.post[i].comment.length; j++){
							if(user.post[i].comment[j]._id == commentID){
								user.post[i].comment.splice(j, 1)
							}
						}
					}
				}
			}

			// deletes in comment array of user
			for(let i = 0; i < user.comment.length; i++){
				if(user.comment[i]._id == commentID){
					user.comment.splice(i, 1);
				}
			}

			user.save().then((newUser)=>{
				resolve(newUser)
			}, (err)=>{
				reject(err)
			})
		}else{console.log("user is NULL")}
		})
	})
}

exports.updateComment = function(username, postID, commentID, commentContent){

	return new Promise(function(resolve, reject){
		User.findOne({
			username
		}).then((user)=>{

			if(user){
			// updates in comment array in the post array of user
			for(let i = 0; i < user.post.length; i++ ){
				if(user.post[i]._id == postID){
					if(user.post[i].comment.length >0){
						for(let j = 0; j<user.post[i].comment.length; j++){
							if(user.post[i].comment[j]._id == commentID){
								user.post[i].comment[j].commentContent = commentContent
							}
						}
					}
				}
			}

			// updates in comment array of user
			for(let i = 0; i < user.comment.length; i++){
				if(user.comment[i]._id == commentID){
					user.comment[i].commentContent = commentContent
				}
			}

			user.save().then((newUser)=>{
				resolve(newUser)
			}, (err)=>{
				reject(err)
			})
		}else{console.log("user is NULL")}
		})
	})
}

exports.put = function (user) {
	return new Promise(function (resolve, reject) {
		var u = new User(user)
		u.save().then((newUser) => {
			resolve(newUser)
		}, (err) => {
			reject(err)
		})
	})
}

exports.putPost = function (post) {
	return new Promise(function (resolve, reject) {
		User.findOneAndUpdate({
			username: post.postAuthor
		}, {
			$push: {
				post: post
			}
		}).then((msg) => {
			resolve(post)
		}, (err) => {
			reject(err)
		})
	})
}

exports.putComment = function (comment, postID) {
	return new Promise(function (resolve, reject) {
		User.findOne({
			username: comment.commentAuthor
		}, {
			$push: {
				comment: comment
			}
		}).then((msg) => {
			resolve(comment)
		}, (err) => {
			reject(err)
		})
	})
}

exports.authenticate = function (username) {
	return new Promise(function (resolve, reject) {
		User.findOne({
			username
		}).then((user) => {
			resolve(user)
		}, (err) => {
			reject(err)
		})
	})
}

exports.edit = function (username, id, postTitle, postDescription) {
	console.log(username);
	return new Promise(function (resolve, reject) {
		User.findOne({
			username: username
		}).then((foundUser) => {
			if(foundUser){
				for(let i = 0; i < foundUser.post.length; i++ ){
					if(foundUser.post[i]._id == id){
						foundUser.post[i].postTitle = postTitle
						foundUser.post[i].postDescription = postDescription
					}
				}
			
				foundUser.save().then((newUser)=>{
					resolve(newUser)
				}, (err)=>{
					reject(err)
				})
			}else{console.log("foundUser is empty")}
		})
	})
}

exports.validate = function (username, emailAddress) {
	return new Promise(function (resolve, reject) {
		User.findOne({
			username
		}).then((user) => {
			if (user) {
				resolve(1)
			}
		}, (err) => {
			reject(err)
		})
		User.findOne({
			emailAddress
		}).then((user) => {
			if (user) {
				resolve(2)
			}
		}, (err) => {
			reject(err)
		})
		resolve(3)
	})
}