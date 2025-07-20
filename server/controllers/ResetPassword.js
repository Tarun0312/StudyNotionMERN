const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mailSender = require("../utils/mailSender");
const passwordReset = require("../mail/templates/passwordResetMail");

//Reset Password token
exports.resetPasswordToken = async (req,res) => {
    try{
        //fetch email from req.body
        const email = req.body.email;

        //Validations on email
        if(!email){
            return res.status(400).json({
                success : false,
                message : "Provide email for resetting the password"
            });
        }

        //check user exist or not
        const userExist = await User.findOne({email});

        if(!userExist){
            return res.status(401).json({
                success : false,
                message : "Email is not registered with us.Provide registered email for resetting the password"
            })
        }

        //Generate Token (bcoz for every user -> token different (every time we need different token))
        const token = crypto.randomUUID();

        //Updated user with token and expiry time of link(link of reset pwd needs to be expires in few minutes )
        const updatedUser = await User.findOneAndUpdate({email : email},
            {
                resetPasswordToken : token,
                resetPasswordExpires : Date.now() + 5 * 60 * 1000,
            },{new : true})

        //Generate Link
        const url = `http://localhost:4000/reset-password/${token}`;

        //send link in email
        await mailSender(email,"Password Reset Link",`Password Reset Link Generated : ${url}`);

        //return response
        return res.status(200).json({
            success : true,
            message : "Password Reset Link Sent Successfully",
            token
        })
    }catch(error){
        console.log("Something went wrong while sending reset password link : ",error.message)
        return res.status(500).json({
            success : false,
            message : "Something went wrong while sending reset password link",
            error : error.message
        })
    }
}

//Reset Password
exports.resetPassword = async (req,res) => {
    try{
        //fetch token & new pwd & confirm pwd from req.body
        const {token,newPassword,confirmPassword} = req.body;

        //perform validations
        if(!newPassword || !confirmPassword){
            return res.status(400).json({
                success : false,
                message : "All the fields are required"
            })
        }

        //check new and confirm pwd
        if(newPassword !== confirmPassword ){
            return res.status(401).json({
                success : false,
                message : "New Password and Confirm Password must be same"
            });
        }

        //use token to find entry of user from db and then update pwd
        const userExist = await User.findOne({resetPasswordToken : token});


        //if no entry ,it means token in not present in db,so wrong token
        if(!userExist){
            return res.status(401).json({
                success : false,
                message : "Invalid Token"
            })
        }

      
        //token time check
        const resetPasswordExpires = userExist.resetPasswordExpires;
        if(resetPasswordExpires < Date.now()){
            return res.status(401).json({
                success : false,
                message : "Token is expired ,please regenerate your token "
            })
        }

        //hashed password
        const hashedPassword = await bcrypt.hash(newPassword,10);
 
        //update pwd in db
        const updatedUser = await User.findOneAndUpdate({resetPasswordToken : token},
            {
                password : hashedPassword
            },  {new : true});
            console.log("3");
        
        //send mail for Password Reset Successfully
        await mailSender(updatedUser.email,"Password Reset Successfully",passwordReset(updatedUser.email,updatedUser.firstName,updatedUser.lastName));

        //return response
        return res.status(200).json({
            success : true,
            updatedUser,
            message : "Password Reset Successfully"
        })


    }catch(error){
        console.log("Password Reset Failed : ",error.message);
        return res.status(500).json({
            success : false,
            message : "Something went wrong while resetting the password"
        })
    }
}