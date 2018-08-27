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
			nestedComments: [mongoose.SchemaTypes.ObjectId]
		}]
	}],
	comment: [{
		_postID: mongoose.SchemaTypes.ObjectId,
		commentContent: String,
		commentAuthor: String,
		commentDateString: String,
		commentDate: Date,
		commentScore: Number,
		nestedComments: [mongoose.SchemaTypes.ObjectId]
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
				if(user.post[i]._id.equals(id)){
					user.post.splice(i, 1)
				}
			}
			user.save().then((result)=>{
				resolve(user)
			}, (err)=>{
				reject(err)
			})	
		}, (err)=>{
			reject(err)
		})
	})
}

exports.deleteCommentsFromPost = function(postID){
	return new Promise(function(resolve, reject){
		User.countDocuments().then((maxUser)=>{
			for(let i = 0 ; i < maxUser ; i++){
				User.findOne().skip(i).then((user)=>{
					let i = 0
					while(i < user.comment.length){
						console.log(user.username + ": " + user.comment[i]._postID + " == " + postID)
						if(user.comment[i]._postID.equals(postID)){
							user.comment.splice(i, 1);
						}else{
							i++;
						}
					}
					user.save().then((result)=>{
						resolve(result)
					}, (err)=>{
						reject(err)
					})
				})
			}
		})
	})
}

exports.deleteComments = function(post, deletedComments){
	console.log(deletedComments)
	return new Promise(function(resolve, reject){
		User.countDocuments().then((maxUser)=>{
			for(let i = 0 ; i < maxUser ; i++){
				User.findOne().skip(i).then((user)=>{
					for(let j = 0 ; j < deletedComments.length ; j++){
						let i = 0
						while(i < user.comment.length){
							if(user.comment[i]._id.equals(deletedComments[j])){
								user.comment.splice(i, 1);
							}else{
								i++;
							}
						}
						for(let i = 0 ; i < user.post.length ; i++){
							if(user.post[i]._id.equals(post._id)){
								user.post[i].commentNumber = post.commentNumber
							}
						}
						user.save().then((result)=>{
							resolve(result)
						}, (err)=>{
							reject(err)
						})
					}
				})
			}
		})
	})
}

exports.deleteComment = function(username, commentID){
	return new Promise(function(resolve, reject){
		User.findOne({
			username
		}).then((user)=>{
			// deletes in comment array of user
			for(let i = 0; i < user.comment.length; i++){
				if(user.comment[i]._id.equals(commentID)){
					user.comment.splice(i, 1);
				}
			}
			user.save().then((result)=>{
				console.log(commentID + " deleted")
				resolve(result)
			}, (err)=>{
				reject(err)
			})
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

exports.putComment = function (comment, post) {
	return new Promise(function (resolve, reject) {
		User.findOneAndUpdate({
			username: comment.commentAuthor
		}, {
			$push: {comment: comment}
		}).then((msg) => {
			User.findOne({
				username: post.postAuthor
			}).then((user) => {
				for(let i = 0 ; i < user.post.length ; i++){
					if(user.post[i]._id.equals(post._id)){
						user.post[i].commentNumber = post.commentNumber
					}
				}
				user.save().then((msg)=>{})
				resolve(comment)
			})
		}, (err) => {
			reject(err)
		})
	})
}

exports.putNestedComment = function (comment, post, commentID) {
	return new Promise(function (resolve, reject) {
		User.findOneAndUpdate({
			username: comment.commentAuthor
		}, {
			$push: {comment: comment}
		}).then((msg) => {
			// User.findOne({
			// 	username: post.postAuthor
			// }).then((user) => {
			// 	for(let i = 0 ; i < user.post.length ; i++){
			// 		if(user.post[i]._id.equals(post._id)){
			// 			for(let j = 0 ; j < user.post[i].comment.length ; j++){
			// 				if(user.post[i].comment[j]._id.equals(commentID)){
			// 					user.post[i].comment[j].nestedComments.push(comment._id)
			// 				}
			// 			}
			// 		}
			// 	}
			// 	user.save().then((msg)=>{})
			// })
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