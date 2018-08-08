const express = require('express')
const cool = require('cool-ascii-faces')
const path = require('path')
const bodyparser = require("body-parser")
const request = require('request')
const hbs = require("hbs")
const session = require("express-session")
const cookieparser = require("cookie-parser")
const PORT = process.env.PORT || 5000
const bcrypt = require("bcrypt")
const fs = require('fs')
const multer = require('multer')
const mongoose = require("mongoose") 

/** CONTROLLER IMPORTS **/
const postController = require("./model/postController.js")
const commentController = require("./model/commentController.js")
const userController = require("./model/userController.js")

/** SETUP **/

hbs.registerPartials(path.join(__dirname,'/views/partials'))
const urlencoder = bodyparser.urlencoded({
	extended: false
})
/** 
	Connect to mLab Database (heroku_0n46js2x)
    Username: Nine
    Password: trexfire6
    Admin Account:
    Username: heroku_0n46js2x
    Password: kayenicojosh116
**/
mongoose.Promise = global.Promise
mongoose.connect('mongodb://Nine:trexfire6@ds145951.mlab.com:45951/heroku_0n46js2x', {
	useNewUrlParser: true
})
	
express()

	.use(session({
		saveUninitialized: false,
		resave: true,
		secret: "nicokayejosh",
		name: "Nico's Cookie"
	}))

	.use(cookieparser())

	.use(express.static(path.join(__dirname, 'public')))
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'hbs')

/** ROUTES **/
	
	.get('/', urlencoder, (req, res) => {
		if(req.session.rememberMe){
			req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 3)
			req.session.maxAge = 1000 * 60 * 60 * 24 * 7 * 3
		}
        res.render("./pages/index.hbs", {
            uname: req.session.username,
			face: cool()
        })
	})

	.get('/post', (req, res) => {
		postController.getPostPage(req, res)
	})

	.post('/createnewpost', urlencoder, (req, res) => {
		postController.createPost(req, res)
	})

	.get('/user-profile', (req, res) => {
		userController.getUserProfile(req, res)
	})

	.get('/signin', (req, res) => res.render("./pages/signin.hbs"))
	.get('/about', (req,res) => res.render("./pages/about.hbs"))
	.get('/site-map', urlencoder, (req, res) => res.render("./pages/sitemap.hbs"))
	.get('/register', (req, res) => res.render("./pages/register.hbs"))
	.get('/newpost', (req, res) => res.render("./pages/newpost.hbs", {uname: req.session.username}))
	.get('/editpost', (req, res) => res.render("./pages/editpost.hbs"))


	.post('/logout', (req, res) => {
		req.session.destroy()
		res.clearCookie("Nico's Cookie")
		res.redirect("/")
	})

/** AJAX CALLS **/

	// POSTS //
	
	.get('/getposts', (req, res) => {
		postController.returnPosts(req, res)
	})

    .post('/getonepost', urlencoder, (req, res) => {
		postController.returnSinglePost(req,res)
	})
	.post('/searchkeyword', urlencoder, (req, res) =>{
		postController.returnSearchResults(req, res)
	})

	.post('/loaduserposts', urlencoder, (req, res) =>{
		
		console.log("loaduserPosts");
		postController.returnLoadUserPosts(req,res)
	})

	.post('/getmoreposts', urlencoder, (req, res) => {
		postController.returnMorePosts(req, res)
	})

	.post('/deletepost', urlencoder, (req, res) =>{
		postController.returnAfterDeleting(req, res)
	})
	
    .get('/getsortedbyscoreposts', urlencoder, (req, res) => {
		postController.returnSortedByScorePosts(req, res)
	})
	
    .get('/getsortedbydateposts', urlencoder, (req, res) => {
		postController.returnSortedByDatePosts(req, res)
	})
	


	// USERS //

	.post('/checkaccount', urlencoder, (req, res) =>{
		userController.returnLoginUser(req, res)
	})

	.post('/checkregisteraccount', urlencoder, (req, res) =>{
		userController.returnRegisterUser(req, res)
	})

	// COMMENTS //

	.get('/getcomment', urlencoder, (req, res) => {
		commentController.returnComment(req, res)
	})

	.post('/createnewcomment', urlencoder, (req, res) => {
		commentController.returnNewComment(req, res)
	})
	
/** FOR ERRORS, ALWAYS KEEP AT THE END **/

	.use("*", (req, res) => {
		res.render('./pages/error.hbs')
	})

	.listen(PORT, () => console.log(`Listening on ${ PORT }`))