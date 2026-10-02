const jwt = require("jsonwebtoken")

function authMiddleware(req, res, next) {

    const tokenAvailable = req.headers.authorization

    console.log("Authorization Header:", tokenAvailable)

    if (!tokenAvailable) {
        return res.status(401).json({
            msg: "token not available"
        })
    }

    if (!tokenAvailable.startsWith("Bearer ")) {
        return res.status(401).json({
            msg: "Bearer token required"
        })
    }

    const realtoken = tokenAvailable.split(" ")[1]

    console.log("Real Token:", realtoken)
    console.log("JWT SECRET:", process.env.JWT_SECRET)

    try {

        const decoded = jwt.verify(
            realtoken,
            process.env.JWT_SECRET
        )

        console.log("Decoded Token:", decoded)

        req.user = decoded

        next()

    } catch (e) {

        console.log("JWT ERROR:", e.message)

        return res.status(401).json({
            msg: "invalid tokens"
        })
    }
}

module.exports = authMiddleware