import React, { useEffect, useState } from 'react';
import { FaArrowLeftLong } from "react-icons/fa6";
import { RxCountdownTimer } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/common/Loader';
import useSingleToast from '../hooks/useSingleToast';
import { sendOTP, signup } from '../services/operations/authApi';



const VerifyEmailPage = () => {

  const [otp,setOtp] = useState(Array(6).fill("")) 

  const navigate = useNavigate();
  const {successToast,errorToast,loadingToast} = useSingleToast();
  const {loading,signupData} = useSelector((state) => state.auth);
  const dispatch = useDispatch()



  const handleOnKeyDown = (event,index) => {
       
    // allow only numbers
    if(event.key>=0 && event.key<=9){
        event.preventDefault()
        const newOtp = [...otp];
        // if a number already present then allow input to change the number without user need to remove no. by backspace 
        newOtp[index] = event.key
        setOtp(newOtp)
        console.log(otp)

        // after entering number move focus to next field
        if(index < otp.length-1){
            document.getElementById(`otp-${index+1}`)?.focus()
        }

    }else if(event.key === 'Backspace'){
        const newOtp = [...otp];
        newOtp[index]=""
        setOtp(newOtp);
        // after removing number move focus to prev field
        if( index > 0){
            document.getElementById(`otp-${index-1}`)?.focus()       
     }

    }
       
  }

  const handleOnSubmit = (event) => {
    event.preventDefault();
    const combinedOTP = otp.reduce((prevValue,currentValue) => prevValue+currentValue,"");
    console.log(combinedOTP,"combinedOTP");

    dispatch(signup({...signupData,otp:combinedOTP},loadingToast,successToast,errorToast,navigate))
    console.log("form Data",otp)
  }

  //resend otp to email   
  const resendEmail = () => {
        if(otp){
            setOtp(Array(6).fill(''))
        }
        dispatch(sendOTP(signupData?.email,loadingToast,successToast,errorToast,navigate));
  }

  //   if no signup data then navigate to home page
  useEffect(() => {
    if(!signupData){
        navigate('/')
    }
  },[signupData,navigate])

  return (
   
    <div>
        {
            loading ?
            (<Loader></Loader>) :
            (<div className='h-[calc(100vh-56px)] w-[100vw] flex items-center justify-center'>
                <div className='p-4 flex flex-col gap-5 w-10/12 md:w-6/12 lg:w-5/12 xl:w-4/12'>

                    <div className='flex flex-col gap-3'>
                        <h3 className='font-semibold text-2xl leading-[2.4rem] text-richblack-5'>Verify Email</h3>
                        <p className='text-richblack-100'>A verification code has been sent to you. Enter the code below</p>
                    </div>

                    <form onSubmit={handleOnSubmit}
                        className='flex flex-col gap-5'>
                        {/* otp 6 field for input */}
                        
                    <div className='flex gap-2 w-full'>
                        {
                                otp.map((digit,index) => (
                                    <input 
                                        key={index}
                                        required
                                        id={`otp-${index}`}
                                        type="text"
                                        value={digit}
                                        maxLength={1}
                                        onKeyDown={(event) => handleOnKeyDown(event,index)}
                                        className="text-richblack-5 bg-richblack-800 rounded-md shadow-[0px_1px_0px_0px] shadow-[#FFFFFF2E] w-[calc(100%/6)] h-12 text-center"
                                        placeholder='-'
                                    />
                                ))
                            }
                    </div>

                        {/* button */}
                        <button type='submit'
                        className='bg-yellow-50 rounded-md text-richblack-900 w-full py-2'
                        > Verify and Register</button>
                    </form>

                    <div className='flex justify-between items-center'>
                        <div className='text-richblack-5 flex items-center gap-1 cursor-pointer'>
                            <FaArrowLeftLong/>
                            <Link to='/login'>Back To Login</Link>
                        </div>

                        <div className='text-blue-100 flex items-center gap-1 cursor-pointer' onClick={resendEmail}>
                            <RxCountdownTimer/>
                            <p>Resend it</p>
                        </div>
                    </div>
                </div>
            </div>)
        }
    </div>

  )
}

export default VerifyEmailPage