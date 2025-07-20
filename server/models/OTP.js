const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailVerificationTemplate = require("../mail/templates/emailVerificationTemplate");

require("dotenv").config();

const otpSchema = new mongoose.Schema({
  email : {
    type : String,
    required : true,
    trim : true,
  },
  createdAt : {
    type : Date,
    default : Date.now(),
    expires : 5*60
  },
  otp : {
    type : String,
    required : true,
  }
});

//We have to send email before the signup entry in db ,so pre save middleware is used

//Flow     user details singup form-> otp in email-> user otp enter -> submit (all goes well )-> entry in db about user

// a function to send email
async function sendVerificationEmail(email,otp){
    try{

        const mailResponse = await mailSender(email,"Verification Email from Study Notion",emailVerificationTemplate(otp));
        console.log("Email Sent Successfully: ",mailResponse)

    }catch(error){
        console.log("Error occured while sending mail",error.message);
        throw error;
    }
}

//mail not send with arrow function
// arrow functions cannot be used as constructors. This is because arrow functions do not have their own bindings to this, arguments, or super. When an arrow function is called, it uses the this binding of the surrounding scope.

otpSchema.pre("save",async function (next) {
  //only send a mail when a new document is created
    if(this.isNew)
    await sendVerificationEmail(this.email,this.otp);

    next(); //find the reason for this
});

module.exports =  mongoose.model("OTP",otpSchema);