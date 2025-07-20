const express = require("express");
const router = express.Router();
const {sendOTP,signUp,login,changePassword} = require("../controllers/Auth");
const {auth,isStudent,isInstructor,isAdmin} = require("../middlewares/auth");
const {resetPasswordToken,resetPassword} = require("../controllers/ResetPassword");


//API Routes
// ********************************************************************************************************
//                                      auth routes
// ********************************************************************************************************

router.post("/sendOTP",sendOTP);
router.post("/signup",signUp);
router.post("/login",login);
router.put("/change-password",auth,changePassword);

// ********************************************************************************************************
//                                      Reset Password routes
// ********************************************************************************************************

router.post("/reset-password-token",resetPasswordToken);
router.post("/reset-password",resetPassword);



module.exports = router;