const mongoose = require('mongoose');
const schema=mongoose.Schema;

const listingSchema= new schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:"https://unsplash.com/photos/the-sun-setting-over-a-body-of-water-jsRfWTFFjrg",
        set:(v)=> v==="" ? "https://unsplash.com/photos/the-sun-setting-over-a-body-of-water-jsRfWTFFjrg" : v,
    },
    price:{
        type:Number,

    },
    location:{
        type:String,
    },
    country:{
        type:String,
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;