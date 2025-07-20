const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
   categoryName: {
      type: String,
      required: true,
      trim: true,
   },
   categoryDescription: {
      type: String,
      trim: true
   },
   courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
   }]
});

// 1 course -> 1 category (acc to course model)
// 1 category -> for multiple courses ((acc to category model))
// means suppose web dev course (mern)- category (js)
//js category for only js course,node js course,web dev course
//we cannot multiple category for multiple courses

module.exports = mongoose.model("Category", categorySchema);
