import UserModel from "../models/user.model.js"
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"
import blacklistModel from "../models/blacklist.model.js";

/**
 * @name registerUserController
 * @description register a new user expects username , email, password
 * @access Public
 */

export const registerUserController = async (req, res) => {
    const { username, email, password } = req.body

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

    res.cookie("token", token)
    res.status(201).json({
        message: "User Registered Successfully",
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        }
    })

}

/**
 * @name loginUserController
 * @description login a new user expects username , email, password
 * @access Public
 */

export const loginUserController = async (req, res) => {
    const { email, password } = req.body
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
    res.cookie("token", token)

    res.status(200).json({
        message: "User LoggedIn Successfully",
        user: {
            id: existUser._id,
            username: existUser.username,
            email: existUser.email
        }
    })


}

/**
 * @name logoutUserController
 * @description logout a user and add token to blacklist
 * @access Private
 */

export const logoutUserController = async (req, res) => {
    const token = req.cookies.token
    if (token) {
        await blacklistModel.create({ token });
    }
    res.clearCookie("token")
    res.status(200).json({
        message: "User LoggedOut Successfully"
    })
}


export const profileController = async (req, res) => {
    const user = await UserModel.findById(req.user.id)
    res.json({
        message: "User Profile",
        id: user._id,
        username: user.username,
        email: user.email
    })
}