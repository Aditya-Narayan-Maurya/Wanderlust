const express= require("express");
const app=express();
const mongoose = require('mongoose');
const Listing =require("./models/listing");
const path=require("path");
const methodOverride=require("method-override");



app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));


app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))

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

//index route
app.get("/listings",async(req,res)=>{
     let allListings= await Listing.find({});
      res.render("listings/index.ejs",{allListings}) 
})


//new Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//show Route
app.get("/listings/:id",async(req,res)=>{
    let {id}= req.params;
    let listings= await Listing.findById(id);
    res.render("listings/show.ejs",{listings});
})

//Create Route
app.post("/listings",async(req,res)=>{
    // let {title,description,location,price,country}=req.body;
    // console.log(title,description,location,price,country);
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})

//edit Route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}= req.params;
    let listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//Update Route
app.put("/listings/:id",async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//Dlete Route
app.delete("/listings/:id",async(req,res)=>{
    let {id}= req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");

})

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

app.listen(8080,()=>{
    console.log("app is listening of the port 8080");
})