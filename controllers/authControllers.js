const jwt = require("jsonwebtoken");
const User = require("../models/user");
module.exports = {
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const result = await User({ username, email, password });
            await result.save();
            res.status(200).json("Successfully registered!")
        } catch (e) {
            res.status(500).json(e.message)
        }
    },
    login: async (req, res) => {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username: username })
            if (!username || !password) return res.status(401).json("credential should be required!");
            if(user == null) return res.status(401).json("Can't find your credentials!")
            if (user.username !== username) return res.status(401).json("Invalid username");
            if (user.password !== password) return res.status(401).json("Invalid password");
            const token = jwt.sign({_id:user._id}, process.env.secret_key,{expiresIn:'1h'});
            res.status(200).json({ token,expiresIn:"1h", message: "Successfully logged!" })
        } catch (e) {
            console.log(e);
            res.status(500).json(e)
        }
    }
}