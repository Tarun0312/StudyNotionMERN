const jwt = require("jsonwebtoken");
require("dotenv").config();

//auth
exports.auth = async (req,res,next) => {
    try{

        //Extract Token from cookie(we have send in cookie)
        const token =  req.cookies.token || req.header("Authorisation").replace("Bearer ","") || req.body.token;

        //check if token is found or not
        if(!token){
            //token missing
            return res.status(401).json({
                success : false,
                message : "Token missing"
            });
        }
        //verify authenticity of token
        try{
            const decodePayloadData = jwt.verify(token,process.env.JWT_SECRETKEY);

            console.log("Decode payload data : ",decodePayloadData);

            req.user = decodePayloadData;

        } catch(error){
            console.log("Invalid token");
            return res.status(403).json({
                success : false,
                message : "Invalid token"
            })
        }
        
        next();
    }catch(error){
        console.log("Error during token authentication : ",error.message);
        return res.status(401).json({
            success : false,
            message : "Something went wrong during token authentication"
        })
    }
}

//isStudent

exports.isStudent = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(403).json({
                success : false,
                message : "This is a protected route for Students only.You cannot access it"
            });
        }

        next();
    }catch(error){
        console.log("Error during  authorisation(student) : ",error.message);
        return res.status(500).json({
            success : false,
            message : "User role is not matching"
        })
    }
}

//isInstructor

exports.isInstructor = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(403).json({
                success : false,
                message : "This is a protected route for Instructor only. You cannot access it"
            });
        }

        next();
    }catch(error){
        console.log("Error during authorisation(instructor) : ",error.message);
        return res.status(500).json({
            success : false,
            message : "User role is not matching"
        });
    }
}

//isAdmin
exports.isAdmin = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(403).json({
                success : false,
                message : "This is a protected route for Admin only. You cannot access it"
            });
        }

        next();
    }catch(error){
        console.log("Error during authorisation(admin) : ",error.message);
        return res.status(500).json({
            success : false,
            message : "User role is not matching"
        });
    }
}
