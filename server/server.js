require("dotenv").config();
const express = require("express");
const cor = require("cors");

const app = express();
app.use(cor());
app.use(express.json());

const authRoutes = require("./src/routes/authentication/authRoutes");
const postRoutes = require("./src/routes/upload/postRoutes");


app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);


app.listen(process.env.DB_PORT, ()=>{
    console.log("Sever is running on port: " + process.env.DB_PORT);
});