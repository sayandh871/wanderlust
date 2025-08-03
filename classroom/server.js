const express = require("express");
const app = express();
const users = require("./routes/user")
const posts = require("./routes/posts");


app.use("/users",users);
app.use("/posts",posts);

app.get("/",(req,res)=>{
    res.send("this is root");
})

app.listen(8080, () => {
    console.log("server listening to 8080");
})
 