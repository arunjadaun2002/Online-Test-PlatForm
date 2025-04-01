const express = require("express");
require("./configs/database");
const app = express();
const cors = require 
require("dotenv").config;


const PORT = process.env.PORT || 3000;


app.listen(PORT, ()=>{
    console.log(`Server is started in ${PORT}`)
})
