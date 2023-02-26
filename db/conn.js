const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const db = process.env.DATABASE;

mongoose.connect(db, { useNewUrlParser: true }).then(() => {
    console.log('connection to database successful');
}).catch((err) => { console.log('connection failed, error: ', err) });
