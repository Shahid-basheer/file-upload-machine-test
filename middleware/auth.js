const jwt = require("jsonwebtoken");
module.exports = {
    authRequire: (req, res, next) => {
        try {
            const token = req.headers['authorization']?.split(" ")[1];
            if(!token) return res.status(401).json("Token's required");
            const verify = jwt.verify(token, process.env.secret_key)
            if (!verify) return res.status(401).json("Invalid token")
            req.userId = verify._id
            next()
        } catch (e) {
            res.status(401).json(e);
        }
    }
}