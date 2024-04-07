const expess=require("express")
const app=expess();
// const cookieParser = require('cookie-parser');

const session=require("express-session");
const flash = require('connect-flash');
const path=require("path");


app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));

const sessionOption={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true
}
app.use(session(sessionOption));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    next();
})

app.get("/register",(req,res)=>{
    let {name="anonymous"}= req.query;
    if (name==="anonymous") {
        req.flash("error","user not registered");
    } else {
        req.flash("success","user register successfully");     
    }
    req.session.name=name;
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name});
});

// app.get("/reqcount",(req,res)=>{
//     if (req.session.count) {
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//     res.send(`You send the responce ${req.session.count} times`);
// });

// app.get("/test",(req,res)=>{
//    res.send("Test successful");

// });













// app.use(cookieParser("secratecode"))

// const users=require("./routes/users.js");
// const posts=require("./routes/posts.js");

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("color","red",{signed:true});
//     res.send("signed cookie sent");
// })

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// })

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","namaste");
//     res.cookie("Origin","India");
//     res.send("we send you a cookies!");
// })

// app.get("/greet",(req,res)=>{
//     let {name= "anonymous"} = req.cookies;
//     res.send(`Hi, ${name}`);
// })

// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("This is root route")
// })

// app.use("/users",users);
// app.use("/posts",posts);


app.listen(3000,()=>{
    console.log("app is listening of the port 3000");
})