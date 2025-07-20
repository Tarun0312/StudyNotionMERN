const emailVerificationTemplate = (otp) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        
        <style>
            body{
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
            .container{
                max-width: 600px;
                margin: 0 auto;
                text-align: center;
             } 
 
             .logo{
                 max-width: 200px;
                 margin-top: 20px;
             }
     
             .body{
                 text-align: center;
             }
     
             .support{
                color: #999999;
                font-size: 0.8rem;
             }
             .highlight{
                 font-weight: bold;
             }
        </style>
    </head>
    <body>
        <div class="container">
    
            <a href="" ><img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo"/></a>
        
           
            <h3>OTP Verification Email</h3>
    
            <div class="body">
    
                <p>Dear User,</p>
    
                <p>Thank you for registering with StudyNotion. To complete your registration, please use the following OTP (One-Time Password) to verify your account:</p>
    
                <h2>${otp}</h2>
                <p>IThis OTP is valid for 5 minutes. If you did not request this verification, please disregard this email. Once your account is verified, you will have access to our platform and its features.</p>
    
            </div>
    
            <p class="support">
                If you have any questions or need further assistance, please feel free to reach out to us at <a href="mailto:info@studynotion.com">info@studynotion.com</a>. We are here to help!
            </p>
    
        </div>
    </body>
    </html>`;
}

module.exports = emailVerificationTemplate;