const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const User = require("../models/user.js")
const Post = require("../models/post.js")
const prettyMs = require('pretty-ms');
const timestamp = require('time-stamp');
const app = express()

const urlencoder = bodyparser.urlencoded({
	extended : true
})

router.use(urlencoder)

router.post("/edit", (req,res) =>{
	Post.edit(req.body.postID, req.body.postTitle, req.body.postContent).then((postID)=>{
		res.redirect("post/"+postID)
	},(error)=>{

	})
})

router.get("/edit/:id", (req,res) =>{
	Post.get(req.params.id).then((post)=>{
		res.render("./pages/editpost", {
			uname: req.session.username,
			post
		})
	},(error)=>{

	})
})

router.get("/create", (req,res) =>{
	res.render("./pages/newpost", {
		uname: req.session.username
	})
})

router.post("/create", (req,res) =>{
	var newPost = {
		postTitle: req.body.postTitle,
		postDescription: req.body.postDescription,
		postAuthor: req.session.username,
		postDateString: timestamp('YYYY/MM/DD'),
		postDate: new Date(),
		postScore: 0,
		commentNumber: 0,
		comment: []
	}
	Post.put(newPost).then((newPost)=>{
		User.putPost(newPost).then((newPost)=>{
			res.redirect("/post/"+newPost._id)
		},(error)=>{
			res.redirect("/post/create")
		})
	},(error)=>{
		res.redirect("/post/create")
	})
})

router.get("/all", (req,res) =>{
	Post.getAll().then((posts)=>{
		var postData = []
		for(let i = 0 ; i < posts.length ; i++){
			postData.push({
				_id: posts[i]._id,
				postTitle: posts[i].postTitle,
				postDescription: posts[i].postDescription,
				postAuthor: posts[i].postAuthor,
				postScore: posts[i].postScore,
				commentNumber: posts[i].commentNumber,
				relativeTime: prettyMs(new Date() - posts[i].postDate, {compact: true, verbose: true})
			})
		}
		res.send(postData)
	},(error)=>{

	})
})

router.get("/all/date", (req,res) =>{
	Post.getSortedDate().then((posts)=>{
		var postData = []
		for(let i = 0 ; i < posts.length ; i++){
			postData.push({
				_id: posts[i]._id,
				postTitle: posts[i].postTitle,
				postDescription: posts[i].postDescription,
				postAuthor: posts[i].postAuthor,
				postScore: posts[i].postScore,
				commentNumber: posts[i].commentNumber,
				relativeTime: prettyMs(new Date() - posts[i].postDate, {compact: true, verbose: true})
			})
		}
		res.send(postData)
	},(error)=>{

	})
})

router.get("/all/score", (req,res) =>{
	Post.getSortedScore().then((posts)=>{
		var postData = []
		for(let i = 0 ; i < posts.length ; i++){
			postData.push({
				_id: posts[i]._id,
				postTitle: posts[i].postTitle,
				postDescription: posts[i].postDescription,
				postAuthor: posts[i].postAuthor,
				postScore: posts[i].postScore,
				commentNumber: posts[i].commentNumber,
				relativeTime: prettyMs(new Date() - posts[i].postDate, {compact: true, verbose: true})
			})
		}
		res.send(postData)
	},(error)=>{

	})
})

router.post("/all/more", (req,res) =>{
	Post.getAllMore(parseInt(req.body.skipNum)).then((posts)=>{
		var postData = []
		for(let i = 0 ; i < posts.length ; i++){
			postData.push({
				_id: posts[i]._id,
				postTitle: posts[i].postTitle,
				postDescription: posts[i].postDescription,
				postAuthor: posts[i].postAuthor,
				postScore: posts[i].postScore,
				commentNumber: posts[i].commentNumber,
				relativeTime: prettyMs(new Date() - posts[i].postDate, {compact: true, verbose: true})
			})
		}
		res.send(postData)
	},(error)=>{

	})
})

router.get("/all/date/more", (req,res) =>{
	Post.getSortedDateMore(parseInt(req.body.skipNum)).then((posts)=>{
		var postData = []
		for(let i = 0 ; i < posts.length ; i++){
			postData.push({
				_id: posts[i]._id,
				postTitle: posts[i].postTitle,
				postDescription: posts[i].postDescription,
				postAuthor: posts[i].postAuthor,
				postScore: posts[i].postScore,
				commentNumber: posts[i].commentNumber,
				relativeTime: prettyMs(new Date() - posts[i].postDate, {compact: true, verbose: true})
			})
		}
		res.send(postData)
	},(error)=>{

	})
})

router.get("/all/score/more", (req,res) =>{
	Post.getSortedScoreMore(parseInt(req.body.skipNum)).then((posts)=>{
		var postData = []
		for(let i = 0 ; i < posts.length ; i++){
			postData.push({
				_id: posts[i]._id,
				postTitle: posts[i].postTitle,
				postDescription: posts[i].postDescription,
				postAuthor: posts[i].postAuthor,
				postScore: posts[i].postScore,
				commentNumber: posts[i].commentNumber,
				relativeTime: prettyMs(new Date() - posts[i].postDate, {compact: true, verbose: true})
			})
		}
		res.send(postData)
	},(error)=>{

	})
})

router.get("/search/:searchTerm", (req,res) => {
	Post.search(req.params.searchTerm).then((posts)=>{
		var postData = []
		for(let i = 0 ; i < posts.length ; i++){
			postData.push({
				_id: posts[i]._id,
				postTitle: posts[i].postTitle,
				postDescription: posts[i].postDescription,
				postAuthor: posts[i].postAuthor,
				postScore: posts[i].postScore,
				commentNumber: posts[i].commentNumber,
				relativeTime: prettyMs(new Date() - posts[i].postDate, {compact: true, verbose: true})
			})
		}
		res.send(postData)
	},(error)=>{

	})
})

router.post("/comments", (req,res) => {
	Post.get(req.body.id).then((post)=>{
		res.send(post.comment)
	},(error)=>{

	})
})

router.get("/delete/:id", (req,res) => {
	Post.delete(req.params.id).then((result)=>{
		res.send(result)
	},(error)=>{
		res.send(null)
	})
})

router.get("/:id", (req,res) => {
	Post.get(req.params.id).then((post)=>{
		res.render("./pages/post", {
			uname: req.session.username,
			postID: post._id,
			postTitle: post.postTitle,
			postDescription: post.postDescription,
			postAuthor: post.postAuthor,
			postScore: post.postScore,
			postDate: prettyMs(new Date() - post.postDate, {compact: true, verbose: true}),
			commentNumber: post.commentNumber
		})
	},(error)=>{

	})
})

module.exports = router