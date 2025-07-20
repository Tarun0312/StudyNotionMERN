const { default: mongoose } = require("mongoose");
const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollment} = require("../mail/templates/courseEnrollmentMail");

//capture the payment or initiate Payment or orderCreated handler function
exports.capturePayment = async (req, res) => {

    //fetch courseId and userId
    const { courseId } = req.body;
    const userId = req.user.id;

    //validate data
    if (!courseId || !userId) {
        return res.status(404).json({
            success: false,
            message: "Please provide valid course Id"
        });
    }

    //valid courseId or not
    try {
        const courseDetails = await Course.findById(courseId);

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        //user already course purchased or not
        //uid (string format) whereas studentEnrolled (object format) ,so convert
        const uid = new mongoose.Schema.Types.ObjectId(uid);

        if (courseDetails.totalStudentsEnrolled.includes(uid)) {
            return res.status(200).json({
                success: false,
                message: "Student is already enrolled in this course"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

    try {
        //create order 
        const orderCreated = await instance.orders.create({
            amount: courseDetails.price * 100,
            money: 'INR',
            receipt: Math.random(Date.now().toString()),
            notes: {
                userId: userId,
                courseId: courseId
            }
        });
        console.log("Order Created : ", orderCreated);

        //return response
        return res.status(200).json({
            success: true,
            courseName: courseDetails.courseName,
            courseDescription: courseDetails.courseDescription,
            thumbnail: courseDetails.thumbnail,
            orderId: orderCreated.order_id,
            amount: orderCreated.amount,
            currency: orderCreated.currency

        });

    } catch (error) {
        console.log("Could not initiate order : ", error.message);
        return res.status(500).json({
            success: false,
            message: 'Could not initiate order',
            error: error.message
        });
    }
}


//verify signature handler function
//this route is called by razorpay
exports.verifySignature = async (req, res) => {
    const webHook = "12345678";

    //extract signatgure razorpay header
    const signature = req.headers["x-razorpay-signature"];

    //convert web hook into hashed format bcoz signature is also hashed (we can't decrypt in hashing),so convert web hook into hashed format
    const hmac = crypto.createHmac(webHook);//hashed message authentication code
    //convert in string format
    hmac.update(JSON.stringify(req.body));
    const digest = hmac.digest("hex"); //for particular input agr uspar koi hashing algo lgaaya hai ,then uske o/p ko digest kehte hai

    //compare
    if (digest == signature) {
        console.log("Payment is Authorised");

        try {
            //perform action (we have to enroll user in a course)

            //fetch courseId and userId from notes object (which is in order created)
            //we can't fetch from req bcoz this handler is called by razorpay
            const { courseId, userId } = req.body.payload.payment.entity.notes;

            //add courseId in user
            const enrolledUser = await User.findOneAndUpdate({ _id: userId }, {
                $push: {
                    courses: courseId
                }
            }, { new: true }).populate("courses").exec();
            console.log("Enrolled User : ", enrolledUser);


            //find the student and enroll the student in course-> totalStudentsEnrolled
            const enrolledCourse = await Course.findOneAndUpdate({ _id: courseId }, { $push: { totalStudentsEnrolled: userId } }, { new: true }).populate("totalStudentsEnrolled").exec()
            console.log("Enrolled Course : ", enrolledCourse);

            if (!enrolledUser || !enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: "Course or user not found"
                })
            }

            //send mail of enrollement in a course
            const mailResponse = await mailSender(enrolledUser.email, "Congratulations from StudyNotion", courseEnrollment(enrolledUser.firstName,enrolledUser.lastName,enrolledCourse.courseName));

            return res.status(200).json({
                success: true,
                message: "Signature Verified and Course Purchased Succesfully",
                enrolledUser,
                enrolledCourse
            });

        } catch (error) {
            console.log("Failed to purchase a course : ", error.message);
            return res.status(500).json({
                success: false,
                message: "Failed to purchase a course",
                error: error.message
            });
        }
    } else {
        return res.status(400).json({
            success: false,
            message: "Signature Verification Failed"
        })
    }
}