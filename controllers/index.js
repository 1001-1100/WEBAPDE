const express = require("express")
const cool = require("cool-ascii-faces")
const router = express.Router()
const app = express()

router.use("/post", require("./postController"))
router.use("/user", require("./userController"))
router.use("/comment", require("./commentController"))

router.get("/", (req, res) => {
    if (req.session.rememberMe) {
        req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 3)
        req.session.maxAge = 1000 * 60 * 60 * 24 * 7 * 3
    }
    res.render("./pages/index.hbs", {
        uname: req.session.username,
        face: cool()
    })
})

router.get("/about", (req, res) => {
    res.render("./pages/about.hbs")
})

router.get("/signin", (req, res) => {
    res.render("./pages/signin.hbs")
})

router.get("/register", (req, res) => {
    res.render("./pages/register.hbs")
})

router.get("/cool", (req,res) => {
    res.send(cool())
})

module.exports = router