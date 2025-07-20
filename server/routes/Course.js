const express = require("express");
const router = express.Router();
const {createCourse,getAllCourses,getCourseDetails} = require("../controllers/Course");
const {createRatingAndReview,getAverageRating,getAllRatingAndReviews,getRatingAndReviews} = require("../controllers/RatingAndReview");
const {createCategory,getAllCategories,categoryPageDetails} = require("../controllers/Category");
const {createSection,updateSection,deleteSection} = require("../controllers/Section");
const {createSubSection,updateSubSection,deleteSubSection} = require("../controllers/SubSection");
const {auth,isInstructor,isStudent,isAdmin} = require("../middlewares/auth");

//API Routes

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************
//Course can only be created by instructor
router.post("/createCourse",auth,isInstructor,createCourse);
//add a section to course
router.post("/addSection",auth,isInstructor,createSection);
//update a section
router.put("/updateSection",auth,isInstructor,updateSection);
//delete a section
router.delete("/deleteSection",auth,isInstructor,deleteSection);
//add subSection to course
router.post("/addSubSection",auth,isInstructor,createSubSection);
//update a subSection
router.post("/updateSubSection",auth,isInstructor,updateSubSection);
//delete a subSection 
router.post("/deleteSubSection",auth,isInstructor,deleteSubSection);
//Get All registered courses
router.get("/getAllCourses",getAllCourses);
//get details for a specific course
router.post("/getCourseDetails",getCourseDetails);



// ********************************************************************************************************
//                                      Rating an review routes
// ********************************************************************************************************
//Rating and review can be created by a student once in a course
router.post("/createRating",auth,isStudent,createRatingAndReview);
router.post("/getAverageRating",getAverageRating);
router.post("/getAllRatingAndReviews",getRatingAndReviews);
router.get("/getAllRatingAndReviews",getAllRatingAndReviews);


// ********************************************************************************************************
//                                      Category routes
// ********************************************************************************************************
router.post("/createCategory",auth,isAdmin,createCategory);
router.post("/getCategoryPageDetails",categoryPageDetails);
router.get("/getAllCategories",getAllCategories);




module.exports = router;