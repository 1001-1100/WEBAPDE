const express = require('express')
const cool = require('cool-ascii-faces')
const path = require('path')
const bodyparser = require("body-parser")
const request = require('request')
const hbs = require("hbs")
hbs.registerPartials(path.join(__dirname,'/views/partials'))
const session = require("express-session")
const cookieparser = require("cookie-parser")
const urlencoder = bodyparser.urlencoded({
	extended: false
})
const PORT = process.env.PORT || 5000
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")     
mongoose.connect('mongodb://Nine:trexfire6@ds145951.mlab.com:45951/heroku_0n46js2x',
{
    useNewUrlParser:true
})
var User = mongoose.model("userList",{
	emailAddress : String,
	username : String,
	password : String,
	shortBio : String,
	avatar: String
})
var Post = mongoose.model("postList",{
	postTitle: String,
	postDescription: String,
	postAuthor: String,
	postDate: String,
	postScore: Number,
	commentNumber: Number
})

express()
	.use(session({
		saveUninitialized: true,
		resave: true,
		secret: "nicokayejosh",
		name: "Nico's Cookie",
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7 * 3
		}
	}))

	.use(cookieparser())

	.use(express.static(path.join(__dirname, 'public')))
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'hbs')

	.get('/', urlencoder, (req, res) => {
		if (req.session.username) {
			res.render("./pages/signedin.hbs", {
				uname: req.session.username
			})
		} else {
			res.render("./pages/index.hbs")
		}
	})

	.get('/post', urlencoder, (req, res) => {
		var findPost = Post.findOne({
			_id : req.query.id
		})
		findPost.then((foundPost)=>{
			if(foundPost){
                if (req.session.username) {
                    res.render("./pages/signed-post.hbs", {
                        postTitle: foundPost.postTitle,
                        postDescription: foundPost.postDescription,
                        postAuthor: foundPost.postAuthor,
                        postDate: foundPost.postDate,
                        postScore: foundPost.postScore,
                        commentNumber: foundPost.commentNumber,
                        uname: req.session.username
                    })
                } else {
                    res.render("./pages/post.hbs", {
                        postTitle: foundPost.postTitle,
                        postDescription: foundPost.postDescription,
                        postAuthor: foundPost.postAuthor,
                        postDate: foundPost.postDate,
                        postScore: foundPost.postScore,
                        commentNumber: foundPost.commentNumber
                    })
                }
			}else{
				
			}
		})
    })

	.get('/user-profile', (req, res) => {
        if (req.session.username) {
			res.render("./pages/signed-user-profile.hbs", {
                userHandle: "@Kansei_Drift",
                userBioData: "Hi my name is Kansei_Drift.",
				uname: req.session.username
			})
		} else {
			res.render("./pages/user-profile.hbs", {
                userHandle: "@Kansei_Drift",
                userBioData: "Hi my name is Kansei_Drift."
            })
		}
    })

	.get('/signin', (req, res) => res.render("./pages/signin.hbs"))

	.post('/signedin', urlencoder, (req, res) => {
		var findUser = User.findOne({
			emailAddress : req.body.emailAddress,
		})
		findUser.then((foundUser)=>{
			if(foundUser){
				bcrypt.compare(req.body.password, foundUser.password).then((msg)=>{
					if(msg){
						req.session.username = req.body.emailAddress
						res.render("./pages/signedin.hbs", {
							uname: req.session.username
						})
					}else{
						res.render("./pages/signin.hbs")
					}
				})
			}else{
				res.render("./pages/signin.hbs")
			}
		})
	})
	.post('/logout', (req, res) => {
		req.session.destroy()
		res.render("./pages/index.hbs")
	})
	.post('/registered', urlencoder, (req, res) => {
		var findUser = User.findOne({
			username : req.body.username
		})
		findUser.then((foundUser)=>{
			if(foundUser){
				res.render("./pages/register.hbs")
			}else{
				bcrypt.hash(req.body.password,12).then((hashed)=>{
					var hashedPassword = hashed
					var newUser = new User({
						emailAddress : req.body.emailAddress,
						username : req.body.username,
						password : hashedPassword,
						shortBio : req.body.shortBio,
						avatar: req.body.avatar
					})
					newUser.save().then((msg)=>{
						req.session.username = req.body.username
						res.render("./pages/signedin.hbs", {
							uname: req.session.username
						})
					})
				})
			}
		})
	})

	.get('/site-map', urlencoder, (req, res) => res.render("./pages/sitemap.hbs"))
	.get('/logout', (req, res) => res.render("./pages/index.hbs"))
	.get('/register', (req, res) => res.render("./pages/register.hbs"))
	.get('/newpost', (req, res) => res.render("./pages/newpost.hbs", {
		uname: req.session.username
	}))
	.get('/editpost', (req, res) => res.render("./pages/editpost.hbs"))
	.listen(PORT, () => console.log(`Listening on ${ PORT }`))