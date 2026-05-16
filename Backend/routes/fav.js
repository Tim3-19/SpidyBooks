const router = require("express").Router();
const User = require("../database/user");
const {authenticateToken} = require("./userAuth");

//Adding Books to favourites
router.put("/addBookFav",authenticateToken,async(req,res)=>{
    try {
        
        const{bookid, id} = req.headers;
        const userData = await User.findById(id);
        const isFav = userData.favourites.includes(bookid);
        if(isFav)
        {
            return res.status(200).json({ message: "Book is already added to Favourites" });
        }
        else
        {
            await User.findByIdAndUpdate(id,{$push:{favourites:bookid}});
            return res.status(200).json({ message: "Book is  added to Favourites" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Issue" });
    }
})

//deletion of books from favourites
router.put("/removeBookFav",authenticateToken,async(req,res)=>{
    try {
        
        const{bookid, id} = req.headers;
        const userData = await User.findById(id);
        const isFav = userData.favourites.includes(bookid);
        if(isFav)
        {
           await User.findByIdAndUpdate(id,{$pull:{favourites:bookid}});
        }
        return res.status(200).json({ message: "Book is  removed from Favourites" });
        
    } catch (error) {
        res.status(500).json({ message: "Internal Server Issue" });
    }
})

//get favourite books of a particular user
router.get("/getFavBooks", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;

        
        

        if (!id) {
            return res.status(400).json({ message: "User ID is required in headers" });
        }

        const userData = await User.findById(id).populate("favourites");

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        const favBooks = userData.favourites;
        return res.status(200).json({
            status: "Success",
            data: favBooks,
        });

    } catch (error) {
        // THIS IS THE MISSING PIECE
        console.error("THE REAL ERROR IS:", error); 
        return res.status(500).json({ message: "An error occurred" });
    }
});
    
module.exports = router;

