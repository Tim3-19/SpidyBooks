const router = require("express").Router();
const User = require("../database/user");
const { authenticateToken } = require("./userAuth");
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

        // Step 1: Pre-check all book quantities
        // Count required quantities for each book id
        const requiredQuantities = {};
        for (const orderItem of order) {
            const bookId = orderItem._id ? orderItem._id : orderItem;
            requiredQuantities[bookId] = (requiredQuantities[bookId] || 0) + 1;
        }

        // Fetch all requested books from DB and verify stock
        const bookDocs = {};
        for (const [bookId, reqQty] of Object.entries(requiredQuantities)) {
            const bookDoc = await book.findById(bookId); // Note: schema name is 'book'
            if (!bookDoc) {
                return res.status(404).json({ message: "Book not found" });
            }
            if ((bookDoc.quantity || 0) < reqQty) {
                return res.status(400).json({ message: `Sorry, "${bookDoc.title}" is out of stock or does not have enough quantity.` });
            }
            bookDocs[bookId] = bookDoc;
        }

        // Step 2: Decrement stock
        for (const [bookId, reqQty] of Object.entries(requiredQuantities)) {
            await book.findByIdAndUpdate(bookId, { $inc: { quantity: -reqQty } });
        }

        // Step 3: Place orders
        for (const [bookId, reqQty] of Object.entries(requiredQuantities)) {
            console.log(`3. Processing Item: ${bookId} with Quantity: ${reqQty}`);

            const newOrder = new Order({
                user: id,
                book: bookId,
                quantity: reqQty,
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

        return res.json({ status: "Success", message: "Order Placed Successfully" });

    } catch (error) {
        console.error("❌ ERROR in Place Order:", error); // READ THIS IN CONSOLE
        return res.status(500).json({ message: "Error placing order", error: error.message });
    }
});
router.get("/order-history", authenticateToken, async (req, res) => {

    try {
        const { id } = req.headers;
        console.log("Headers received:", req.headers);
        console.log("Extracted ID:", id);
        const userData = await User.findById(id).populate({
            path: "order",
            populate: { path: "book" },
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
router.get("/all-orders", authenticateToken, async (req, res) => {
    try {
        const orderData = await Order.find()
            .populate("book")
            .populate("user")
            .sort({ createdAt: -1 });

        return res.json({
            status: "Success",
            data: orderData,
        });

    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ message: "Internal Server Issue" });
    }
});

//updating order status
router.put("/update-status/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await Order.findByIdAndUpdate(id, { orderstatus: req.body.status });

        return res.json({
            status: "Success",
            message: "Status updated successfully",
        });

    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ message: "Internal Server Issue" });
    }
});


module.exports = router;