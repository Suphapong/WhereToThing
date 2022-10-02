const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    dateLog:{
        type:String,
        default:Date
    },
    email: {
        type: String,
        required: [true]
    },
    message: {
        type: String,
    },
});

const LogData = mongoose.model("LogData",UserSchema);
module.exports = LogData;