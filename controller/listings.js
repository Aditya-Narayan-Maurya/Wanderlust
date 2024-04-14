const Listing=require("../models/listing.js");

module.exports.index=async(req,res)=>{
    let allListings= await Listing.find({});
     res.render("listings/index.ejs",{allListings}) ;
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs")
 }

module.exports.showListing=async(req,res)=>{
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
 }

module.exports.createListing=async(req,res,next)=>{
    // let {title,description,location,price,country}=req.body;
    // console.log(title,description,location,price,country);
        let newListing = new Listing(req.body.listing);
        newListing.owner=req.user._id;
        await newListing.save();
        req.flash("success","New listing created");
        console.log(req.body.listing.image)
        res.redirect("/listings");   
 }

module.exports.renderEditForm=async(req,res)=>{
    let {id}= req.params;
    let listing= await Listing.findById(id);
    if(!listing){
       req.flash("error","listing you are looking for does not exist!");
       res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
 }

module.exports.updateListing=async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","listing updated successfully");
    res.redirect(`/listings/${id}`);
 }

module.exports.destroyListing=async(req,res)=>{
    let {id}= req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","listing daleted successfully");
    console.log(deletedListing);
    res.redirect("/listings");
 }