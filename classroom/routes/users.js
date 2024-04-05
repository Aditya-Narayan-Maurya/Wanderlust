const express =require("express");
const router =express.Router();

// index - users
router.get("/",(req,res)=>{
    res.send("index route fr users");
})

//  Show - users
router.get("/:id",(req,res)=>{
    res.send("show route fr users");
})

// Post - users
router.post("/",(req,res)=>{
    res.send("post route fr users");
})

// delete - users
router.delete("/:id",(req,res)=>{
    res.send("delete route fr users");
})


module.exports=router;