const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const User = require("../models/user.js")

const urlencoder = bodyparser.urlencoded({
	extended : true
})

router.use(urlencoder)

const bcrypt = require("bcrypt")
const fs = require('fs')
const multer = require('multer')
const upload = multer({
	dest: './public/avatars'
})

router.get("/:id", (req,res) => {
	User.get(req.params.id).then((user)=>{
		res.render("./pages/user-profile", {
			user
		})
	},(error)=>{

	})
})

router.post("/login", (req,res) => {
	User.authenticate(req.body.uname).then((user)=>{
		if(user){
			bcrypt.compare(req.body.pword, user.password).then((msg) => {
				if (msg) {
					if (req.body.rememberMe) {
						req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 3)
						req.session.maxAge = 1000 * 60 * 60 * 24 * 7 * 3
					}
					req.session.rememberMe = req.body.rememberMe
					req.session.username = req.body.uname
					res.send(user);
				} else {
					res.send(null);
				}
			})
		} else {
			res.send(null);
		}
	},(error)=>{
		res.send(null)
	})
})

router.post("/checkregister", (req,res) => {
	User.validate(req.body.uname,req.body.email).then((resp)=>{
		if (resp == 1){ // only username matched in db
			console.log("in checkregisteraccount - if")
			res.send("1")
		} else if (resp == 2) { // only email matched in db
			console.log("in checkregisteraccount - if")
			res.send("2")
		} else {
			res.send("3")
		}
	},(error)=>{
		res.send(null)
	})
})

router.post("/register", upload.single('avatar'), (req,res) => {
	bcrypt.hash(req.body.password, 12).then((hashed) => {
		var hashedPassword = hashed
		var newUser = {
			emailAddress: req.body.emailAddress,
			username: req.body.username,
			password: hashedPassword,
			shortBio: req.body.shortBio,
			avatar: req.file.filename
		}
		User.put(newUser).then((msg)=>{
			res.redirect("/")
		},(error)=>{

		})
	})
})

module.exports = router

// module.exports.upPost = function upPost(req, res) {
// 	var postid = req.body.id

// 	var findUser = User.findOne({
// 		username: req.body.username
// 	})

// 	findUser.then((foundUser) => {
// 		if (foundUser) {
// 			foundUser.upvotedPost.push(postid)
// 			foundPost.save().then((msg) => {
// 				res.send(foundUser)
// 			})
// 		}
// 	})
// }

// module.exports.downPost = function downPost(req, res) {
// 	var postid = req.body.id

// 	var findUser = User.findOne({
// 		username: req.body.username
// 	})

// 	findUser.then((foundUser) => {
// 		if (foundUser) {
// 			foundUser.downvotedPost.push(postid)
// 			foundPost.save().then((msg) => {
// 				res.send(foundUser)
// 			})
// 		}
// 	})
// }

// module.exports.upComment = function upComment(req, res) {
// 	var commentid = req.body.id

// 	var findUser = User.findOne({
// 		username: req.body.username
// 	})

// 	findUser.then((foundUser) => {
// 		if (foundUser) {
// 			foundUser.upvotedComment.push(commentid)
// 			foundPost.save().then((msg) => {
// 				res.send(foundUser)
// 			})
// 		}
// 	})
// }

// module.exports.downComment = function downComment(req, res) {
// 	var commentid = req.body.id

// 	var findUser = User.findOne({
// 		username: req.body.username
// 	})

// 	findUser.then((foundUser) => {
// 		if (foundUser) {
// 			foundUser.downvotedComment.push(commentid)
// 			foundPost.save().then((msg) => {
// 				res.send(foundUser)
// 			})
// 		}
// 	})
// }