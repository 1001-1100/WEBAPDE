const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const User = require("../models/user.js")
const Post = require("../models/post.js")
const Comment = require("../models/comment.js")
const prettyMs = require('pretty-ms')
const timestamp = require('time-stamp')
const marked = require('marked')
marked.setOptions({sanitize: true})
const app = express()

const urlencoder = bodyparser.urlencoded({
	extended: true
})

router.use(urlencoder)

router.post("/edit", (req, res) => {
	Post.edit(req.body.postID, req.body.postTitle, req.body.postContent).then((postID) => {
		res.redirect("/post/" + postID)
	}, (error) => {

	})
	User.edit(req.session.username ,req.body.postID, req.body.postTitle, req.body.postContent).then((postID)=>{
		res.send("/post/"+req.session.username)
		//window.location.href("post/"+req.session.username)
	},(error)=>{
		console.log(error);
	})
})

router.get("/edit/:id", (req, res) => {
	Post.get(req.params.id).then((post) => {
		res.render("./pages/editpost", {
			uname: req.session.username,
			postID: post._id,
			postTitle: post.postTitle,
			postContent: post.postDescription
		})
    
	}, (error) => {

	})
})


router.get("/search", (req, res) => {
	console.log("/search")

	Post.search(req.query.searchTerm).then((PostsWithKeywords) => {
		
	//	res.send(PostsWithKeywords)
		console.log("Found posts with keywords are: " + PostsWithKeywords)
		res.render("./pages/index", {
			PostsWithKeywords
		})
	}, (error)=>{
		console.log(error)
	})
})

router.get("/create", (req,res) =>{
	res.render("./pages/newpost", {
		uname: req.session.username
	})
})

router.post("/create", (req, res) => {
	var newPost = {
		postTitle: marked(req.body.postTitle),
		postDescription: marked(req.body.postDescription),
		postAuthor: marked(req.session.username),
		postDateString: timestamp('YYYY/MM/DD'),
		postDate: new Date(),
		postScore: 0,
		commentNumber: 0,
		comment: []
	}

	console.log("NEW POST: " + newPost)

	Post.put(newPost).then((newPost) => {
		User.putPost(newPost).then((newPost) => {
			res.redirect("/post/" + newPost._id)
		}, (error) => {
			res.redirect("/post/create")
		})
	}, (error) => {
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

router.post("/comments", (req, res) => {
	Post.get(req.body.id).then((post) => {
		var commentData = []
		for(let i = 0 ; i < post.comment.length ; i++){
			commentData.push({
				_id: post.comment[i]._id,
				_postID: post.comment[i]._postID,
				commentContent: post.comment[i].commentContent,
				commentAuthor: post.comment[i].commentAuthor,
				commentScore: post.comment[i].commentScore,
				nestedComments: post.comment[i].nestedComments,
				relativeTime: prettyMs(new Date() - post.comment[i].commentDate, {compact: true, verbose: true})
			})
		}
		res.send(commentData)
	}, (error) => {

	})
})

router.get("/delete/:id", (req, res) => {
	Post.delete(req.params.id).then((result) => {
		res.send(result)
	}, (error) => {
		res.send(null)
	})
})
  
router.post("/deletepost", (req, res) =>{

	// Deletes post in the Post collection Db given the postID
	Post.deletePost(req.body.id).then((result)=>{ 
		//
	},(error)=>{
		res.send(null)
	})

	Comment.deleteCommentFromPost(req.body.id).then((result)=>{
		//
	},(error)=>{
		res.send(null)
	})

	// Deletes post in the User collection db by searchin for the user then deleting the post in his post array
	User.deletePost(req.body.username, req.body.id).then((result)=>{ 
		res.send(result) // only sends this one back since the ajax call updates the user profile only with his posts
	},(error)=>{
		res.send(null)
	})

})

router.post("/deletecomment", (req, res) =>{

	// Deletes comment in the Post collection Db given the postID
	Post.deleteComment(req.body.postID, req.body.commentID).then((result)=>{ 
	//	res.send(result)
	},(error)=>{
		res.send(null)
	})
	
	 Comment.deleteComment(req.body.commentID).then((result)=>{ 
		//	res.send(result) 
	 },(error)=>{
		res.send(null)
	 })

	// Deletes comment in the User collection db by searching for the user then deleting the post in his post array
	 User.deleteComment(req.body.username, req.body.postID, req.body.commentID).then((user)=>{ 
		 var commentData = []
		 for(let i = 0 ; i < user.comment.length ; i++){
			commentData.push({
				_postID: user.comment[i]._postID,
				commentContent: user.comment[i].commentContent,
				commentAuthor: user.comment[i].commentAuthor,
				commentDateString: user.comment[i].commentDateString,
				commentDate: user.comment[i].commentDate,
				commentScore: user.comment[i].commentScore,
				nestedComments: user.comment[i].nestedComments,
				relativeTime: prettyMs(new Date() - user.comment[i].commentDate, {compact: true, verbose: true})
			})
		 }
	 },(error)=>{
		res.send(commentData)
	 })
})

router.post("/updateComment", (req, res) =>{

	
	// Deletes comment in the Post collection Db given the postID
	Post.updateComment(req.body.postID, req.body.commentID, req.body.commentContent).then((result)=>{ 
	//	res.send(result)
	},(error)=>{
		res.send(null)
	})
	
	 Comment.updateComment(req.body.commentID, req.body.commentContent).then((result)=>{ 
		//	res.send(result) 
	 },(error)=>{
		res.send(null)
	 })

	// Deletes comment in the User collection db by searching for the user then deleting the post in his post array
	 User.updateComment(req.body.username, req.body.postID, req.body.commentID, req.body.commentContent).then((result)=>{ 
	 	res.send(result) // only sends this one back since the ajax call updates the user profile only with his posts
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
	}, (error) => {

	})
})

module.exports = router