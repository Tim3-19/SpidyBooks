const  mongoose  = require("mongoose")
//creating schema
const book = new mongoose.Schema(
    {
        url:{
            type: String,
            required: true,
        },
        title:{
            type : String,
            required: true,
        },
        author:{
            type : String,
            required: true,
        },
         price:{
            type : Number,
            required: true,
        },
        desc:{
            type : String,
            required: true,
        },
        lang:{
            type : String,
            required: true,
        },
        quantity:{
            type: Number,
            required: true,
            default: 0
        },
    },

    
    { timestamps: true}
);

module.exports = mongoose.model("book",book);
