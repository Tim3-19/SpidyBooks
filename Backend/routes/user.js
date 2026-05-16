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
        const { username, email, address, password, role } = req.body;

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
            pass: hashPass,
            role: role || 'user'
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
        const authClaims = {
            name: existingUser.name,
            role: existingUser.role
        };

        // 4. Generate Token
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
//update-profile
router.put("/update-profile", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { username, email, address, avatar, password } = req.body;

        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prepare update object
        const updateData = {};

        if (username && username !== user.username) {
            if (username.length < 8) {
                return res.status(400).json({ message: "User name should be greater than 8" });
            }
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: "Username already exists" });
            }
            updateData.username = username;
        }

        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: "Email already exists" });
            }
            updateData.email = email;
        }

        if (address) {
            updateData.address = address;
        }

        if (avatar) {
            try {
                new URL(avatar);
                updateData.avatar = avatar;
            } catch (_) {
                return res.status(400).json({ message: "Invalid avatar URL" });
            }
        }

        let isPasswordUpdated = false;
        if (password) {
            if (password.length < 8) {
                return res.status(400).json({ message: "Password length should be greater than 8" });
            }
            const hashPass = await bycrypt.hash(password, 10);
            updateData.pass = hashPass;
            isPasswordUpdated = true;
        }

        await User.findByIdAndUpdate(id, updateData);

        return res.status(200).json({ 
            message: "Profile updated successfully", 
            passwordChanged: isPasswordUpdated 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Issue" });
    }
});
const Book = require("../database/book");
const Order = require("../database/order");

// Get all users (Admin only)
router.get("/get-all-users", authenticateToken, async (req, res) => {
    try {
        const users = await User.find().select("-pass").sort({ createdAt: -1 });
        return res.status(200).json({ status: "Success", data: users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Issue" });
    }
});

// Update user role (Admin only)
router.put("/update-role/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        await User.findByIdAndUpdate(id, { role });
        return res.status(200).json({ message: "User role updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Issue" });
    }
});

// Delete user (Admin only)
router.delete("/delete-user/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Issue" });
    }
});

// Admin Stats
router.get("/admin/stats", authenticateToken, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalBooks = await Book.countDocuments();
        const pendingOrdersCount = await Order.countDocuments({ orderstatus: "Order Placed" });

        // Calculate Revenue for Delivered orders
        const deliveredOrders = await Order.find({ orderstatus: "Delivered" }).populate("book");
        let totalRevenue = 0;
        deliveredOrders.forEach(order => {
            if (order.book && order.book.price) {
                totalRevenue += order.book.price * (order.quantity || 1);
            }
        });

        // Recent Activity
        const recentOrders = await Order.find().populate("user").populate("book").sort({ createdAt: -1 }).limit(5);
        const recentUsers = await User.find().select("-pass").sort({ createdAt: -1 }).limit(5);

        return res.status(200).json({
            status: "Success",
            data: {
                totalUsers,
                totalBooks,
                totalRevenue,
                pendingOrdersCount,
                recentOrders,
                recentUsers
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Issue" });
    }
});
const Settings = require("../database/settings");

// Get Global Settings (Public)
router.get("/settings", async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({ maintenanceMode: false });
            await settings.save();
        }
        return res.status(200).json({ status: "Success", data: settings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Issue" });
    }
});

// Update Maintenance Mode (Admin Only)
router.put("/settings/maintenance", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const adminUser = await User.findById(id);
        if (!adminUser || adminUser.role !== "admin") {
            return res.status(403).json({ message: "Access Denied" });
        }

        const { maintenanceMode } = req.body;
        
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({ maintenanceMode });
        } else {
            settings.maintenanceMode = maintenanceMode;
        }
        await settings.save();

        return res.status(200).json({ status: "Success", message: "Maintenance mode updated successfully", data: settings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Issue" });
    }
});

module.exports = router;
