const Post = require("./models/post.js").Post
const Comment = require("./models/comment.js").Comment
const User = require("./models/user.js").User

module.exports.getPostPage = function getPostPage(req, res){
	var findPost = Post.findOne({
		_id: req.query.id
	})
	findPost.then((foundPost) => {
		if (foundPost) {
			res.render("./pages/post.hbs", {
				postID: foundPost._id,
				postTitle: foundPost.postTitle,
				postDescription: foundPost.postDescription,
				postAuthor: foundPost.postAuthor,
				postDate: foundPost.postDate,
				postScore: foundPost.postScore,
				commentNumber: foundPost.commentNumber,
				uname: req.session.username
			})
		} else {
			res.render('./pages/error.hbs')
		}
	})
}

module.exports.createPost = function createPost(req, res){
	var dateNow = new Date()
	var POSTID
		var newPost = new Post({
			postTitle: req.body.postTitle,
			postDescription: req.body.postDescription,
			postAuthor: req.session.username,
			postDate: (dateNow.getMonth()+1)+"/"+dateNow.getDate()+"/"+dateNow.getFullYear()+" "+dateNow.toLocaleTimeString(),
			postDateRaw: dateNow,
			postScore: 0,
			commentNumber: 0,
			comment: []
		})


		newPost.save().then((msg) => {
			POSTID = newPost._id

			console.log("")
		})

	
		var findUser = User.findOne({
			username: req.session.username
		})

		findUser.then((foundUser) => {
			foundUser.post.push(newPost)
			foundUser.save().then((msg) => {
				
			var newPostLink = "post?id=" + newPost._id
				res.redirect(newPostLink)
			})
		})	
}

module.exports.returnPosts = function returnPosts(req, res){
	var findPosts = Post.find().limit(5)
	findPosts.then((foundPosts)=>{
		res.send(foundPosts)
	})
}

module.exports.returnSortedByScorePosts = function returnSortedByScorePosts(req, res){
	var findPosts = Post.find({}).sort({postScore : -1}).limit(5)
	findPosts.then((foundPosts)=>{
		res.send(foundPosts)
	})
}

module.exports.returnSortedByDatePosts = function returnSortedByDatePosts(req, res){
	var findPosts = Post.find({}).sort({postDateRaw : -1}).limit(5)
	findPosts.then((foundPosts)=>{
		res.send(foundPosts)
	})
}


module.exports.returnMorePosts = function returnMorePosts(req, res){
	var findPosts = Post.find().skip(parseInt(req.body.skipNum)).limit(5)
	findPosts.then((foundPosts)=>{
		res.send(foundPosts)
	})
}

module.exports.returnSinglePost = function returnSinglePost(req, res){
	var findPost = Post.findOne({ _id : req.body.postID})
	findPost.then((foundPost)=>{
		res.send(foundPost)
	})
}

module.exports.returnSearchResults = function returnSearchedPosts(req, res){
	var findPost = Post.find({postDescription: {$regex:req.body.keyword ,$options:"$i"}})
	var findPost2 = Post.find({postTitle: {$regex:req.body.keyword ,$options:"$i"}})
	let check = 0;
	console.log("im in /searchkeyword " + req.body.keyword);
	findPost.then((foundPosts)=>{
		findPost2.then((foundPosts2)=>{
			if(foundPosts || foundPosts2){
				console.log(foundPosts)
				console.log("foundPosts not nullll");
				res.send(foundPosts.concat(foundPosts2));
				
			}else{
				console.log("foundPosts nullll");
				res.send(null);
			}
		})
	})
}

module.exports.returnLoadUserPosts = function returnLoadUserPosts(req, res){

	var username = req.body.username;
	console.log("returnLoadUserPosts");
	var findPost = User.find({username: username})

	findPost.then((foundPosts)=>{
		if(foundPosts) 
			res.send(foundPosts)
	
	})


}

module.exports.returnAfterDeleting = function returnAfterDeletingPosts(req, res){

	var postid = req.body.id
	var username = req.body.username
	console.log("in returnAfterDeleting, postid = " + postid);


	// Post.remove( { _id : postid 
	// }).then(()=>{

	// })


	var updatedList = User.findOne({username: username})

	updatedList.then((foundUser)=>{

		if(foundUser){
			for(let i = 0; i <foundUser.post.length; i++){
			//	console.log(foundUser[0].post.length);
			//	console.log(foundUser[0].post[i]._id);
				if(foundUser.post[i]._id == postid){
					foundUser.post.splice(i, 1); // removes the post in the 'post' array of the user
				//	foundUser.post
					res.send(foundUser); 
				}
			}
		}
		foundUser.save().then((msg) => {
			
			})

	})

		
}