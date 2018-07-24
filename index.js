const express = require('express')
const cool = require('cool-ascii-faces')
const path = require('path')
const bodyparser = require("body-parser")
const request = require('request')
const hbs = require("hbs")
hbs.registerPartials(path.join(__dirname,'/views/partials'))
const mongoose = require("mongoose")
const session = require("express-session")
const urlencoder = bodyparser.urlencoded({
	extended: false
})
const PORT = process.env.PORT || 5000

//var foo = new Promise((resolve, reject)=>{
//    var n = Math.random()
//    if(n > 0.5){
//        resolve("Correct!")
//    }else{
//        resolve("Error!")
//    }
//})
//
//foo.then((msg)=>{
//    //fulfilled
//    console.log(msg)
//},(err)=>{
//    //depression
//    console.log(err)
//})

mongoose.connect("mongodb://heroku_0n46js2x:31415926balm@ds145951.mlab.com:45951/heroku_0n46js2x",{
    useNewUrlParser: true
})

var User = mongoose.model("userList",{
    username : String,
    password : String,
    height : Number
})

var u = new User({
    username : "Nine",
    password : "31415",
    height: 9
})

u.save().then((msg)=>{
    console.log(msg)
},(err)=>{
    console.log(err)
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

	.get('/post', (req, res) => {
		if (req.session.username) {
            res.render("./pages/signed-post.hbs", {
                postTitle: "Do you find portrait mode worth it?",
                postDescription: "Debating whether upgrading my smartphone is worth it. Have a Nexus 6 that I’m really happy with except photos. Now I’m not too much into photography and it takes good photos but these new phones like the Pixel 2 have these great portrait modes, and I want to make myself look better for online shots. Is that alone a good enough reason to upgrade? Like is the difference magical or just hype (as in make someone meh looking look great)?",
                postAuthor: "Kansei_Drift",
                postDate: "07/09/2018 15:30",
                postScore: "6",
                commentNumber: "5",
                uname: req.session.username
            })
		} else {
			res.render("./pages/post.hbs", {
                postTitle: "Do you find portrait mode worth it?",
                postDescription: "Debating whether upgrading my smartphone is worth it. Have a Nexus 6 that I’m really happy with except photos. Now I’m not too much into photography and it takes good photos but these new phones like the Pixel 2 have these great portrait modes, and I want to make myself look better for online shots. Is that alone a good enough reason to upgrade? Like is the difference magical or just hype (as in make someone meh looking look great)?",
                postAuthor: "Kansei_Drift",
                postDate: "07/09/2018 15:30",
                postScore: "6",
                commentNumber: "5"
            })
		}
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

	.get('/site-map', urlencoder, (req, res) => res.render("./pages/sitemap.hbs"))
	.get('/logout', (req, res) => res.render("./pages/index.hbs"))
	.get('/register', (req, res) => res.render("./pages/register.hbs"))
	.get('/newpost', (req, res) => res.render("./pages/newpost.hbs", {
		uname: req.session.username
	}))
	.get('/editpost', (req, res) => res.render("./pages/editpost.hbs"))
	.listen(PORT, () => console.log(`Listening on ${ PORT }`))