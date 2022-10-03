const mongoose = require('mongoose')


const ReportSchema = new mongoose.Schema({
    date:{
        type:String,
        default:Date
    },
    type: {
        type: String,
        required: [true]
    },
    topic: {
        type: String,
        required: [true]
    },
    writer: {
        type: String,
        required: [true]
    },
    description: {
        type: String,
        required: [true]
    },
    location: {
        type: String,
    },
    status: {
        type: Boolean,
    },

});

const ReportData = mongoose.model("ReportData",ReportSchema);
module.exports = ReportData;