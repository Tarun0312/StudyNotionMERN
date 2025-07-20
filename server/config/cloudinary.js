const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const connectWithCloudinary = () => {
    try{
        cloudinary.config({
            cloud_name : process.env.CLOUD_NAME,
            api_key : process.env.API_KEY,
            api_secret : process.env.API_SECRET,
            secure : true
        });

        console.log("Connected with cloudinary successfully");
    }catch(error){
        console.log("Something went wrong while making connection with cloudinary : ",error.message);
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectWithCloudinary;

// if we use {} during export ,then we have access method using dot operator
//it is similar exports.connectWithCloudinary ,here also we need dot operator to access