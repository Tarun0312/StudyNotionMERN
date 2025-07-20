const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName : {
    type : String,
    required : true,
    trim : true,
  },
  lastName : {
    type : String,
    required : true,
    trim : true,
  },
  email :{
    type : String,
    required : true,
    trim : true,
  },
  password : {
    type : String,
    required : true,
  },
  accountType : {
    type : String,
    enum : ["Student","Instructor","Admin"],
    required : true,
  },
  imageUrl : {
    type : String,
  },
  contactNumber : {
    type : Number,
    required : true,
    minLength : 10,
    maxLength : 10
  }
,
  courses : [
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Course",
    }
],
  courseProgress : [
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : "CourseProgress",
    }
],
  additionalDetails : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Profile",
    required : true
  },
  resetPasswordToken : {
    type : String
  },
  resetPasswordExpires : {
    type : Date
  },
  // active : {
  //   type : Boolean,
  //   required : true
  // },
  approved : {
    type : Boolean,
    required  : true
  }
  

},  {timestamps : true} //add timestamps for when the document is created and last modified
);

module.exports = mongoose.model("User",userSchema);