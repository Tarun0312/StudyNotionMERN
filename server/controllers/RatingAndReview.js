const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");



//createRatingAndReview handler function
exports.createRatingAndReview = async (req,res) => {
    try{
        //fetch userId
        const userId = req.user.id;

        //fetch courseId,
        //input data
        const {courseId,rating,review} = req.body;

        //validate all data
        if(!userId || !courseId || !rating || !review){
            return res.status(400).json({
                success : false,
                message : "All the fields are required"
            });
        }

        //check if user enrolled in this course or not
        const courseDetails = await Course.findOne({_id :courseId,
            totalStudentsEnrolled:{$elemMatch : {$eq : userId}}
        });


        if(!courseDetails){
            return res.status(404).json({
                success : false,
                message : "Student is not enrolled in this course"
            });
        }

        //check if user already reviewed the course or not
        const alreadyReviewed = await Course.findOne({_id : courseId,
            ratingAndReviews : {$elemMatch : {$eq : userId}}
        });

        if(alreadyReviewed){
            return res.status(403).json({
                success : false,
                message : "Course is already reviewed by the user"
            });
        }

        //create an entry in db
        const newRatingAndReview = await RatingAndReview.create({
            courseId,
            user : userId,
            rating,
            review
        });
        console.log("Rating and review created Successfully : ",newRatingAndReview);

        //update course model with this ratingAndReviews 
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,
            {$push : {ratingAndReviews :newRatingAndReview._id}},
            {new : true});
        
        console.log("Updated Course Details: ",updatedCourseDetails);

        //return response
        return res.status(201).json({
            success : true,
            message : "Rating and review created Successfully",
            newRatingAndReview
        });

    }catch(error){
        console.log("Failed to create a review,please try again later : ",error.message);
        return res.status(500).json({
            success : false,
            message : "Failed to create a review,please try again later",
            error : error.message
        })
    }
}

//getAverageRating handler function
exports.getAverageRating = async (req,res) => {
    try{
        //fetch courseId
        const {courseId} = req.body;

        //validate courseId
        if(!courseId){
            return res.status(400).json({
                success : false,
                message : "CourseId not found"
            });
        }

        // valid courseId or not
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                success : false,
                message : "Course not found"
            });
        }

        //find all rating for a  given courseId

        //MY logic
        // const allRating = await RatingAndReview.find({courseId:courseId},{rating : true});
        // const totalRating = allRating.length !==0 ?(allRating.reduce((rating) => rating,0)) : 0 ;
        //calculate average rating
        //const avgRating = (totalRating)/allRating.length;

        //Bhaiya logic
        const result = await RatingAndReview.aggregate([
            {
                $match : {
                    courseId : new mongoose.Schema.Types.ObjectId(courseId)
                }
            },
            {
                $group :{
                    _id : null,
                    averageRating : {
                        $avg : "$rating"
                    }
                }
            }
        ]);
       

        //return response
        if(result.length > 0){
            return res.status(200).json({
                    success : true,
                    message : "Average Rating Calculated Successfully",
                    averageRating : result[0].averageRating
            });
        }else{
            return res.status(200).json({
                success : true,
                message : "Average Rating is 0 , no ratings given till now",
                averageRating : 0
        });
        }

    }catch(error){
        console.log("Something went wrong while calculating average rating : ",error.message);
        return res.status(500).json({
            success : false,
            message : "Something went wrong while calculating average rating",
            error : error.message
        });
    }
}

//getAllRatingAndReviews
exports.getAllRatingAndReviews = async (req,res) => {
    try{   
        const allRatingAndReviews = await RatingAndReview.find()
                                                         .sort({rating : "desc"})
                                                         .populate(
                                                            {
                                                                path : "courseId",
                                                                select : "courseName"
                                                            })
                                                         .populate(
                                                            {
                                                                path : "user",
                                                                select : "firstName lastName email imageUrl"
                                                        
                                                            })
                                                         .exec();
        
        console.log("All rating and reviews fetched succcesfully : ",allRatingAndReviews);

        return res.status(200).json({
            success : true,
            message : "All rating and reviews fetched succcesfully",
            allRatingAndReviews
        });

    }catch(error){
        console.log("Failed to fetch all courses rating and review : ",error.message);
        return re.status(500).json({
            success : false,
            message : 'Failed to fetch all courses rating and review',
            error : error.message
        })
    }
}


//getRatingAndReviews of a particular course handler function
exports.getRatingAndReviews = async (req,res) => {
    try{
        //fetch courseId
        const {courseId} = req.body;

        //validate data
        if(!courseId) {
            return res.status(400).json({
                success : false,
                message : "CourseId not found"
            });
        }
        //valid courseId or not
        const course = await Course.findById(courseId)
                                        .populate("ratingAndReviews")
                                        .exec();
        if(!course){
            return res.status(404).json({
                success : false,
                message : "Course not found"
            });
        }

        //fetch rating and review of given course
        const ratingAndReviews = course.ratingAndReviews;
        console.log("Rating and reviews of given course iD : ",ratingAndReviews);

        //return response
        return res.status(200).json({
            success : true,
            message : "Rating and reviews of given course ID fetched successfully",
            ratingAndReviews
        })
    
    }catch(error){
        console.log("Something went wrong while fetching rating and review : ",error.message);
        return res.status(500).json({
            success : false,
            message : "Something went wrong while fetching rating and review : ",
            error : error.message
        });
    }
}