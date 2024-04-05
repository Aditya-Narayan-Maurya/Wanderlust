const express= require("express");
const app=express();
const mongoose = require('mongoose');
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError");

const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname,"public")));

app.engine('ejs', ejsMate);

let mongoose_url='mongodb://127.0.0.1:27017/wanderlust';
main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
   console.log(err);
})

async function main() {
    await mongoose.connect(mongoose_url);
 }

app.get('/', (req, res) => {
    res.send('Hello World!')
  });

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("app is listening of the port 8080");
});