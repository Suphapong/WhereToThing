const crypto = require('crypto');
const User = require('../models/User');
const ErrorResponse = require("../utils/errorResponse")
const sendEmail = require('../utils/sendEmail');
const axios = require('axios');
const Logging = require('../models/Logging');

exports.register = async (req, res, next) => {
    const {username, email, password} = req.body;

    try {
        const user = await User.create({
            username, 
            email, 
            password,
            role: "user",
            lastChangePassword: Date.now(),
        });
        sendToken(user, 200, res);
        //reportRegister(username,email);
        logReportEmail(email,`${username} has registered.`);
        
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    
    if(!email || !password){ 
        return next(new ErrorResponse("Please provide an email and password", 400))
    }

    try {   
        const user = await User.findOne({ email }).select("+password");
        if(!user) {
            logReportEmail(email,'Invalid Email Address.');
            return next(new ErrorResponse("Email Or Password Incorrect", 401))
        }

        const isMatch = await user.matchPasswords(password);
        
        if (!isMatch) {
            logReportEmail(email,'Trying to attempt login access.');
            return next(new ErrorResponse("Email Or Password Incorrect", 401));
        }
        console.log('lC',user.lastChangePassword.getTime());
        console.log('Date',(Date.now()));
        let dayChange = ((Date.now()-user.lastChangePassword) / 86400000)
        console.log("DS:",dayChange)
        console.log("Datenow-last = ",Date.now()-user.lastChangePassword);
    
        if (dayChange >= 90){
            console.log('OK : ',dayChange);
            return res.status(200).json({
                success: true,
                message: 'Detect90DayChange',
            });
        }

        sendToken(user, 200, res);
        logReportEmail(email,"Login Successfully");
        

    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message,
        });
        
    }

    //res.send("Login Route");
};

exports.forgotpassword = async (req, res, next) => {
    const { email } = req.body;
    console.log('EEE: ',email);

    try {
        const user = await User.findOne({email});
        
        if(!user){
            return next(new ErrorResponse("Email could not be sent"));
        }

        const resetToken = user.getResetPasswordToken();

        await user.save();

        // Create reset url to email to provided email
        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

        // HTML Message
        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please make a put request to the following link:</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `;  
        
        try {
            console.log("user.email ",user.email);
            await sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                text: message
            });

            res.status(200).json({success: true, data: "Email Sent"})
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();
            console.log(error);
            return next(new ErrorResponse("Email could not be send", 500))
        }

    } catch (error) {
        next(error);
    }
};

exports.resetpassword = async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resetToken)
        .digest("hex");
    
    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now()},
        });


        if(!user) {
            return next(new ErrorResponse("Invalid Reset Token", 400))
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        user.lastChangePassword = Date.now();

        await user.save();
        reportResetPassword(user);
        res.status(201).json({
            success: true,
            data: "Password Reset Success"
        })
    } catch (error) {
        next(error)
    }
};

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({success: true, token})
}

exports.captcha = async (req, res, next) => {
    //Destructuring response token from request body
    const {token} = req.body;
    //console.log("token ",token);
    if (token != "") {
       await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.REACT_APP_SECRET_KEY}&response=${token}`);

    //check response status and send back to the client-side
        if (res.status(200)) {
            res.send("Human 👨 👩");
        }else{
            res.send("Robot 🤖");
        } 
    }
}


const logReportEmail = async(email,message) => {
    console.log(message);
    try {
        const dateNow = Date.now()
        const options = {weekday:'long',day: 'numeric',month: 'short',year: 'numeric',hour:'numeric',minute:'numeric',timeZone:'Asia/Jakarta',timeZoneName:'short'};
        event2 = `${message} (${ new Date(dateNow).toLocaleString('en-US',options)})`
        console.log(event2);
        await Logging.create({
            email:email,
            message:event2,
        });
        console.log("test2");
    } catch (error) {
        return (new ErrorResponse("Server Error", 500))
    }
}

const reportRegister = async(username,email) => {
    console.log("FailedLogin");
    try {
        const dateNow = Date.now()
        const options = {weekday:'long',day: 'numeric',month: 'short',year: 'numeric',hour:'numeric',minute:'numeric',timeZone:'Asia/Jakarta',timeZoneName:'short'};
        event2 = `${username} has registered. (${new Date(dateNow).toLocaleString('en-US',options)})`
        console.log(event2);
        await Logging.create({
            dateLog:Date.now(),
            email:email,
            message:event2,
        });
        console.log("test2");
    } catch (error) {
        return (new ErrorResponse("Server Error", 500))
    }
}

const reportResetPassword = async(username) => {

    console.log("FailedLogin");
    try {
        const dateNow = Date.now()
        const options = {weekday:'long',day: 'numeric',month: 'short',year: 'numeric',hour:'numeric',minute:'numeric',timeZone:'Asia/Jakarta',timeZoneName:'short'};
        event2 = `${username} has registered. (${new Date(dateNow).toLocaleString('en-US',options)})`
        console.log(event2);
        await Logging.create({
            dateLog:Date.now(),
            email:email,
            message:event2,
        });
        console.log("test2");
    } catch (error) {
        return (new ErrorResponse("Server Error", 500))
    }
}


