const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    subjects: [{
        name: { type: String },
        present: { type: Number },
        absent: { type: Number },
        presentDates: [{ type: String }],
        absentDates: [{ type: String }]
    }],
    attendanceGoal: {
        type: Number
    }
})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 12); // password is hashed
    }
    next(); // middleware's job is done, proceed to next
})
userSchema.methods.generateAuthToken = async function () { // to generate a unnique token for every user
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save(); // saving in database
        return token;
    } catch (err) {
        console.log(err);
    }
}

const User = mongoose.model('USER', userSchema);
module.exports = User;