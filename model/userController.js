const Post = require("./models/post.js").Post
const Comment = require("./models/comment.js").Comment
const User = require("./models/user.js").User
const bcrypt = require("bcrypt")

module.exports.getUserProfile = function getUserProfile(req, res){
	if (req.query.u) {
		var findUser = User.findOne({
			username: req.query.u,
		})
		findUser.then((foundUser) => {
			if (foundUser) {
				var findPosts = Post.find({
					postAuthor: foundUser.username
				}, {
					_id: {
						$slice: 5
					}
				})
				findPosts.then((foundPosts) => {
					var postIDs = []
					var postTitles = []
					var postDescriptions = []
					var postAuthors = []
					var postDates = []
					var postScores = []
					var commentNumbers = []
					for (let i = 0; i < foundPosts.length; i++) {
						postIDs.push(foundPosts[i]._id)
						postTitles.push(foundPosts[i].postTitle)
						postDescriptions.push(foundPosts[i].postDescription)
						postAuthors.push(foundPosts[i].postAuthor)
						postDates.push(foundPosts[i].postDate)
						postScores.push(foundPosts[i].postScore)
						commentNumbers.push(foundPosts[i].commentNumber)
					}
				})
				res.render("./pages/user-profile.hbs", {
					userHandle: "@" + foundUser.username,
					userBioData: foundUser.shortBio,
					uname: req.session.username
				})
			} else {
				res.render('./pages/error.hbs')
			}
		})
	} else {
		res.redirect("user-profile?u=" + req.session.username)
	}
}

module.exports.returnLoginUser = function returnLoginUser(req, res){
	var findUser = User.findOne({username: req.body.uname})
	findUser.then((foundUser)=>{
		if(foundUser){
			bcrypt.compare(req.body.pword, foundUser.password).then((msg)=>{
				if(msg){
					if(req.body.rememberMe){
						req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 3)
						req.session.maxAge = 1000 * 60 * 60 * 24 * 7 * 3
					}
					req.session.rememberMe = req.body.rememberMe
					req.session.username = req.body.uname
					res.send(foundUser);
				}else{
					res.send(null);
				}
			})
		}else{
			res.send(null);
		}
	})
}

module.exports.returnRegisterUser = function returnRegisterUser(req, res){
	var findUser = User.findOne({username: req.body.uname}) // (name in db): req.body.(name passed from client)
	var findEmail = User.findOne({emailAddress: req.body.email}) // (name in db): req.body.(name passed from client)

	findUser.then((foundUser)=>{
		findEmail.then((foundEmail)=>{

			if(foundUser){ // only username matched in db
					res.send("1")
					console.log("in checkregisteraccount - if");	
			}
			else if(foundEmail){ // only email matched in db
					res.send("2")
					console.log("in checkregisteraccount - if");
			}
			else{
				console.log("in checkregisteraccount - else");
				bcrypt.hash(req.body.password,12).then((hashed)=>{
					var hashedPassword = hashed
					var newUser = new User({
						emailAddress : req.body.email,
						username : req.body.uname,
						password : hashedPassword,
						shortBio : req.body.bio,
					})
				
					newUser.save().then((msg)=>{
						if(req.body.rememberMe){
							req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 3)
							req.session.maxAge = 1000 * 60 * 60 * 24 * 7 * 3
						}
						req.session.rememberMe = req.body.rememberMe
						req.session.username = req.body.uname
						res.send(null);
					})
				})
			}
		})
	})
}