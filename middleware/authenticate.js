const jwt = require('jsonwebtoken');
const User = require('../model/userSchema')

const Authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;
        if (!token)
            throw new Error('couldnt find token')

        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        if (!verifyToken)
            throw new Error('couldnt verify token')

        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });
        if (!rootUser)
            throw new Error('User not found')

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();
    } catch (err) {
        res.status(401).send(err.message);
    }
}
module.exports = Authenticate;