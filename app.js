const express= require("express");
const app=express();
const mongoose = require('mongoose');
const Listing =require("./models/listing");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync");
const ExpressError=require("./utils/ExpressError");
const {listingSchema}=require("./schema.js");


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
  })

const validateListing=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    let errMsg=error.details.map((el)=>el.message).join(",");
    if(error){
       throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//index route
app.get("/listings",wrapAsync(async(req,res)=>{
     let allListings= await Listing.find({});
      res.render("listings/index.ejs",{allListings}) 
}));


//new Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//show Route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let listing= await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));

//Create Route
app.post("/listings",validateListing,wrapAsync( async(req,res,next)=>{
    // let {title,description,location,price,country}=req.body;
    // console.log(title,description,location,price,country);
        let newListing = new Listing(req.body.listing);
        await newListing.save();
        console.log(req.body.listing.image)
        res.redirect("/listings");   
}));

//edit Route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

// app.get("/testlisting",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"my new villa",
//         description:"by the beach",
//         price:1200,
//         location:"calangute, goa",
//         country:"india"
//     })
//     await sampleListing.save();
//     console.log("this is working");
//     res.send("successful")
// })

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