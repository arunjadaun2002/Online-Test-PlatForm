const express = require("express");
require("dotenv").config;
require("./configs/database");
const app = express();
const cors = require("cors");
app.use(cors({ origin: "http://localhost:5173" }));

//Middlewares
app.use(cors());
app.use(express.json());


// Routes
app.get("/", (req, res) => {
    res.send("Server is running")
})


// Routes
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');

app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/test', testRoutes)


const PORT = process.env.PORT || 3000;


app.listen(PORT, ()=>{
    console.log(`Server is started in ${PORT}`)
})
