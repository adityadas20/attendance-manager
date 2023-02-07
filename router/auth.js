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
    const { name, password, cpassword } = req.body;
    if (!name || !password || !cpassword) {
        return res.status(422).json({ error: "filling every field is compulsory" })
    }
    if (password != cpassword)
        return res.status(400).json({ error: "password and confirm password fields do not match" })
    try {
        const userName = await User.findOne({ name: name })
        if (userName)
            return res.status(422).json({ error: "username already exists" })
        let attendanceGoal = 0
        const user = new User({ name, password, attendanceGoal });
        await user.save();
        res.status(201).json({ message: "user registered" });
    } catch (err) {
        console.log(err);
    }
})
router.post('/signin', async (req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password)
            return res.status(400).json({ error: "please enter both name and password!" });

        const userLogin = await User.findOne({ name: name });
        if (!userLogin)
            return res.status(400).json({ error: "invalid credentials" })


        const isMatch = await bcrypt.compareSync(password, userLogin.password)
        const token = await userLogin.generateAuthToken();
        // console.log(token);
        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 12946000000),
            domain: ".netlify.app",
            httpOnly: true
        })
        if (!isMatch)
            return res.status(400).json({ error: "invalid credentials" })

        res.json({ message: "user siginin successful" })
    } catch (err) {
        console.log(err);
    }
})
router.post('/updateSubject', async (req, res) => {
    try {
        const { name, subjectName, present, absent } = req.body;

        await User.findOneAndUpdate(
            { name: name, "subjects.name": subjectName },
            {
                $set: {
                    'subjects.$.present': present,
                    'subjects.$.absent': absent
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
                $push: {
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
                $pull: {
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
router.get('/about', authenticate, (req, res) => {
    res.send(req.rootUser);
});
router.get('/logout', (req, res) => {
    res.clearCookie('jwtoken');
    res.status(200).send('user logout');
});

module.exports = router;
