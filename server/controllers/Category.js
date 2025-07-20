const Category = require("../models/Category");
const Course = require("../models/Course");

//create category
exports.createCategory= async (req, res) => {
    try {
        //fetch name and desc from req.body
        const { categoryName, categoryDescription } = req.body;

        //validation 
        if (!categoryName || !categoryDescription) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        //create an entry in db
        const category = new Category({ categoryName, categoryDescription });
        const savedCategory= await category.save();

        console.log("Saved category : ", savedCategory);

        //return response
        return res.status(201).json({
            success: true,
            message: "Category created successfully by admin",
            savedCategory
        })
    } catch (error) {
        console.log("Error while creating a category", error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating category",
        })
    }
}

//get all categories 
exports.getAllCategories = async (req, res) => {
    try {
        //use find method to find all categorys
        const allCategories = await Category.find({}, { categoryName: true, categoryDescription: true });
        //saare categorys mei name and description  hona chhiye (true kr diya isliye)

        return res.status(200).json({
            success: true,
            message: "All the categorys are fetched successfully",
            allCategories
        })

    } catch (error) {
        console.log("Error while fetching all the categorys ", error.message);
        return res.status(500).json({
            success: false,
            message: "Error while fetching all the categorys",
        })
    }
}

//categoryPageDetails handler function
exports.categoryPageDetails = async (req,res) => {
    try{
         //get categoryId
         const categoryId = req.body;

         //validate
         if(!categoryId){
            return res.status(400).json({
                success : false,
                message : "Category Id missing"
            });
         }

         //get courses based on categoryId
         const selectedCategory = await Category.findOne({_id : categoryId},{courses : true}).populate("courses").exec();

         //validate if course exist for this categoryId
         if(!selectedCategory ||selectedCategory.courses.length === 0){
            return res.status(404).json({
                success : false,
                message : "Courses not found for this category"
            });
         }
          
         const selectedCategoryCourses = selectedCategory.courses;

         //get courses based on diff category
         const differntCategoriesCourses = await Category.find({ _id : { $ne :categoryId }}).populate("courses").exec();

         //get 10 top selling courses  (more selling course -> more no. of user)
         const topSellingCourses = await Course.find().sort({totalStudentsEnrolled : -1}).limit(10);

         //return response
         return res.status(200).json({
            success : true,
            message : 'Courses based on given category id,different category id and top selling courses are fetched successfully',
            data : {
                    selectedCategoryCourses,
                    differntCategoriesCourses,
                    topSellingCourses
            }
         });

    }catch(error){
        console.log("Failed to fetch courses based on given category id,different category id and top selling courses : ", error.message);
        return res.status(500).json({
            success : false,
            message : "Failed to fetch courses based on given category id,different category id and top selling course",
            error : error.message
        })
    }
}