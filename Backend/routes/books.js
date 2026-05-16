const router = require("express").Router();
const User = require("../database/user");

//npm i jsonwebtoken
const jwt = require("jsonwebtoken");

const {authenticateToken} = require("./userAuth");
 const Book = require("../database/book");

 //Adding Books
 router.post("/add-books",authenticateToken, async(req,res)=>{
     try {

             const {id} = req.headers;
             const user = await User.findById(id);
             if(user.role!="admin"){
                return res.status(400).json({message:"You do not have admin access"});
             }

         const book = new Book({
             url: req.body.url,
             title: req.body.title,
             author: req.body.author,
             price: req.body.price,
             desc: req.body.desc,
             lang: req.body.lang,
             quantity: req.body.quantity || 0


         })
         await book.save()
         return res.status(200).json({message:"Book added succesfully"});
        
     } catch (error) {
        console.log(error)
         return res.status(500).json({ message: "Internal Server Issue" });
        
     }
 });
 //Updating Books
 router.put("/update-books",authenticateToken,async(req,res)=>{

    try{
        const {bookid} = req.headers;
        await Book.findByIdAndUpdate(bookid,{
             url: req.body.url,
             title: req.body.title,
             authour: req.body.author,
             price: req.body.price,
             desc: req.body.desc,
             lang: req.body.lang,
             quantity: req.body.quantity
    })
    return res.status(200).json({message:"Book updated succesfully"});
    }catch(error)
    {
        return res.status(500).json({ message: "Internal Server Issue" });
    }
 });
 //Deleting Route
 router.delete("/delete-book",authenticateToken,async(req,res)=>{
   try {
     const {bookid} = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({message:"Deleted successfully"})

    
   } catch (error) {
    
        return res.status(500).json({ message: "Internal Server Issue" });
   }
 });
 //Updating Quantity
 router.put("/update-quantity/:id", authenticateToken, async(req, res) => {
    try {
        const { id } = req.params;
        const { change } = req.body; // should be 1 or -1
        
        const book = await Book.findById(id);
        if(!book) return res.status(404).json({ message: "Book not found" });

        const newQuantity = (book.quantity || 0) + change;
        if(newQuantity < 0) return res.status(400).json({ message: "Quantity cannot be less than 0" });

        await Book.findByIdAndUpdate(id, { quantity: newQuantity });
        return res.status(200).json({ message: "Quantity updated successfully", quantity: newQuantity });
    } catch(error) {
        return res.status(500).json({ message: "Internal Server Issue" });
    }
 });
 //retreive All books
 router.get("/get-all-books",async(req,res)=>{
    try
    { const Books = await Book.find().sort({createdAt: -1});
    return res.json({
        status:"Success",
        data: Books,
    });

    }catch(error)
    {

        return res.status(500).json({ message: "Error occured "});
    }
 });
 //retreive recently added books
 router.get("/recent-added",async (req,res) => {
     try
    { const Books = await Book.find().sort({createdAt: -1}).limit(5);
    return res.json({
        status:"Success",
        data: Books,
    });

    }catch(error)
    {

        return res.status(500).json({ message: "Error occured "});
    }
 })

 //retreive book by id
 router.get("/book-id/:id",async(req,res)=>{
    try{
        const{id} = req.params;
        const books = await Book.findById(id);
        return res.json({
            status:"Success",
            data: books,

        });
    
    

    }catch(error)
    {

        return res.status(500).json({ message: "Error occured "});
    }
    });
 module.exports = router;