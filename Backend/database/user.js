const mongoose = require("mongoose")
const user = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    pass:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    avatar:{
        type: String,
        default: "https://img.icons8.com/?size=100&id=7820&format=png&color=000000",
    },
    role:{
        type:String,
        default: "user",
        enum:["user","admin"],
    },
    //array of objects
    favourites:[
        { 
            type: mongoose.Types.ObjectId,
            ref: "book",
        },
    ],
   

    cart:[
        { 
            type: mongoose.Types.ObjectId,
            ref: "book",
        },
    ],
    order:[
        
        { 
            type: mongoose.Types.ObjectId,
            ref: "orders",
        },
    ],
},
{timestamps: true}
);
module.exports = mongoose.model("user" , user); 

    






