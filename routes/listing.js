const express= require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const Listing =require("../models/listing");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");



//index route
router.get("/",wrapAsync(async(req,res)=>{
    let allListings= await Listing.find({});
     res.render("listings/index.ejs",{allListings}) 
}));


//new Route
router.get("/new",isLoggedIn,(req,res)=>{
   res.render("listings/new.ejs")
})

//show Route
router.get("/:id",wrapAsync(async(req,res)=>{
   let {id}= req.params;
   let listing= await Listing.findById(id)
   .populate({
     path: "reviews",
     populate:{
      path:"author",
     },
   })
   .populate("owner");
   if(!listing){
      req.flash("error","listing you are looking for does not exist!");
      res.redirect("/listings");
   }
   console.log(listing);
   res.render("listings/show.ejs",{listing});
}));

//Create Route
router.post("/",isLoggedIn,validateListing,wrapAsync( async(req,res,next)=>{
   // let {title,description,location,price,country}=req.body;
   // console.log(title,description,location,price,country);
       let newListing = new Listing(req.body.listing);
       newListing.owner=req.user._id;
       await newListing.save();
       req.flash("success","New listing created");
       console.log(req.body.listing.image)
       res.redirect("/listings");   
}));

//edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
   let {id}= req.params;
   let listing= await Listing.findById(id);
   if(!listing){
      req.flash("error","listing you are looking for does not exist!");
      res.redirect("/listings");
   }
   res.render("listings/edit.ejs",{listing});
}));

//Update Route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
   let {id}= req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   req.flash("success","listing updated successfully");
   res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
   let {id}= req.params;
   let deletedListing=await Listing.findByIdAndDelete(id);
   req.flash("success","listing daleted successfully");
   console.log(deletedListing);
   res.redirect("/listings");
}));

module.exports=router;