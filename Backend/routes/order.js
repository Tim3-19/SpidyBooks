const router = require("express").Router();
const User = require("../database/user");
const {authenticateToken} = require("./userAuth");
const book = require("../database/book");
const Order = require("../database/order");
const user = require("../database/user");

//placing order
router.post("/place-order", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { order } = req.body;

        console.log("--- BODY DEBUG ---");
console.log("Full Body Object:", req.body); // See what keys are actually here

        // check if order is empty
        if (!order || order.length === 0) {
            return res.status(400).json({ message: "No order data provided" });
        }

        for (const orderItem of order) {
            console.log("3. Processing Item:", orderItem);

            // AUTO-FIX: Handle both "Whole Book Object" and "Just ID String"
            const bookId = orderItem._id ? orderItem._id : orderItem;

            const newOrder = new Order({
                user: id,
                book: bookId, 
            });

            const orderFromDb = await newOrder.save();
            console.log("4. Order Saved:", orderFromDb._id);

            await User.findByIdAndUpdate(id, {
                $push: { order: orderFromDb._id }
            });
            console.log("5. User Updated");
        }

        // Clear cart
        await User.findByIdAndUpdate(id, { $set: { cart: [] } });

        return res.json({ status: "Success", message: "Order Placed" });

    } catch (error) {
        console.error("❌ ERROR in Place Order:", error); // READ THIS IN CONSOLE
        return res.status(500).json({ message: "Error placing order", error: error.message });
    }
});
router.get("/order-history",authenticateToken,async (req,res) => {
    
    try {
        const { id } =req.headers;
        console.log("Headers received:", req.headers);
console.log("Extracted ID:", id);
        const userData = await User.findById(id).populate({
            path: "order",
            populate: {path:"book"},
        });
        console.log(userData);

        const orderData = userData.order.reverse();
        return res.json({
            status: "Success",
            data: orderData,
        });
        
    } catch (error) {
        res.status(500).json({ message: "Internal Server Issue" });
    } 
   
    
})
//order history for user


//order list for admin
router.get("/all-order",authenticateToken,async(req,res) => {
    try {
        const { id } =req.headers;
        const userData = await User.find().populate({
            
                path:"books",
             }).populate({
                path:"user",
             })
             .sort({craetedAt: -1}) 
             return res.json({
            status: "Success",
            data: userData,             
        });
        
    } catch (error) {
        res.status(500).json({ message: "Internal Server Issue" });
    } 
})

//updating order status
router.put("/update-status/:id",authenticateToken,async(req,res) => {
    try {
        const { id } =req.params;
        await order.findByIdAndUpdate(id,{status:req.body.status});
       
        return res.json({
        status: "Success",
        message: "Status updated succefullly",             
        });
        
    } catch (error) {
        res.status(500).json({ message: "Internal Server Issue" });
    } 
})


module.exports=router;