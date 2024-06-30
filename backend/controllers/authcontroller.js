const User = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//const { transporter } = require('../service/emailservice');
//const {cryptoRandomString} = require('crypto-random-string');
const Auth = require('../models/otpmodel');
const path = require('path');

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


const nodemailer = require('nodemailer');
const multer = require('multer');

const transporter =  nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user:'vihanganethusara00@gmail.com',
        pass: 'AVxbHhRFvjTPG8Eg'
    }
})

const forgotpassword = async (req, res) => {
    const { email } = req.body;
    try {
        // Dynamically import 'crypto-random-string'
        const cryptoRandomString = (await import('crypto-random-string')).default;

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
            from: 'dev.timeglide@gmail.com',
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
        console.log(auth, email, otp)
        // Check if OTP record exists
        if (!auth) {
            return res.status(401).json({ message: "OTP expired or invalid" });
        }

        // Compare OTP
        const isVerified = (otp === auth.otp);

        if (isVerified) {
            // Optionally delete the OTP record after successful verification
            await Auth.deleteOne({ _id: auth._id });

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


// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({ storage: storage });

  const profileUpdate = async (req, res) => {
    const { name, bio, phone, address, age, password } = req.body;
    const { id } = req.params;
  
    try {
      let updateFields = { name, bio, phone, address, age };
  
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateFields.password = hashedPassword;
      }
  
      if (req.file) {
        updateFields.profilePicture = `http://192.168.43.60:3000/uploads/${req.file.filename}`;
      }
  
      const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true });
  
      return res.status(200).json({ message: 'Profile updated successfully', data: updatedUser });
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

const profile = async (req, res ) => {
    const {email}= req.body
    try{

        const user = await User.findOne({email})
        console.log(user)
        
        return res.status(201).json({data : user})
    }catch (error) {
        console.error(error)
    }
}

const signout = async (req, res) => {
    const { email } = req.body;

    try {
        // Validate req.body.email if needed

        const user = await User.findOneAndDelete({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'Signout successful' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { login,register,forgotpassword,upload, signout , verifyOTP , resetPassword, profile,profileUpdate  };
