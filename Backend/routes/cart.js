const router = require("express").Router();
const User = require("../database/user");
const {authenticateToken} = require("./userAuth");

//adding to cart 
router.put("/add-to-cart",authenticateToken,async(req,res)=>{
    try {
        
        const{bookid, id} = req.headers;
        const userData = await User.findById(id);
        const isAdded = userData.cart.includes(bookid);
        if(isAdded)
        {
             return res.json({
            status : "Success",
            message: "Book is  already added to Cart"
        });
        }
        else
        {
            await User.findByIdAndUpdate(id,{$push:{cart:bookid}});
             return res.json({
            status : "Success",
            message: "Book is  already added to Cart"})
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Issue" });
    }
})

//removing from cart 
router.put("/remove-from-cart/:bookid",authenticateToken,async(req,res)=>{
    try {
        
        const{bookid} = req.params;
        const{id} = req.headers;
        // Correctly pull from the cart, not favourites
        await User.findByIdAndUpdate(id,{$pull:{cart:bookid}});
        
          return res.json({
            status : "Success",
            message: "Book is  removed from Cart"});
        
    } catch (error) {
        res.status(500).json({ message: "Internal Server Issue" });
    }
})

//cart for user
router.get("/get-cart",authenticateToken,async (req,res) => {

    try {
        
        const {id} = req.headers;
        const userData = await User.findById(id).populate("cart");
        const cart = userData.cart.reverse();
        return res.json({
            status : "Success",
            data : cart,
        });
        
    } catch (error) {
        res.status(500).json({ message: "Internal Server Issue" });
    }
    
})
module.exports = router;