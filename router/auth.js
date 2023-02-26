const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');

require('../db/conn');
const User = require('../model/userSchema')

router.get('/', (req, res) => {
    res.send('hello world from auth.js')
});
router.post('/register', async (req, res) => {
    const { name, password, cpassword } = req.body; // data attached with axios.post request
    if (!name || !password || !cpassword) {
        return res.status(422).json({ error: "filling every field is compulsory" })
    }

    if (password != cpassword)
        return res.status(400).json({ error: "password and confirm password fields do not match" })

    try {
        const userName = await User.findOne({ name: name })
        if (userName)
            return res.status(422).json({ error: "username already exists" })

        let attendanceGoal = 0; // default value of attendance
        const user = new User({ name, password, attendanceGoal }); // fetching details of user from database
        await user.save();

        res.status(201).json({ message: "user registered" });
    } catch (err) {
        console.log(err);
    }
})
router.post('/signin', async (req, res) => {
    try {
        const { name, password } = req.body; // data attached with axios.post request

        if (!name || !password)
            return res.status(400).json({ error: "please enter both name and password!" });

        const userLogin = await User.findOne({ name: name }); // fetching details of user from database
        if (!userLogin)
            return res.status(400).json({ error: "invalid credentials" })


        const isMatch = await bcrypt.compareSync(password, userLogin.password) //matching passwords
        const token = await userLogin.generateAuthToken(); //unique token generated for every user

        res.cookie("jwtoken", token, { // cookie set with the generated token
            expires: new Date(Date.now() + 12946000000), // expiry date set to 15 days, converted to millisecs
            domain: ".netlify.app", // allow domain to access cookies
            httpOnly: true // necessary field to deny access of cookies by js alone, eg, document.cookies won't work anymore
        })
        if (!isMatch)
            return res.status(400).json({ error: "invalid credentials" })

        res.json({ message: "user siginin successful", details: token })//send token to frontend as json
    } catch (err) {
        console.log(err);
    }
})
router.post('/updateSubject', async (req, res) => {
    try {
        const { name, subjectName, present, absent, subjectPresentDates, subjectAbsentDates } = req.body;

        await User.findOneAndUpdate(
            { name: name, "subjects.name": subjectName }, // find the specific subject of the specific user
            {
                $set: {
                    'subjects.$.present': present,
                    'subjects.$.absent': absent,
                    'subjects.$.presentDates': subjectPresentDates,
                    'subjects.$.absentDates': subjectAbsentDates
                }
            }
        )
        res.status(201).json({ message: "user details updated" });
    } catch (err) {
        console.log(err);
    }
})
router.post('/createSubject', async (req, res) => {
    try {
        const { name, subjectName, pre, abs } = req.body;
        await User.findOneAndUpdate(
            { name: name },
            {
                $push: { // $push creates a new entry in the database
                    "subjects": {
                        name: subjectName,
                        present: pre,
                        absent: abs
                    }
                }
            }
        )
        res.status(201).json({ message: "user subjects updated" });
    } catch (err) {
        console.log(err);
    }
})
router.post('/deleteSubject', async (req, res) => {
    try {
        const { name, subjectName } = req.body;

        await User.findOneAndUpdate(
            { name: name },
            {
                $pull: { // $ pull deletes an entry from the database
                    "subjects": {
                        name: subjectName
                    }
                }
            }
        )
        res.status(201).json({ message: "user subject deleted" });
    } catch (err) {
        console.log(err);
    }
})
router.post('/setGoal', async (req, res) => {
    try {
        const { name, newGoal } = req.body;

        await User.findOneAndUpdate(
            { name: name },
            {
                $set: {
                    'attendanceGoal': newGoal
                }
            }
        )
        res.status(201).json({ message: "user attendance goal updated" });
    }
    catch (err) {
        console.log(err);
    }
})
router.post('/about', authenticate, (req, res) => {
    res.send(req.rootUser);
});
router.get('/logout', (req, res) => {
    // res.clearCookie('jwtoken');
    res.status(200).send('user logout');
});

module.exports = router;
