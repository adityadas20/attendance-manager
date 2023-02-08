const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://rococo-pie-54d1e4.netlify.app");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(cors({ origin: 'https://rococo-pie-54d1e4.netlify.app', credentials: true }));
// app.use(cors({ origin: 'http://localhost:3001', credentials: true }));



dotenv.config({ path: './config.env' });
require('./db/conn');
// const User = require('./model/userSchema');
app.use(express.json());

// we link the router files to make our route easy
app.use(require('./router/auth'));

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
}

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})

