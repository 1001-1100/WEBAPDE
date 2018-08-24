const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const Comment = require("../models/comment.js")
const Post = require("../models/post.js")
const User = require("../models/user.js")
const prettyMs = require('pretty-ms');
const timestamp = require('time-stamp');
const app = express()

const urlencoder = bodyparser.urlencoded({
	extended : true
})

router.use(urlencoder)

router.post("/create", (req,res) => {
	var dateNow = new Date()
	var newComment = {
		_postID: req.body.postID,
		commentContent: req.body.commentContent,
		commentAuthor: req.session.username,
		commentDateString: timestamp('YYYY/MM/DD'),
		commentDate: new Date(),
		commentScore: 0,
		nestedComments: []
	}
	Comment.put(newComment).then((newComment)=>{
		Post.putComment(newComment).then((newComment)=>{
			User.putComment(newComment, req.body.postID).then((newComment)=>{
				res.send(newComment)
			})
		})
	},(error)=>{

	})
})

router.get("/:id", (req,res) => {
	Comment.get(req.params.id).then((comment)=>{
		res.send(comment)
	},(error)=>{
		res.send(null)
	})	
})

module.exports = router