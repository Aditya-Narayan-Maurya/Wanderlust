const expess=require("express")
const app=expess();

const users=require("./routes/users.js");
const posts=require("./routes/posts.js");

app.get("/",(req,res)=>{
    res.send("This is root route")
})

app.use("/users",users);
app.use("/posts",posts);


app.listen(3000,()=>{
    console.log("app is listening of the port 3000");
})