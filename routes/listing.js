const express= require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const {listingSchema}=require("../schema.js");
const Listing =require("../models/listing");
const {isLoggedIn}=require("../middleware.js");


const validateListing=(req,res,next)=>{  
    let {error}= listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");             
       throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

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
   let listing= await Listing.findById(id).populate("reviews");
   if(!listing){
      req.flash("error","listing you are looking for does not exist!");
      res.redirect("/listings");
   }
   res.render("listings/show.ejs",{listing});
}));

//Create Route
router.post("/",isLoggedIn,validateListing,wrapAsync( async(req,res,next)=>{
   // let {title,description,location,price,country}=req.body;
   // console.log(title,description,location,price,country);
       let newListing = new Listing(req.body.listing);
       await newListing.save();
       req.flash("success","New listing created");
       console.log(req.body.listing.image)
       res.redirect("/listings");   
}));

//edit Route
router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
   let {id}= req.params;
   let listing= await Listing.findById(id);
   if(!listing){
      req.flash("error","listing you are looking for does not exist!");
      res.redirect("/listings");
   }
   res.render("listings/edit.ejs",{listing});
}));

//Update Route
router.put("/:id",isLoggedIn,validateListing,wrapAsync(async(req,res)=>{
   let {id}= req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   req.flash("success","listing updated successfully");
   res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
   let {id}= req.params;
   let deletedListing=await Listing.findByIdAndDelete(id);
   req.flash("success","listing daleted successfully");
   console.log(deletedListing);
   res.redirect("/listings");
}));

module.exports=router;