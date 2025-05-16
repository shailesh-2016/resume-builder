const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;

const userRoute=require("./routes/userRoute")
const resumeRoute=require("./routes/resumeRoute")

/// mongo db
const db = require("./config/db");
db();

///use
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//api
app.use("/api/auth",userRoute)
app.use("/api/resume",resumeRoute)

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`));
