const Report = require('../models/Report');


exports.addReport = async (req, res, next) => {
    const {topic,type,writer,description,location,status,position} = req.body;
    console.log("req.body : ", req.body)
    try {
        const log = await Report.create({
            date:Date.now(),
            type,
            topic,
            writer,
            description,
            location,
            status: !status ? '1': status,
            position,
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

exports.updateReportStatus = async (req, res, next) => {
    console.log("req.test:",req.body);
    try {
        const report = await Report.findByIdAndUpdate(req.body.id, {status: req.body.status}, (err,docs)=>{
            if (err){
                console.log(err)
            }
            else{
                console.log("Updated report: ", docs);
            }
        });

        if(!report) {
            return next(new ErrorResponse("Invalid Reset Token", 400))
        }

        res.status(201).json({
            success: true,
            data: "Update Report Status success"
        })
    } catch (error) {
        next(error)
    }
};

exports.deleteReport = async (req, res, next) => {
    console.log("req.del:",req.body);
    try {
        const report = await Report.findByIdAndDelete(req.body.id, (err,docs)=>{
            if (err){
                console.log(err)
            }
            else{
                console.log("Report Deleted: ", docs);
            }
        });

        if(!report) {
            return next(new ErrorResponse("Invalid Reset Token", 400))
        }

        res.status(201).json({
            success: true,
            data: "Update Report Status success"
        })
    } catch (error) {
        next(error)
    }
};



const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({success: true, token})
}