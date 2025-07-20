const Section = require("..//models/Section");
const Course = require("../models/Course");

//createSection handler function
exports.createSection = async (req,res) => {
    try{
         //get CourseId and title of Section
         const {courseId,sectionName} = req.body;

         //data validation
         if(!courseId || !sectionName){
            return res.status(400).json({
                success : false,
                message : "All the fields are required"
            });
         }

         //create entry of section in db
         const newSection = await Section.create({sectionName});

         //update entry of section in Course model
         const updatedCourse = await Course.findByIdAndUpdate(courseId,{
            $push : {
                sections : newSection._id
            }
         },{new : true}).populate(
                            { path :"sections",
                                 populate : {
                                    path : "subSection"}
                            }).exec();
         //to do : section and subsection ko populate how?
         
         console.log("Updated Course : ", updatedCourse);

         //return response
         return res.status(201).json({
            success : true,
            message : "Section Created Successfully",
            section : newSection
         })
    }catch(error){
        console.log("Error while creating a section : ",error.message);
        return res.status(500).json({
            success : false,
            message : "Unable to create Section,please try again",
            error : error.message
        })
    }
}

//updateSection handler function
exports.updateSection = async (req,res) => {
    try{

        //data input
        const {sectionName,sectionId} = req.body;

        //validate data
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }

        //update Section
        const updatedSection = await Section.findByIdAndUpdate(sectionId,
            {
                sectionName : sectionName 
            });
        
            console.log("Updated Section : ",updatedSection);

        //return response
        return res.status(200).json({
            success : true,
            message : "Section updated Successfully",
            updatedSection
        })

    }catch(error){
        console.log("Error while updating a Section : ",error.message);
        return res.status(500).json({
            success : false,
            message : "Unable to update Section,please try again",
            error : error.message
        })
    }
}

//deleteSection handler function
exports.deleteSection = async (req,res) => {
    try{
        // get Id (either using parameter or body) assuming we sending ID in params
        // const sectionId = req.params.sectionId; //error aa rhi find kro
        const {sectionId,courseId} = req.body;

        // validate data
        if(!sectionId){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            });
        }

        // delete section from Section model
        await Section.findByIdAndDelete(sectionId);
      
        //TODO : testing
        // delete sectionId from course model
       const updatedCourse = await Course.findByIdAndDelete(courseId,
        {$pull : {sections : sectionId}}, {new : true}).populate("sections").exec();
        

        // return response
        return res.status(200).json({
            success : true,
            message : "Section Deleted Successfully",
            course : updatedCourse,
        })
    }catch(error){
        console.log("Unable to delete section,please try again : ",error.message);
        return res.status(500).json({
            success : false,
            message : "Unable to delete section,please try again",
            error : error.message
        })
    }
}