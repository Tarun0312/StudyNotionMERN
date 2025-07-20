const mongoose = require("mongoose");
require("dotenv").config();

const dbConnection = () => {
   mongoose.connect(process.env.DATABASE_URL,{})
        .then(() => {
            console.log("Database Connected Successfully");
        })
        .catch((err)=>{
            console.log("Recieved an error , while connecting database");
            console.error(err.message);
            process.exit(1);
        })
}

module.exports = dbConnection;