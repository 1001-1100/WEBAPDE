const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const Post = require("../models/post.js")

const urlencoder = bodyparser.urlencoded({
	extended : true
})

router.use(urlencoder)

router.get("/:id", (req,res) => {
	Post.get(req.params.id).then((post)=>{
		res.render("./pages/post", {
			post
		})
	},(error)=>{

	})
})

router.get("/edit/:id", (req,res) =>{
	Post.get(req.params.id).then((post)=>{
		res.render("./pages/editpost", {
			post
		})
	},(error)=>{

	})
})

router.post("/edit", (req,res) =>{
	Post.edit(req.body.postID, req.body.postTitle, req.body.postContent).then((postID)=>{
		res.redirect("post/"+postID)
	},(error)=>{

	})
})

router.get("/create", (req,res) =>{
	res.render("./pages/newpost")
})

router.post("/create", (req,res) =>{
	var dateNow = new Date()
	var newPost = {
		postTitle: req.body.postTitle,
		postDescription: req.body.postDescription,
		postAuthor: req.session.username,
		postDate: (dateNow.getMonth()+1)+"/"+dateNow.getDate()+"/"+dateNow.getFullYear()+" "+dateNow.toLocaleTimeString(),
		postDateRaw: dateNow,
		postScore: 0,
		commentNumber: 0,
		comment: []
	}
	Post.put(newPost).then((newPost)=>{
		res.redirect("post/"+newPost._id)
	},(error)=>{

	})
})

router.get("/all", (req,res) =>{
	Post.getAll().then((posts)=>{
		res.send(posts)
	},(error)=>{

	})
})

router.get("/all/date", (req,res) =>{
	Post.getSortedDate().then((posts)=>{
		res.send(posts)
	},(error)=>{

	})
})

router.get("/all/score", (req,res) =>{
	Post.getSortedScore().then((posts)=>{
		res.send(posts)
	},(error)=>{

	})
})

router.get("/all/more", (req,res) =>{
	Post.getAllMore(parseInt(req.body.skipNum)).then((posts)=>{
		res.send(posts)
	},(error)=>{

	})
})

router.get("/search/:searchTerm", (req,res) => {
	Post.search(req.params.searchTerm).then((posts)=>{
		res.send(posts)
	},(error)=>{

	})
})

router.get("/user/:userID", (req,res) => {
	Post.search(req.params.userID).then((posts)=>{
		res.send(posts)
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

module.exports = router