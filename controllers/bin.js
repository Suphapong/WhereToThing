const Bin = require('../models/Bin')


exports.addBin = async (req, res, next) => {
    const {type,lat,long,location,schedule} = req.body;
    console.log("req.body : ", req.body)
    try {
        const bin = await Bin.create({
            date:Date.now(),
            type,
            lat,
            long,
            location,
            schedule
        });
        res.status(201).json({success:true,data:"Sent"})
    } catch (error) {
        next(error);
    }
};

exports.getBin = async (req, res, next) => {
    //console.log("req :", req.user);
    try {
        const filter = {};
        Bin.find(filter, function (err,bin){
            if(err){
                next(new ErrorResponse("Couldn't get Bin data from server", 500));
            }else{
                //console.log(log);
                return res.status(200).json(bin)
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteBin = async (req, res, next) => {
    console.log("req.del:",req.body);
    try {
        const bin = await Bin.findByIdAndDelete(req.body.id, (err,docs)=>{
            if (err){
                console.log(err)
            }
            else{
                console.log("Bin Deleted: ", docs);
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
