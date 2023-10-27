require("dotenv").config();
const db = require("./config/connection");
const indexRouter = require("./routes/index");
const express = require("express");
const app = express();
//db connection
db.connectDb();


app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use("/",indexRouter);
app.use((req,res,next)=>{
    res.status(404).json("Page not found")
})

const port = process.env.port || 5000
app.listen(port,()=>{
    console.log(`Server's running on port ${port}`);
})