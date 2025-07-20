const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const {uploadFileToCloudinary}  = require("../utils/fileUploader");
require("dotenv").config();

//createSubSection handler function
exports.createSubSection = async (req,res) => {
    try{
        
        //input data and sectionId too
        const {subSectionName,subSectionDescription,timeDuration,sectionId} = req.body

        //extract video file
        const videoUrl = req.files.videoUrl;
 
        //validate data
        if(!subSectionName || !subSectionDescription || !timeDuration || !sectionId || !videoUrl){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }  
      
        //upload video to cloudinary
        const response = await uploadFileToCloudinary(videoUrl,process.env.FOLDER_NAME);

        //create an entry of subSection in db
        const newSubSection = await SubSection.create({
            subSectionName,
            subSectionDescription,
            timeDuration,
            videoUrl : response.secure_url
        }); 

        //update entry of subSection in Section model
        const updatedSection = await Section.findByIdAndUpdate(sectionId,{
            $push : {
                subSection : newSubSection._id
            }
        },{new : true}).populate("subSection").exec();
        
        console.log("Updated Section : ",updatedSection);

        return res.status(201).json({
            success : true,
            message : 'SubSection created successfully',
            newSubSection
        });

    }catch(error){
        console.log("Failed to create a subSection : ",error.message);
        return res.status(500).json({
            success : false,
            message : "Failed to create a subSection",
            error : error.message
        });
    }
}

//updateSubSection handler function
exports.updateSubSection = async (req,res) => {
    try{
        //input data and subSectionId
        const {subSectionName,subSectionDescription,timeDuration,subSectionId} = req.body;

        //extract video file
        const videoUrl = req.files.videoUrl;

        //validate data
        if(!subSectionName || !subSectionDescription || !timeDuration || !videoUrl || !subSectionId){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            });
        }

        //upload video to cloudinary 
        const response = await uploadFileToCloudinary(videoUrl,process.env.FOLDER_NAME);

        //update subSection
        const updatedSubSection = await SubSection.findByIdAndUpdate(subSectionId,{
            subSectionName,
            subSectionDescription,
            timeDuration,
            videoUrl : response.secure_url
        });

        //return response
        return res.status(200).json({
            success : true,
            message : "SubSection updated Successfully",
            updatedSubSection
        })
    }catch(error){
        console.log("Failed to update subSection : ",error.message);
        return res.status(500).json({
            success : true,
            message : "Failed to update subSection",
            error : error.message
        })
    }
}

//deleteSubSection handler function
exports.deleteSubSection = async (req,res) => {
    try{
        //get Id by using params
        const {subSectionId,sectionId} = req.body ;

        // validate data
        if(!subSectionId || !sectionId){
            return res.status(400).json({
                success : false,
                message : "All the fields are required"
            });
        }

        //delete
        await SubSection.findByIdAndDelete(subSectionId);

        //delete subSection entry from section model
        const updatedSection = await Section.findByIdAndDelete(sectionId,
            { $pull : { subSection : subSectionId}} , {new : true}).populate("subSection").exec();

        //return response
        return res.status(200).json({
            success : true,
            message : "SubSection Deleted Successfully",
            section : updatedSection
        }) 
    }catch(error){
        console.log("Failed to delete a subSection : ",error.message);
        return res.status(500).json({
            success : false,
            message : "Failed to delete a subSection",
            error : error.message
        })
    }
}