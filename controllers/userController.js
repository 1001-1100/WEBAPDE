const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const User = require("../models/user.js")
const app = express()

const urlencoder = bodyparser.urlencoded({
	extended : true
})

router.use(urlencoder)

const bcrypt = require("bcrypt")
const path = require("path")
const fs = require('fs')
const multer = require('multer')
const upload_path = path.join("./", "/public/uploads")
const upload = multer({
	dest: upload_path,
	limits: {
		fileSize : 10000000,
		files : 2
	}
})

router.get("/", (req,res) => {
	res.redirect("/user/"+req.session.username)
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
			res.send("1")
		} else if (resp == 2) { // only email matched in db
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
		var filename = "default"
		if(req.file){
			filename = req.file.filename
		}
		var newUser = {
			emailAddress: req.body.emailAddress,
			username: req.body.username,
			password: hashedPassword,
			shortBio: req.body.shortBio,
			avatar: filename
		}
		User.put(newUser).then((user)=>{
			if (req.body.rememberMe) {
				req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 3)
				req.session.maxAge = 1000 * 60 * 60 * 24 * 7 * 3
			}
			req.session.rememberMe = req.body.rememberMe
			req.session.username = req.body.username
			res.redirect("/")
		},(error)=>{

		})
	})
})

router.post("/posts", (req,res) => {
	User.get(req.body.username).then((user)=>{
		res.send(user.post)
	},(error)=>{

	})
})



router.post("/comments", (req,res) => {
	User.get(req.body.username).then((user)=>{
		res.send(user)
	},(error)=>{

	})
})

router.get("/avatar/:filename", (req,res) => {
	fs.createReadStream(path.join(upload_path, req.params.filename)).pipe(res)
})

router.get("/:username", (req,res) => {

	console.log("imhere")

	User.get(req.params.username).then((user)=>{
		res.render("./pages/user-profile", {
			uname: req.session.username,
			avatar: user.avatar,
			username: user.username,
			shortBio: user.shortBio
		})
	},(error)=>{

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