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

app.get("/", (req, res) => {
  res.send("API Server Running");
});


app.listen(3000, ()=>{
    console.log("Sever is running on port: 3000");
});