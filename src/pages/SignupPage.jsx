import signupImg from "../assets/Images/signup.webp"
import Template from "../components/core/Auth/Template"
import { FORM_TYPE } from "../utils"

function SignupPage() {
  return (
    <Template
      title="Join the millions learning to code with StudyNotion for free"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={signupImg}
      formType={FORM_TYPE.SIGNUP}
    />
  )
}

export default SignupPage