const nodemailer = require("nodemailer");

require("dotenv").config()

const mailSender = async (email,title,body) => {

    try{
        // step 1 create transporter
        const transporter = nodemailer.createTransport({
            host : process.env.MAIL_HOST,
            auth : {
                user : process.env.MAIL_USER,
                pass : process.env.MAIL_PASS
            }
        });

        //step 2 sendmail using transporter
        const infoInMail = await transporter.sendMail({
            from : `Study Notion`,
            to : `${email}`,
            subject : `${title}`,
            html :`${body}`
        });

        console.log(infoInMail);
        return infoInMail;

    }catch(error){
        console.log(error.message);
    }
}


module.exports = mailSender;