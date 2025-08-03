
const express = require("express");
const router = express.Router();


//posts
//index route users
router.get("/",(req,res)  => {
    res.send("GET for show posts");
})

//show posts
router.get("/:id",(req,res)  => {
    res.send("GET for shwo post id");
})

//post posts
router.put("/",(req,res)  => {
    res.send("POST requests for posts");
})

//delete posts
router.delete("/:id",(req,res) => {
    res.send("DELETE for posts");
})

module.exports = router;