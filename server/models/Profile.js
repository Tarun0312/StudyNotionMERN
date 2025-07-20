const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    dateOfBirth : {
        type : String,
    },
    about : {
        type : String,
        trim : true,
    },
    profession : {
        type : String,
        trim:true
    },
    gender : {
        type : String,
        maxLength : 10,
        trim : true,
        // required : true
    }
});

module.exports = mongoose.model("Profile",profileSchema);
