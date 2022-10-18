const mongoose = require('mongoose')


const BinSchema = new mongoose.Schema({
    date:{
        type:String,
        default:Date
    },
    type: {
        type: String,
        required: [true]
    },
    lat: {
        type: String,
        required: [true]
    },
    long: {
        type: String,
        required: [true]
    },
    location: {
        type: String,
    },
    schedule: {
        type: String,
    }
});

const BinData = mongoose.model("BinData",BinSchema);
module.exports = BinData;