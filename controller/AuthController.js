import { hashPassword, comparePassword } from "../helper/authHelper.js";
import userModel from "../models/userModel.js";
import jsonwebtoken from "jsonwebtoken";

// registre controller
export const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send({
                success: false,
                message: 'All field is required'
            })
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: 'user already exist'
            })

        }

        // hash
        const hashedPassword = await hashPassword(password);
        const user = new userModel({
            name,
            email,
            password: hashedPassword,
        })
        await user.save();

        res.status(2001).send({
            success: true,
            message: "user registered successfully"
        })

    } catch (error) {
        console.error('error during register')
    }
}

// login
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validate 
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: 'All field is required'
            })
        }

        // check email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).send({
                success: false,
                message: 'email is not registered'
            })
        }

        //compare pass
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(404).send({
                success: false,
                message: 'invalid password'
            })
        }
        // token
        console.log(user)
        const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRETKEY, { expiresIn: '1d' })
        res.status(200).send({
            success: true,
            message: 'Login successfully',
            user: {
                name: user.name,
                email: user.email
            },
            token
        })


    } catch (error) {
        console.error('error during login:', error)
        res.status(500).send({
            success: false,
            message: 'server error during login'
        });

    }
};