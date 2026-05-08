import { registerUserController, loginUserController,logoutUserController, profileController, chatController } from '../controllers/auth.controllers.js';
import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { validateBody } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema, chatSchema } from "../validators/auth.validators.js";
const authRouter = Router()

/**
 * @route POST /api/auth/regisiter
 * @description Register a new User
 * @access Public
 */

authRouter.post("/register", validateBody(registerSchema), registerUserController)


/**
 * @route POST /api/auth/login
 * @description login with email and password
 * @access Public 
*/

authRouter.post("/login", validateBody(loginSchema), loginUserController)

/**
 * @route POST /api/auth/logout
 * @description logout a user and add token to blacklist
 * @access Public 
*/

authRouter.get("/logout",logoutUserController)


/**
 * @route GET /api/auth/profile
 * @description Get user profile
 * @access Private
 */
authRouter.get("/profile",authMiddleware,profileController)
authRouter.post("/chat", authMiddleware, validateBody(chatSchema), chatController)

export default authRouter
