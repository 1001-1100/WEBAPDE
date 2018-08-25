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
			Post.get(newComment._postID).then((post)=>{
				User.putComment(newComment, post).then((newComment)=>{
					newComment = {
						_postID: newComment._postID,
						commentContent: newComment.commentContent,
						commentAuthor: newComment.commentAuthor,
						commentDateString: newComment.commentDateString,
						commentDate: newComment.commentDate,
						commentScore: newComment.commentScore,
						nestedComments: newComment.nestedComments,
						relativeTime: prettyMs(new Date() - newComment.commentDate, {compact: true, verbose: true})
					}
					res.send(newComment)
				})
			})
		})
	},(error)=>{

	})
})

router.post("/nested", (req,res) => {
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
	Comment.putNested(newComment, req.body.commentID).then((newComment)=>{
		Post.putNestedComment(newComment, req.body.commentID).then((newComment)=>{
			Post.get(newComment._postID).then((post)=>{
				User.putNestedComment(newComment, post, req.body.commentID).then((newComment)=>{
					newComment = {
						_postID: newComment._postID,
						commentContent: newComment.commentContent,
						commentAuthor: newComment.commentAuthor,
						commentDateString: newComment.commentDateString,
						commentDate: newComment.commentDate,
						commentScore: newComment.commentScore,
						nestedComments: newComment.nestedComments,
						relativeTime: prettyMs(new Date() - newComment.commentDate, {compact: true, verbose: true})
					}
					res.send(newComment)
				})
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