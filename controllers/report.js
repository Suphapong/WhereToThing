const Report = require('../models/Report');


exports.addReport = async (req, res, next) => {
    const {topic,type,writer,description,location,status} = req.body;
    console.log("req.body : ", req.body)
    try {
        const log = await Report.create({
            date:Date.now(),
            type,
            topic,
            writer,
            description,
            location,
            status,
        });
        res.status(201).json({success:true,data:"Sent"})
    } catch (error) {
        next(error);
    }
};

exports.getReport = async (req, res, next) => {
    //console.log("req :", req.user);
    try {
        const filter = {};
        Report.find(filter, function (err,report){
            if(err){
                next(new ErrorResponse("Couldn't get data from server", 500));
            }else{
                //console.log(log);
                return res.status(200).json(report)
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