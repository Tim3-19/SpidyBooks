const  mongoose  = require("mongoose")

// Order schema
// - Links a user to a single book
// - Tracks basic order status
const order = new mongoose.Schema(
    {
        user:{
            type : mongoose.Types.ObjectId,
            ref : "user",
            required: true,
        },
        book:{
            type: mongoose.Types.ObjectId,
            ref: "book",
            required: true,
        },
        quantity:{
            type: Number,
            default: 1,
            required: true,
        },
        orderstatus:{
            type: String,
            default: "Order Placed",
            enum: [
                "Order Placed",
                "Out for delivery",
                "Cancelled",
                "Delivered"
            ],
        },
    },
    { timestamps: true } // keep orders in chronological order
);

module.exports = mongoose.model("orders",order);
