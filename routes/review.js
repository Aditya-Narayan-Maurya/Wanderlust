const express=require("express")
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync");
const Review=require("../models/review.js");
const Listing =require("../models/listing");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");

//Review page
//Post Revews route
router.post("/", validateReview,isLoggedIn, wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review created");
    res.redirect(`/listings/${listing.id}`);
 }));
 
 //Delete Reviews Route
 router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(async(req,res)=>{
     let {id,reviewId}= req.params;
     await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
     await Review.findOneAndDelete(reviewId);
     req.flash("success","Review deleted successfuly");
     res.redirect(`/listings/${id}`);
 }));

 module.exports=router;