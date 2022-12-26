const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts')

dotenv.config() 

//Connect to Database
mongoose.connect(process.env.DB_URI, () => 
    console.log('Connected to Databse')
);

//Middleware
app.use(express.json())


//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, ()=> console.log("Server running on port 3000"));