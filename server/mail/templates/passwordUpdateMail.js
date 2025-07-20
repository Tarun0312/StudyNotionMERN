const passwordUpdate = (email,firstName,lastName) => {

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Password Updated Confirmation</title>
        
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
        
           
            <h3>Password Update Confirmation</h3>
    
            <div class="body">
    
                <p>Hey ${firstName} ${lastName},</p>
    
                <p>Your password has been successfully updated for the email <span class="highlight">${email}</span>.</p>
    
                <p>If you did not request this password change, please contact us immediately to secure your account.</p>
    
            </div>
    
            <p class="support">
                If you have any questions or need further assistance, please feel free to reach out to us at <a href="mailto:info@studynotion.com">info@studynotion.com</a>. We are here to help!
            </p>
    
        </div>
    </body>
    </html>`;

}

module.exports = passwordUpdate;