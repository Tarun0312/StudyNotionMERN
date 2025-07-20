const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
const mailSender = require("../utils/mailSender");
const passwordUpdate = require("../mail/templates/passwordUpdateMail");

require("dotenv").config();

//sendOTP
function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function generateOTP() {
    let OTP = 0;
    for (let i = 0; i < 6; i++) {
        let randomNumber = generateRandomNumber(0, 10); //0 inclusive 10 exclusive
        OTP = OTP * 10 + randomNumber;
    }
    return OTP;
}

exports.sendOTP = async (req, res) => {
    try {

        // fetch email from req.body
        const { email } = req.body;

        //perform validations
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email field not filled"
            })
        }

        //check email already exist
        const userExist = await User.findOne({ email });
        if (userExist) {
            //user already exist ,so no need for signup
            return res.status(403).json({
                success: false,
                message: "User is already registered"
            })
        }

        //Generate OTP 
        // const OTP = generateOTP(); //we can use otp-generator package to generate otp

        // (bad logic multple db calls)
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        console.log("OTP Generated : ", otp);
        
        //check unique otp or not
        const result = await OTP.findOne({ otp : otp });
        while (result) {
                otp = otpGenerator.generate(6, {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false
                })
                result = await OTP.findOne({ otp : otp });
        }
        

        // ************************************
        // otp create hone se just pehle pre save hook chla toh it means yahan se otp send hoga

        //store OTP in DB for verification
        const newOtp = await OTP.create({ email: email, otp: otp });

        return res.status(201).json({
            success: true,
            otp : otp,
            message: "OTP sent successfully during signup"
        });

    } catch (error) {
        console.log("Error while sending OTP  : ", error.message);
        return res.status(500).json({
            success: false,
            message: "Error while sending OTP "
        });
    }

}

//signup

exports.signUp = async (req, res) => {

    try {
        //fetch signup fields from body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            contactNumber,
            accountType,
            otp,
         } = req.body;

        //perform validation on signup data
        if (!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber || !otp) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        //2 password match  krlo
        if (password !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "Password and Confirm Password doesn't match"
            })
        }

        //check if email already exist
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(403).json({
                success: false,
                message: "Email already exists.Go to login page"
                //we can use redirection message
            })
        }
        
        //find most recent entry of OTP from DB
        const recentOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        //-1 means sorting in descending order based on createdAt (time)
        console.log("Recent OTP ", recentOTP);

        //Validate otp(Match recent entry of Otp with user filled otp )
        if (recentOTP.length == 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        } else if (otp !== recentOTP[0].otp) {
            return res.status(401).json({
                success: false,
                message: "Wrong OTP entered by user "
            });
        } 
            //now it is a new user and otp validated successfully
            //password hashed,then put entry in db
            const hashedPassword = await bcrypt.hash(password, 10);

            //store entry in db
            const profileDetails = await Profile.create({
                dateOfBirth: null,
                about: null,
                gender: null,
                profession: null
            })

            //create user
            let approved = "";
            approved === "Instructor" ? (approved = false) : (approved = true);

            const user = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                contactNumber,
                accountType,
                additionalDetails: profileDetails._id,
                imageUrl:"https://api.dicebear.com/5.x/initials/svg?seed="+firstName.at(0)+lastName.at(0),
                approved
            });

            console.log(user);

            return res.status(201).json({
                success: true,
                user,
                message: "New entry of user in Database"
            });

    } catch (error) {
        console.log("Error during signup ", error.message);
        return res.status(500).json({
            success: false,
            message: "Error during signup"
        });
    }

}

//login

exports.login = async (req, res) => {
    try {

        //fetch email and pwd fields from body
        const { email, password } = req.body;

        //perform validations on input fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        //check email exist or not

        let userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(401).json({
                success: false,
                message: "Email not exists,First signup before login"
            })
        }

        console.log("UserExist : ", userExist);

        //it means email exist ,now check password

        if (await bcrypt.compare(password, userExist.password)) {
            //email and password both are correct ,so user will logged in

            const payloadData = {
                email: email,
                id: userExist._id,
                accountType: userExist.accountType
            };

            //creating a token for authentication and authorization

            const token = jwt.sign(payloadData, process.env.JWT_SECRETKEY, {
                expiresIn: "2h"
            })

            console.log("Token : ", token);

            userExist = userExist.toObject();
            userExist.token = token;
            userExist.password = undefined;


            // return res.status(200).json({
            //     success : true,
            //     userExist,
            //     token,
            //     message : "User logged in successfully"
            // });


            //token send using cookie parser
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), //after 3 days,cookie expires
                httpOnly: true
            };
            
            return res.cookie("token", token, options).status(200).json({
                success: true,
                userExist,
                token,
                message: "User logged in successfully"
            });
        } else {
            //password not matched
            return res.status(401).json({
                success: false,
                message: "Incorrect Password"
            })
        }

    } catch (error) {
        console.log("Error during login ", error.message);
        return res.status(500).json({
            success: false,
            message: "Error during login"
        });
    }
}

//change password

exports.changePassword = async (req, res) => {
    try {

        //extract userId after authenetication
        const userId = req.user.id;

        //get data from request.body (old pwd,new pwd,confirm pwd)
         const {
            oldPassword,
            newPassword,
            confirmPassword
        } = req.body;

        // validate userId
        if(!userId){
            return res.status(400).json({
                success: false,
                message: "UserId not found"
            })
        }

        //get user data from req.user
        const user = await User.findById(userId);


        //validation
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All the fields are required for changing password"
            })
        }

        //validate new and confirm pwd
        if (newPassword !== confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "New Password and Confirm password must be same"
            })
        }


        //validate old pwd
        if (!await bcrypt.compare(oldPassword, user.password)) {
            //old password not matched
            return res.status(403).json({
                success: false,
                message: "Old password is not correct.If you forget,then reset the password"
            })
        }

        //hashed the pwd
        const newPasswordHashed = await bcrypt.hash(newPassword, 10);

        //update new pwd in db
        //old pwd matched with entry in db,now update new pwd in db
        const updatedUser = await User.findByIdAndUpdate(req.user.id,
            {
                password: newPasswordHashed
            }, { new: true })

        console.log(updatedUser);

        //password update -> mail send
        try {
            const mailResponse = await mailSender(updatedUser.email, "Password Updated", passwordUpdate(updatedUser.email,updatedUser.firstName,updatedUser.lastName));

            console.log("Password updated successfully : ", mailResponse)

        } catch (error) {
            console.log("Password updation email not send : ", error.message);
            return res.status(500).json({
                success: false,
                message: "Password updation email not send "
            })
        }

        //return response

        return res.status(201).json({
            success: true,
            message: "Password updated successfully",
            updatedUser
        })

    } catch (error) {
        console.log("Password updation Failed : ", error.message);
        return res.status(500).json({
            success: false,
            message: "Password updation failed "
        })
    }
}