const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(cors({ origin: '*', credentials: true }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://imaginative-mousse-3be478.netlify.app/");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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

