const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        trim: true,
    },
    courseDescription: {
        type: String,
        required: true,
        trim: true,
    },
    language: {
        type: String,
        required: true,
        enum: ["English", "Hinglish"]
    },
    whatYouWillLearn: {
        type: String,
        required: true,
    },
    totalStudentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    price: {
        type: Number,
        required: true,
    },
    sections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
    }],
    instructor: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],
    thumbnailUrl: {
        type: String,
        required: true,
    },
    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReview",
        }
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    tags : {
        type : [String]
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    status :{
        type : String,
        enum : ["Draft","Published"]
    },
    instructions : {
        type : [String]
    }
});

module.exports = mongoose.model("Course", courseSchema);