const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
require("dotenv").config();
require("./database/connect");
const user = require("./routes/user");
const books = require("./routes/books")
const fav = require("./routes/fav")
const cart = require("./routes/cart")
const order = require("./routes/order")
const profile = require("./routes/profile")
app.use(cors());


app.use("/api/v1",user);
app.use("/api/v1",books);
app.use("/api/v1",fav );
app.use("/api/v1",cart );
app.use("/api/v1",order);
app.use("/api/v1",profile)

//app.use("api/v1",books);
const PORT=process.env.PORT;

app.listen(process.env.PORT,()=>{
    console.log(`Server Started at ${PORT}`);
});

