const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const Comment = require("../models/comment.js")

const urlencoder = bodyparser.urlencoded({
	extended : true
})

router.use(urlencoder)

router.get("/:id", (req,res) => {
	Comment.get(req.params.id).then((comment)=>{
		res.send(comment)
	},(error)=>{
		res.send(null)
	})	
})

router.post("/create", (req,res) => {
	var dateNow = new Date()
	var newComment = {
		postID: foundPost._id,
		commentContent: req.body.commentContent,
		commentAuthor: req.session.username,
		commentDate: (dateNow.getMonth() + 1) + "/" + dateNow.getDate() + "/" + dateNow.getFullYear() + " " + dateNow.toLocaleTimeString(),
		commentScore: 0,
		nestedComments: []
	}
	Comment.put(newComment).then((newComment)=>{
		res.send(newComment)
	},(error)=>{

	})
})

module.exports = router