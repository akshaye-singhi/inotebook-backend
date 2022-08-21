const express = require('express')
const User = require('../models/User')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchuser = require('../middleware/fetchuser')
const JWT_SECRET = 'a_random_secret_code'

// ROUTE 1 : Create a User using : POST "/api/auth/createuser"
router.post(
    '/createuser',
    //array of validations
    [
        // name must be atleast 3 chars long
        body('name').isLength({ min: 3 }),
        // email must be valid
        body('email', 'Please enter a valid email').isEmail(),
        // password must be at least 5 chars long
        body('password', 'Password length must be atleast 5').isLength({ min: 5 })
    ],
    async (req, res) => {
        let success = false
        // If there are validation errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }
        try {
            // Check whether a user with this email exists already
            let user = await User.findOne({ email: req.body.email })
            if (user) {
                return res.status(400).json({ success, error: "Sorry, a user with this email already exists" })
            }

            //hashing and salting the password
            const salt = await bcrypt.genSalt(10)
            const secure_password = await bcrypt.hash(req.body.password, salt)

            // User.create() is equivalent to <new User() + user.save()>
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secure_password,
            })

            const payload_data = {
                user : {
                    id : user.id
                }
            }
            const auth_token = jwt.sign(payload_data, JWT_SECRET)
            success = true
            res.json({success, auth_token})
        }
        // If some unknown error occurs, it will be caught here 
        catch (error) {
            console.log(error.message)
            res.status(500).send("Internal Server Error")
        }
    }
);

// ROUTE 2 : Authenticate a User using : POST "/api/auth/login"
router.post(
    '/login',
    //array of validations
    [
        // email must be valid
        body('email', 'Please enter a valid email').isEmail(),
        // password must be at least 5 chars long
        body('password', 'Password cannot be blank').exists()
    ],
    async (req, res) => {
        let success = false
        // If there are validation errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() })
        }
        try {
            // Checking if email entered is valid or not
            let user = await User.findOne({ email: req.body.email })
            if (!user) {
                return res.status(400).json({ success, error: "Invalid email" })
            }

            // Checking if password entered is correct or not
            const password_compare = await bcrypt.compare(req.body.password, user.password)
            if(!password_compare){
                return res.status(400).json({ success, error: "Invalid password" })
            }

            const payload_data = {
                user : {
                    id : user.id
                }
            }
            const auth_token = jwt.sign(payload_data, JWT_SECRET)
            success = true
            res.json({success, auth_token})
        }
        // If some unknown error occurs, it will be caught here 
        catch (error) {
            console.log(error.message)
            res.status(500).send("Internal Server Error")
        }
    }
);

// ROUTE 3 : Authenticate a User using : POST "/api/auth/getuser"
router.post(
    '/getuser',
    fetchuser,
    async (req, res) => {
        try {
            const user_details = await User.findById(req.user.id).select('-password')
            res.json({success: true, user_details})
        } catch (error) {
            res.status(500).send('Internal Server Error')
        }
    }
);

module.exports = router