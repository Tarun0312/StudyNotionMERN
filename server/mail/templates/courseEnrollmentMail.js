
exports.courseEnrollmentEmail = (firstName,lastName,courseName) => {
    //now write html format
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course Enrollment Mail</title>
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
 
        .dashboard-btn{
            display: inline-block;
            padding: 14px 26px;
            background-color: #FFD60A;
            color: #000000;
            text-decoration: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
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

        <a href=""><img id="logo" src="https://i.ibb.co/7Xyj3PC/logo.png"
                alt="StudyNotion Logo"></a>

        <div class="body">
            <h3>Course Registration Confirmation</h3>

            <pDear ${firstName} ${lastName},</p>

            <p>You have successfully registered for the course <span class="highlight">"${courseName}"</span>.We are excited to have you as a participant!</p>

            <p> Please login to your learning dashboard to access the course materials and start your learning journey</p>

        </div>

        <a href="" class="dashboard-btn">Go to Dashboard</a>

        <div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
            href="mailto:info@studynotion.com">info@studynotion.com</a>. We are here to help!</div>

    </div>
</body>
</html>`;
}

