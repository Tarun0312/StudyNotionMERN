const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({
    subSectionName : {
        type : String,
        trim : true,
    },
    subSectionDescription : {
        type : String
    },
    timeDuration : {
        type : String,
    },
    videoUrl : {
        type : String
    }
});

module.exports = mongoose.model("SubSection",subSectionSchema);