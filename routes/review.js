const express=require("express")
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing =require("../models/listing");

const validateReview=(req,res,next)=>{  
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");             
       throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//Review page
//Post Revews route
router.post("/", validateReview, wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review created");
    res.redirect(`/listings/${listing.id}`);
 }));
 
 //DElete Reviews Route
 router.delete("/:reviewId",wrapAsync(async(req,res)=>{
     let {id,reviewId}= req.params;
     await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
     await Review.findOneAndDelete(reviewId);
     req.flash("success","Review deleted successfuly");
     res.redirect(`/listings/${id}`);
 }));

 module.exports=router;