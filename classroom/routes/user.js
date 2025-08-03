const express = require("express");
const app = express();
const router = express.Router();



//index route users
router.get("/",(req,res)  => {
    res.send("GET for shwo users");
})

//show users
router.get("/:id",(req,res)  => {
    res.send("GET for shwo user id");
})

//post users
router.put("/",(req,res)  => {
    res.send("POST for users");
})

//delete users
router.delete("/:id",(req,res) => {
    res.send("DELETE for users");
})

module.exports = router;