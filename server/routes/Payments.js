const express = require("express");
const router = express.Router();
const {capturePayment,verifySignature} = require("../controllers/Payments");
const {auth,isStudent} = require("../middlewares/auth");

//API routes
// ********************************************************************************************************
//                                      Payment routes
// ********************************************************************************************************
router.post("/capturePayment",auth,isStudent,capturePayment);
router.post('/verifySignature',verifySignature);


module.exports = router;