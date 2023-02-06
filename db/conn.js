const mongoose = require('mongoose')
const db = process.env.DATABASE;

mongoose.connect(db).then(() => {
    console.log('connection to database successful');
}).catch((err) => console.log('connection failed, bcoz of: ', err));
