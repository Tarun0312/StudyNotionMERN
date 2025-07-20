const cloudinary =  require("cloudinary").v2;

exports.uploadFileToCloudinary = async (file,folder,quality,height,resource) => {
    try{
        //upload file to cloud
        const options = { folder , resource_type : "auto"} ;

        if(quality){
            options.quality = quality
        }
        if(height){
            options.height = height
        }
      
        const response = await cloudinary.uploader.upload(file.tempFilePath,options);
      
        console.log("File uploaded successfully");
        return response;
    }catch(error){
        console.log("Error while uploading media files : ",error.message);
        return res.status(500).json({
            success : false,
            message : "Failed to upload media files",
            error : error.message
        })
    }
}
