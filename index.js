const express = require('express')
const cool = require('cool-ascii-faces')
const path = require('path')
const bodyparser = require("body-parser")
const request = require('request')
const hbs = require("hbs")
const session = require("express-session")
const urlencoder = bodyparser.urlencoded({
	extended : false
})
const PORT = process.env.PORT || 5000

express()
	.use(session({
		saveUninitialized: true,
		resave: true,
		secret: "nicokayejosh",
		name: "Nico's Cookie",
		cookie:{
			maxAge: 1000*60*60*24*7*3
		}
	}))

    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'hbs')

    .get('/', urlencoder, (req, res) => {
		if(req.session.username){
			res.render("./pages/signedin.hbs", {
				uname: req.session.username
			})		
		}else{
			res.render("./pages/index.hbs")
		}
	})    
	
	.get('/post', (req, res) => res.render("./pages/post.hbs"))
    .get('/post2', (req, res) => res.render("./pages/post2.hbs"))
    .get('/post3', (req, res) => res.render("./pages/post3.hbs"))
    .get('/post4', (req, res) => res.render("./pages/post4.hbs"))
    .get('/post5', (req, res) => res.render("./pages/post5.hbs"))

    .get('/signin', (req, res) => res.render("./pages/signin.hbs"))

    .post('/signedin', urlencoder, (req, res) => {
		req.session.username = req.body.username
		res.render("./pages/signedin.hbs", {
			uname: req.session.username
		})
	})
	.post('/logout', (req, res) => {
		req.session.destroy()
		res.render("./pages/index.hbs")
	})
    .post('/registered', urlencoder, (req, res) => {
		req.session.username = req.body.username
		res.render("./pages/signedin.hbs", {
			uname: req.session.username
		})
	})
    .get('/user-profile', (req, res) => res.render("./pages/user-profile.hbs", {
		uname: req.session.username
	}))
	.get('/logout', (req, res) => res.render("./pages/index.hbs"))
    .get('/register', (req, res) => res.render("./pages/register.hbs"))
    .get('/newpost', (req, res) => res.render("./pages/newpost.hbs", {
        uname: req.session.username
    }))
    .get('/editpost', (req, res) => res.render("./pages/editpost.hbs"))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))