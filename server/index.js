const express = require("express");
const app = express();

//import all routes
const userRoutes = require("./routes/User");
const courseRoutes = require("./routes/Course");
const profileRoutes = require("./routes/Profile");
const paymentsRoutes = require("./routes/Payments");

//import config functions
const dbConnection = require("./config/database.js");
const connectWithCloudinary = require("./config/cloudinary");

//import middleware
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors"); //backend portNO.- 4000,frontend - 3000
//we need our backend to entertain frontend request,so we need cors
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

//db connect
dbConnection();

//use middleware in app
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : "https://localhost:3000",
    credentials : true
}));
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

//cloudinary connect
connectWithCloudinary();

//mount api routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/payments",paymentsRoutes);


// server activate
app.listen(PORT,() => {
    console.log(`Server Activated successfully at Port Number ${PORT}`);
} );


//testing route
app.get("/",(req,res) => {
    res.send("<h1>Home page</h1>");
})

//node-schedule
//crypto-random-string
//bcryptjs