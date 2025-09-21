import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import useSingleToast from "../../../hooks/useSingleToast"
import { sendOTP } from "../../../services/operations/authApi"
import Tab from "../../common/Tab"
import CountryCodes from '../../../data/countrycode.json';
import { IoIosArrowDropdown } from "react-icons/io";
import { ACCOUNT_TYPE } from "../../../utils"
import { useDispatch,useSelector } from "react-redux"
import { setSignupData } from "../../../slices/AuthSlice"

 // data to pass to Tab component
 const tabData = [
  {
    id: 1,
    tabName: ACCOUNT_TYPE.STUDENT,
   
  },
  {
    id: 2,
    tabName: ACCOUNT_TYPE.INSTRUCTOR,
   
  },
]

function SignupForm() {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    selectedCode:CountryCodes.filter(country => country.code === "+91")[0]?.code,
    contactNumber:"",
    password: "",
    confirmPassword: "",
  })


  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { firstName, lastName, email,contactNumber,selectedCode, password, confirmPassword } = formData

  const [accountType, setAccountType] = useState(tabData[0].tabName)


  // Handle input fields, when some value changes
  const handleOnChange = (e) => { 
    if(e.target.name==="contactNumber"){
       const value = e.target.value.replace(/\D/g, "");
       setFormData((prevData) => ({
        ...prevData,
        [e.target.name] : value,
      }))
    }
    else{
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name] : e.target.value,
    }))
  }
  }

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {signupData} = useSelector((state) => state.auth)
  const {successToast,errorToast,loadingToast} = useSingleToast();

  
  // Handle Form Submission
  const handleOnSubmit =async (e) => {
    e.preventDefault()
    if(contactNumber.length !== 10){
      errorToast("Phone Number must be a 10 digit")
      return;
    }

    if(password!==confirmPassword){
      errorToast("Password and Confirm Password must be same")
      return
    }
   
    // save form data in state so that when user enter otp we can pass store state to signup
    const body = {firstName, lastName, email,contactNumber, password, confirmPassword ,countryCode:selectedCode,accountType}

    dispatch(setSignupData(body))
    console.log("user",signupData);

    dispatch(sendOTP(email,loadingToast,successToast,errorToast,navigate))

 
 
  }

  return (
    <div>
      {/* Tab */}
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />

      {/* Form */}
      <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
        <div className="flex gap-x-4">
          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              First Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleOnChange}
              placeholder="Enter first name"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
          </label>
          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Last Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleOnChange}
              placeholder="Enter last name"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
          </label>
        </div>
        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Email Address <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="email"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter email address"
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          />
        </label>
        <label className="w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">Contact Number <sup className="text-pink-200">*</sup></p>
            <div className="flex gap-3 w-full relative">
                <select
                    name="selectedCode"
                    value={selectedCode}
                    onChange={handleOnChange}
                    style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                    className="w-[25%] rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 text-transparent">
                    {/* custom selected text */}
                   
                    {
                      CountryCodes?.map((countryCode,index) => (
                        <option 
                        key={index}
                        value={countryCode.code}
                        >{countryCode.code} {countryCode.country}
                        </option>
                      ))
                    }
                </select>

                {/* custom selected text shown in place of select */}
                <div className="text-richblack-5 absolute top-[20%] left-0 translate-x-2 translate-y-1 flex items-center pointer-events-none justify-between lg:w-[17%]">
                    <p>{`${selectedCode?.length > 4 ? selectedCode.substring(0,4)+'..': selectedCode}`}</p>
                        <IoIosArrowDropdown/>
                </div>
                
                {/* phone number*/}

                <input 
                  type="text"
                  required
                  name="contactNumber"
                  pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                  minLength={10}
                  maxLength={10}
                  value={contactNumber}
                  onChange={handleOnChange}
                  placeholder='Enter 10 digit number'
                  style={{
                          boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                  className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                />
            </div>
        </label>
        <div className="flex gap-x-4">
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Create Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Confirm Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
        </div>
        <button
          type="submit"
          className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900 hover:scale-95 transition-all duration-200"
        >
          Create Account
        </button>
      </form>
    </div>
  )
}

export default SignupForm