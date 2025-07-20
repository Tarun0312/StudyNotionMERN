const mongoose = require("mongoose");

const ratingAndReviewSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    rating : {
        type : Number,
        minLength : 1,
        maxLength : 1,
        required : true
    },
    review : {
        type : String,
        maxLength : 500,
        required : true
    },
    courseId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Course",
        required : true
    }
});

module.exports = mongoose.model("RatingAndReview",ratingAndReviewSchema);