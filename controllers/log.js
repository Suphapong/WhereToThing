const Logging = require('../models/Logging');


exports.addLog = async (req, res, next) => {
    const {email,message} = req.body;
    console.log("req.body : ", req.body)
    try {
        const log = await Logging.create({
            dateLog:Date.now(),
            email,
            message,
        });
        res.status(201).json({success:true,data:"Sent"})
    } catch (error) {
        next(error);
    }
};

exports.getLog = async (req, res, next) => {
    console.log("req :", req.user);
    try {
        const filter = {};
        Logging.find(filter, function (err,log){
            if(err){
                next(new ErrorResponse("Couldn't get data from server", 500));
            }else{
                //console.log(log);
                return res.status(200).json(log)
            }
        });
    } catch (error) {
        next(error);
    }
};

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({success: true, token})
}