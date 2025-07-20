const express = require("express");
const router = express.Router();
const {updateProfile,deleteAccount,getAllUserDetails,updateDisplayPicture,getEnrolledCourseDetails} = require("../controllers/Profile");
const {auth} = require("../middlewares/auth");

//API Routes
// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
//update and delete profile
router.put("/updateProfile",auth,updateProfile);
router.delete("/deleteAccount",auth,deleteAccount);
router.put("/updateDisplayPicture",auth,updateDisplayPicture);

//get enrolled user all details
router.get("/getUserDetails",auth,getAllUserDetails);

//get enrolled course details
router.get("/getEnrolledCourse",auth,getEnrolledCourseDetails);

module.exports = router;