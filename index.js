const express = require('express')
const cool = require('cool-ascii-faces')
const path = require('path')
const bodyparser = require("body-parser")
const request = require('request')
const hbs = require("hbs")
const urlencoder = bodyparser.urlencoded({
	extended : false
})
const PORT = process.env.PORT || 5000

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'hbs')
    .get('/', (req, res) => res.render("./pages/index.hbs"))
    .get('/post', (req, res) => res.render("./pages/post.hbs"))
    .get('/signin', (req, res) => res.render("./pages/signin.hbs"))

    .post('/signedin', urlencoder, (req, res) => {
		console.log(req.body.username)
		res.render("./pages/signedin.hbs", {
			uname: req.body.username
		})
	})

	.get('/signedin', (req, res) => res.render("./pages/signedin.hbs"))

    .get('/user-profile', (req, res) => res.render("./pages/user-profile.hbs"))
    .get('/register', (req, res) => res.render("./pages/register.hbs"))
    .get('/newpost', (req, res) => res.render("./pages/newpost.hbs"))
    .get('/editpost', (req, res) => res.render("./pages/editpost.hbs"))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))