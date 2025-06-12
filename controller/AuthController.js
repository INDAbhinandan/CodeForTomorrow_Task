import { hashPassword, comparePassword } from "../helper/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from 'jsonwebtoken'

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

        // Validate input
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Check email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Email not registered'
            });
        }

        // Compare password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: 'Invalid password'
            });
        }

        // Generate token
        const token = JWT.sign({ id: user?._id }, process.env.JWT_SECRETKEY, { expiresIn: '7d' });

        res.status(200).send({
            success: true,
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                address: user.address,
                phone: user.phone,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({
            success: false,
            message: 'Server error during login'
        });
    }
};



// Forget Password


export const forgetPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;

        // Validate inputs
        if (!email || !answer || !newPassword) {
            return res.status(400).send({
                success: false,
                message: "Email, answer, and new password are required",
            });
        }

        // Check if user exists and the answer matches
        const user = await userModel.findOne({ email, answer });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Incorrect email or answer",
            });
        }

        // Hash new password and update it
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });

        return res.status(200).send({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        console.error("Error while accessing forget password:", error);
        return res.status(500).send({
            success: false,
            message: "Something went wrong",
            error,
        });
    }
};