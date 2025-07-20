const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadFileToCloudinary } = require("../utils/fileUploader");
require("dotenv").config();

//create Course handler function
exports.createCourse = async (req, res) => {
    try {
        //fetch data
        const {
            courseName,
            courseDescription,
            language,
            whatYouWillLearn,
            price,
            category,
            tag,
            instructions,
        } = req.body;

        //fetch thumbnail of course
        const thumbnail = req.files.thumbnailImage;


        //Validation on data and file
        if (!courseName || !courseDescription || !language || !whatYouWillLearn || !price || !category || !thumbnail || !tag || !instructions ) {
            return res.status(400).json({
                success: false,
                message: "All the field are mandatory"
            })
        }

        let status="";
            status = "Draft";

        // Todo:  verfiy that userid and instructor id are same


        //check account type of user logged in (bcoz only instructor can create course) and also we need to instutctor details in course model
        const userId = req.user.id; //we have insert user in req during authentication req.user = decodePayloadData

        //Find user on basis of id
        const instructorDetails = await User.findById(userId);
        if (instructorDetails.accountType !== "Instructor") {
            return res.status(404).json({
                success: false,
                message: "Only Instructor can create a course"
            })
        }

        //category Validation (only done for postman bcoz in UI we only show valid categorys on dropdown menu)
        const checkCategoryPresent = await Category.findById(category);
        if (!checkCategoryPresent) {
            return res.status(404).json({
                success: false,
                message: "Category is Invalid"
            })
        }

        //upload thumbnail to cloudinary
        const height = 150;
        const quality = 80;
        const thumbnailImage = await uploadFileToCloudinary(thumbnail, process.env.FOLDER_NAME, height, quality)

 
        //create an entry of course in db
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            language,
            whatYouWillLearn,
            price,
            category,
            thumbnailUrl: thumbnailImage.secure_url,
            instructor: instructorDetails._id, //(userId)
            tags : tag,
            instructions,
            status : status,
        });
   
        console.log("Course created : ", newCourse);

        // update an entry of course in user schema(who is an instructor)
        const updatedUser = await User.findByIdAndUpdate(instructorDetails._id, {
            $push: {
                course: newCourse._id
            }
        }, { new: true }).populate("courses").exec();

        console.log("Updated User(instructor) : ", updatedUser);

        //update entry of course in Category model
        const updatedCategory = await Category.findByIdAndUpdate({ _id: category }, {
            $push: {
                courses: newCourse._id
            }
        }, { new: true }).populate("courses").exec();

        console.log("Updated category : ", updatedCategory);

        //return response
        return res.status(201).json({
            success: true,
            course: newCourse,
            message: "Course created Successfully"
        });

    } catch (error) {
        console.log("Error while creating a course : ", error.message);
        return res.status(500).json({
            success: false,
            message: "Error while creating a course",
            error: error.message
        })
    }
}


//get all courses handler function
exports.getAllCourses = async (req, res) => {
    try {

        //use find method to get all courses

        const allCourses = await Course.find().populate("instructor").exec();

        return res.status(200).json({
            success: true,
            message: "All the courses are fetched succesfully",
            data: allCourses
        })

    } catch (error) {
        console.log("Error while fetching course : ", error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching course",
            error: error.message
        })
    }
}

//getCourseDetails handler function
exports.getCourseDetails = async (req,res) => {
    try{
        //input courseId
        const {courseId} = req.body;

        //validate data
        if(!courseId){
            return res.status(400).json({
                success : false,
                message : "Course Id missing"
            })
        } 


        //find courseDetails 
        const courseDetails = await Course.findById(courseId)
                                            .populate("totalStudentsEnrolled")
                                                    .populate({
                                                        path : "instructor",
                                                            populate : {
                                                                path : "additionalDetails"
                                                            },
                                                        }
                                                    )
                                            .populate({
                                                        path : "sections",
                                                            populate : {
                                                                path : "subSection"
                                                            },
                                                        }
                                            )
                                            .populate("category")
                                            .populate("ratingAndReviews")
                                            .exec();                                         

        if(!courseDetails){
            return res.status(404).json({
                success : false,
                message : `Could not find the Course with course Id ${courseId}`
            });
        }
       
        console.log("Course Details : ",courseDetails);

        //return response
        return res.status(200).json({
            success : true,
            message : "Course Details fetched successfully",
            course : courseDetails
        });
    }catch(error){
        console.log("Failed to fetch course : ",error.message);
        return res.status(500).json({
            success : false,
            message : "Failed to fetch course",
            error : error.message
        });
    }
}