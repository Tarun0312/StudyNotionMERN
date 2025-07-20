const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadFileToCloudinary } = require("../utils/fileUploader");
require("dotenv").config();

//updateProfile handler function 
exports.updateProfile = async (req,res) => {
    try{
        //input data
        const {about="",dateOfBirth="",profession="",gender} = req.body;

        //extract user id of loggedIn user 
        const userId = req.user.id;
        
        //validate data
        if(!gender || !userId){
            return res.status(400).json({
                success : false,
                message : "All the fields are required"
            });
        }

        //find userDetails from userId
        const userDetails = await User.findById(userId);

        //extract profile id of loggedIn user from userSchema
        const profileId = userDetails.additionalDetails;

        //find profile 
        const updatedProfile = await Profile.findById(profileId);

        //update profile (new way of updation)
        updatedProfile.dateOfBirth = dateOfBirth;
        updatedProfile.gender = gender;
        updatedProfile.profession = profession;
        updatedProfile.about = about;
        await updatedProfile.save(); //profileDetails updated in db 

        //return response
        return res.status(200).json({
            success : true,
            message : "Profile Updated Successfully",
            updatedProfile
        })
    }catch(error){
        console.log("Failed to updated profile,please try again : ",error.message);
        return res.status(500).json({
            success : false,
            message : "Failed to updated profile,please try again",
            error : error.message
        })
    }
}

//deleteAccount handler function
exports.deleteAccount = async (req,res) => {
    try{
        //fetch userId
        const {id}= req.user;

        //validate data
        if(!id){
            return res.status(400).json({
                success : false,
                message : "All the are required"
            });
        }

        //validate valid id or not
        const userExist = await User.findById(id);
        if(!userExist){
            return res.status(404).json({
                success : false,
                message : "User not found"
            });
        }


        //Todo :1-> unenroll user from all enrolled courses
        
        //2-> deletion of profile after 5 days (schedule deletion operation) 
        //-> use node-schedule module function 
        //const job=schedule.scheduleJob('*****',async() => {write deletion code here})
        //job.start()
        
        //3-> search (cron job) -> // https://www.geeksforgeeks.org/how-to-run-cron-jobs-in-node-js/ -> https://medium.com/@developerom/schedule-cron-jobs-in-node-js-12a6a33d6ed3

        //first delete profile,then delete user 
        await Profile.findByIdAndDelete(userExist.additionalDetails);

        //delete user
        await User.findByIdAndDelete(id);

        //return response
        return res.status(200).json({
            success : true,
            message : "Account Deleted Successfully"
        })

    }catch(error){
        console.log("Failed to delete account,please try again : ",error.message);
        return res.status(500).json({
            success : false,
            message : "Failed to delete account,please try again",
            error : error.message
        })
    }
}

// getUser ALL Details handler function
exports.getAllUserDetails = async (req,res) => {
    try{
        //fetch id
        const {id} = req.user;

        //validate
        if(!id){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            });
        }

        //get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        //return response
        return res.status(200).json({
            success : true,
            message : 'User Details fetched successfully',
            userDetails
        });

    }catch(error){
        console.log("Failed to fetch User Details")
        return res.status(500).json({
            success : false,
            error : error.message,
            message : "Failed to fetch User Details"
        });
    }
}

//updateDisplayPicture  handler function
exports.updateDisplayPicture = async (req,res) => {
    try{
         //extract picture from file
         const profileImage = req.files.profileImage;
         
         //extract userId for updation of url
         const userId = req.user.id;

         //validate input
         if(!profileImage || !userId){
            return res.status(400).json({
                success : false,
                message : 'All the fields are required'
            });
         }

         //upload to cloudinary
        const response = await uploadFileToCloudinary(profileImage,process.env.FOLDER_NAME);

         //update user model with this imageUrl 
         const updatedUser = await User.findByIdAndUpdate(userId,{imageUrl : response.secure_url},{new : true});

         //return response
         return res.status(200).json({
            success : true,
            message : "Profile picture updated Successfully",
            updatedUser
         })
    }catch(error){
        console.log("Failed to update Profile picture : ",error.message);
        return res.status(500).json({
            success : false,
            message: "Failed to update Profile picture",
            error : error.message
        })
    }
}

//getEnrolledCourseDetails handler function
exports.getEnrolledCourseDetails = async (req,res) => {
    try{
        // fetch userId
        const userId = req.user.id;
        //validate data
        if(!userId){
            return res.status(400).json({
                success : false,
                message : "UserId not found"
            });
        }

        //find all courses of user
        const userDetails = await User.findOne({_id : userId}).populate("courses").exec();
        console.log("ALL Courses of user are : ",courses);
        if(!userDetails){
            return res.status(400).json({
                success : false,
                message : `Could not found user with  UserId : ${userId}`
            })
        }

        // return response 
        return res.status(200).json({
            success : true,
            message : "All enrolled courses are fetched succesfully",
            data : userDetails
        })
    }catch(error){
        console.log("Failed to get enrolled course details: ",error.message);
        return res.status(500).json({
            success : false,
            message: "Failed to get enrolled course details",
            error : error.message
        })
    }
}