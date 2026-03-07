const router = require("express").Router();
const User = require("../database/user");
//npm i bcrypt
const bycrypt = require("bcryptjs");
//npm i jsonwebtoken
const jwt = require("jsonwebtoken");

const {authenticateToken} = require("./userAuth");

//sign-up
router.post("/sign-up", async (req, res) => {
    
    try {
        //taking from user that is the request body
        const { username, email, address, password } = req.body;

        if (username.length < 8) {
            return res.status(400).json({ message: "User name should be greater than 8" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password length should be greater than 8" });
        }

        //hashing the password
        const hashPass = await bycrypt.hash(password,10);// means  times hashing

        //1st is the name of the schema 2nd is the name of the value
        const newUser = new User({
            username: username,
            email: email,

            address: address,
            pass: hashPass
        });

        await newUser.save();
        return res.status(200).json({ message: "Signed in successfully" });

    } catch (error) {
        console.error("Signup error:", error);  // helpful debug log
        res.status(500).json({ message: "Internal Server Issue" });
    }
});

//sign-in
router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Check if user exists
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: "User does not exist" });
        }

        // 2. Compare Password (USING AWAIT, NOT CALLBACK)
        // This is the clean, modern way to handle bcrypt
        const isPasswordMatch = await bycrypt.compare(password, existingUser.pass);
        
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // 3. Create Token Payload
        // Suggestion: Don't put claims in an array. Put them directly in the object.
        // It makes accessing them in middleware easier (req.user.role vs req.user.authClaims[0].role)
        const authClaims = {
            name: existingUser.name,
            role: existingUser.role
        };

        // 4. Generate Token
        // CRITICAL: Ensure "SecretKey" matches your middleware EXACTLY.
        // Ideally, use process.env.SECRET_KEY in both places.
        const token = jwt.sign(authClaims, "SecretKey", { expiresIn: "30d" });

        return res.status(200).json({ 
            id: existingUser._id, 
            role: existingUser.role, 
            token: token 
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Issue" });
    }
});

//get-info
router.get("/get-information",async(req,res)=>{
    try{
        //id will be given input
        const {id} = req.headers;
        //fetching from db 
        const data = await User.findById(id).select('-pass');
        return res.status(200).json(data);

    }catch(err)
    {
         res.status(500).json({ message: "Internal Server Issue" });
    }
})

//update-address
router.put("/update-address", authenticateToken,async(req,res)=>{
    try{
        const {id} = req.headers;
        const{Newaddress} = req.body;
        await User.findByIdAndUpdate(id,{address:Newaddress});
        return res.status(200).json({messsage :"Adrress updated successfully"});


    }catch(err)
    {
        res.status(500).json({ message: "Internal Server Issue" });
    }
})
    
module.exports = router;
