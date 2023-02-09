const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const app = express();

app.use(cookieParser());

app.use(function (req, res, next) { // necessary headers to be set for successful deployment
    res.header("Access-Control-Allow-Origin", "https://jocular-kheer-40a74d.netlify.app");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(cors({ origin: 'https://jocular-kheer-40a74d.netlify.app', credentials: true })); // cors origin set
// app.use(cors({ origin: 'http://localhost:3001', credentials: true }));

app.use(express.json());

// we link the router files to make our route easy
app.use(require('./router/auth'));

dotenv.config({ path: './config.env' });
require('./db/conn');



const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
}

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})

