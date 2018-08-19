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
				_commentID: mongoose.SchemaTypes.ObjectId
			}]
		}]
	}],
	comment: [{
		_commentID: mongoose.SchemaTypes.ObjectId,
		commentContent: String,
		commentAuthor: String,
		commentDate: String,
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

exports.put = function (user) {
	return new Promise(function (resolve, reject) {
		var u = new User(user)
		u.save().then((newUser)=>{
		  resolve(newUser)
		}, (err)=>{
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

exports.validate = function (username, emailAddress) {
	return new Promise(function (resolve, reject) {
		User.findOne({
			username
		}).then((user) => {
			if(user){
				resolve(1)
			}
		}, (err) => {
			reject(err)
		})
		User.findOne({
			emailAddress
		}).then((user) => {
			if(user){
				resolve(2)
			}
		}, (err) => {
			reject(err)
		})
		resolve(3)
	})
}
