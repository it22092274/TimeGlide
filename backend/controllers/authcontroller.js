const User = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { transporter } = require('../service/emailservice');
const cryptoRandomString = require('crypto-random-string');
const Auth = require('../models/otpmodel');

const register = async (req, res) => {

    //setup deeafult board//
    const { name, email, password } = req.body;
    try {
        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '90d' }
        );

        // Return token as response
        return res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ message: "User does not exist" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '90d' }
        );

        // Return token as response
        return res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};


const forgotpassword = async (req, res) => {
    const { email } = req.body;
    try {
        // Generate OTP
        const otp = cryptoRandomString({ length: 6, type: 'numeric' });

        // Save OTP to database
        const newAuth = new Auth({
            email,
            otp
        });
        await newAuth.save();

        // Send OTP via email
        await transporter.sendMail({
            from: 'vihanganethusara00@gmail.com',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`,
            html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>`
        });

        // Return success response to frontend
        return res.status(200).json({ message: 'OTP sent successfully.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};


const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        // Find the latest OTP record for the given email
        const auth = await Auth.findOne({ email }).sort({ createdAt: -1 });

        if (!auth) {
            return res.status(401).json({ message: "OTP expired or invalid" });
        }

        // Compare OTP
        const isVerified = (otp === auth.otp);

        if (isVerified) {
            return res.status(200).json({ message: "OTP verified successfully" });
        } else {
            return res.status(401).json({ message: "OTP expired or invalid" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};


const resetPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "No account exists with this email" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user's password
        await User.findByIdAndUpdate(existingUser._id, { password: hashedPassword });

        // Generate new JWT token
        const token = jwt.sign(
            { userId: existingUser._id, email: existingUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '90d' }
        );

        // Return token as response
        return res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

const profile = async (req, res ) => {
    const {name, password}= req.body
    const {_id} = req.params
    try{

        const hashedpassword = await bcrypt.hash(password, 10)
        await User.findByIdAndUpdate(
            _id,
            {
                name,
                password: hashedpassword,
            }
        )

        return res.status(201).json({message : 'profile updated'})
    }catch (error) {
        console.error(error)
    }
}

module.exports = { login,register,forgotpassword, verifyOTP , resetPassword, profile };
