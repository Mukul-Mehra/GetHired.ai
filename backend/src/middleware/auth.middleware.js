import jwt from "jsonwebtoken";
import blacklistModel from "../models/blacklist.model.js"; 

async function authMiddleware(req, res, next) {
    const token = req.cookies?.token
    if (!token) {
        return res.status(401).json({
            message: "token not found"
        })
    }

    const isTokenBlacklisted = await blacklistModel.findOne({ token })
    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "Token is invalid"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        return next()
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}
export default authMiddleware
