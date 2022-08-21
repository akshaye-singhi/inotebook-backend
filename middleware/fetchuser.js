
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const JWT_SECRET = 'a_random_secret_code'

//extracts user from auth-token
const fetchuser = async (req, res, next) => {
    const success = false
    const token = req.headers["auth-token"]
    if(!token){
        return res.status(401).json({ success, error: "Please send an auth-token in the headers" })
    }
    try {
        const payload_data = jwt.verify(token, JWT_SECRET)
        user = await User.findById(payload_data.user.id)
        if(!user){
            return res.status(401).json({ success, error: "Invalid auth-token" })
        }
        req.user = payload_data.user
        next()
    } catch (error) {
        res.status(401).json({ success, error: "Invalid auth-token" })
    }
}

module.exports = fetchuser