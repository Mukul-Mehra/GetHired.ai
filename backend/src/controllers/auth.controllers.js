import UserModel from "../models/user.model.js"
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"
import blacklistModel from "../models/blacklist.model.js";
import { getGeminiModel } from "../services/gemini.js"

const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
};

/**
 * @name registerUserController
 * @description register a new user expects username , email, password
 * @access Public
 */

export const registerUserController = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT_SECRET is missing on server" });
        }

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "please provide the missing field"
            })
        }
        const user = await UserModel.findOne({
            $or: [{ username }, { email }]
        })
        if (user) {
            return res.status(400).json({
                message: "Account already exists with this username or email"
            })
        }

        const hashedPass = await bcrypt.hash(password, 10)
        const newUser = await UserModel.create({
            username,
            email,
            password: hashedPass
        })
        const token = jwt.sign({
            id: newUser._id,
            username: newUser.username
        }, process.env.JWT_SECRET, { expiresIn: "1d" })

        res.cookie("token", token, cookieOptions)
        return res.status(201).json({
            message: "User Registered Successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                createdAt: newUser.createdAt,
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
}

/**
 * @name loginUserController
 * @description login a new user expects username , email, password
 * @access Public
 */

export const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT_SECRET is missing on server" });
        }
        const existUser = await UserModel.findOne({ email })
        if (!existUser) {
            return res.status(401).json({
                message: "Invalid Username or Password"
            })
        }
        const isPassValid = await bcrypt.compare(password, existUser.password)
        if (!isPassValid) {
            return res.status(401).json({
                message: "Invalid Password"
            })
        }
        const token = jwt.sign({
            id: existUser._id,
            username: existUser.username
        }, process.env.JWT_SECRET, { expiresIn: "1d" })
        res.cookie("token", token, cookieOptions)

        return res.status(200).json({
            message: "User LoggedIn Successfully",
            user: {
                id: existUser._id,
                username: existUser.username,
                email: existUser.email,
                createdAt: existUser.createdAt,
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
}

/**
 * @name logoutUserController
 * @description logout a user and add token to blacklist
 * @access Private
 */

export const logoutUserController = async (req, res) => {
    try {
        const token = req.cookies.token
        if (token) {
            await blacklistModel.create({ token });
        }
        res.clearCookie("token", cookieOptions)
        return res.status(200).json({
            message: "User LoggedOut Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Logout failed",
            error: error.message
        });
    }
}


export const profileController = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({
            message: "User Profile",
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message
        });
    }
}

export const chatController = async (req, res) => { 
    try {
        const { message } = req.body || {};
        if (!message || typeof message !== "string") {
            return res.status(400).json({
                error: "message is required and must be a string"
            });
        }

        const model = getGeminiModel();
        const result = await model.generateContent(message);
        const response = result.response;

        return res.status(200).json({
            reply: response.text(),
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
}

