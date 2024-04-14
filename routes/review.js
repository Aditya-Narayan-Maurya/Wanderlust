const express=require("express")
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync");
const Review=require("../models/review.js");
const Listing =require("../models/listing");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controller/reviews.js");

//Review page
//Post Revews route
router.post("/", validateReview,isLoggedIn, wrapAsync(reviewController.createReview));
 
 //Delete Reviews Route
 router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

 module.exports=router;