import express from "express";
import { registerController, loginController } from "../controller/AuthController.js";




const router = express.Router()


// routing
router.post('/register', registerController)
router.get('/login', loginController)


export default router