import React, { useState } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Loader from '../components/common/Loader';
import useSingleToast from '../hooks/useSingleToast';
import { forgetPassword } from '../services/operations/authApi';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"


const UpdatePasswordPage = () => {

    const {loading} = useSelector((state) => state.auth);

    const [formData,setFormData] = useState({
        newPassword:"",
        confirmPassword:""
    })
    const {errorToast} = useSingleToast();
    const [passwordUpdated,setPasswordUpdated] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [email,setEmail] = useState('')
    const [showNewPassword,setShowNewPassword] = useState(false)
    const [showConfirmNewPassword,setShowConfirmNewPassword] = useState(false)

    const handleOnChange = (event) => {
        const {name,value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]:value
        }))
    }

    const resetPassword = async (event) =>{
        event.preventDefault()
        if(!passwordUpdated){
            const token = location.pathname.split('/').at(-1);
            const result = await dispatch(forgetPassword({...formData,token},errorToast))
            if(result?.success){
                setPasswordUpdated(!passwordUpdated)
                setEmail(result?.updatedUser?.email)
            }
        }else{
            navigate('/login')
        }
    }

  return (
        <div>
            {
                loading
                ?(<Loader/>)
                :(<div className='h-[calc(100vh-56px)] w-[100vw] flex items-center justify-center'>

                <div className='p-4 flex flex-col gap-5 w-10/12 md:w-6/12 lg:w-5/12 xl:w-4/12'>
            
                    {/* heading  */}
                    <div className='flex flex-col gap-2'>
            
                        <div className='text-richblack-5 font-semibold text-2xl'>
                            {!passwordUpdated ? 'Choose New Password' : 'Reset Complete'}
                        </div>
                        <div className='text-richblack-100'>
                        {!passwordUpdated 
                        ? 'Almost done. Enter your new password and youre all set.'
                        :`All done! We have sent an email to ${email} to confirm`}
                        </div>
            
                    </div>
            
                    <form onSubmit={resetPassword} className='flex flex-col gap-4'>
                            {/* password fields */}
                        {
                            !passwordUpdated &&
                            (
                                <div className='flex flex-col gap-4'>
                                        <div className='flex flex-col gap-2 relative'>
                                                <label htmlFor='newPwd' className='text-richblack-5'>New Password <sup className='text-pink-200'>*</sup></label>
                                                <input
                                                    required
                                                    type={showNewPassword?'text':'password'}
                                                    placeholder='New Password'
                                                    name='newPassword'
                                                    value={formData.newPassword}
                                                    onChange={handleOnChange}
                                                    className='text-richblack-5 bg-richblack-800 rounded-md shadow-[0px_2px] shadow-[#FFFFFF2E] p-2 w-full'
                                                    id='newPwd'       
                                                />
                                                 <div 
                                                 className='absolute bottom-[10%] right-[2%] flex justify-center items-center text-richblack-5 cursor-pointer text-2xl'
                                                 onClick={() => setShowNewPassword(!showNewPassword)}
                                                 >
                                                {
                                                    showNewPassword 
                                                    ?(<AiOutlineEyeInvisible/>) 
                                                    :(<AiOutlineEye/>)
                                                }
                                                 </div>
                                        </div>
                        
                                        <div className='flex flex-col gap-2 relative'>
                                                <label htmlFor='confirmNewPwd'  className='text-richblack-5'>Confirm New Password <sup className='text-pink-200'>*</sup></label>
                                                <input
                                                    required
                                                    type={showConfirmNewPassword?'text':'password'}
                                                    placeholder='Confirm New Password'
                                                    name='confirmPassword'
                                                    value={formData.confirmPassword}
                                                    onChange={handleOnChange}
                                                    className='text-richblack-5 bg-richblack-800 rounded-md shadow-[0px_2px] shadow-[#FFFFFF2E] p-2 w-full'
                                                    id='confirmNewPwd'
                                                />
                                                 <div 
                                                 className='absolute bottom-[10%] right-[2%] flex justify-center items-center text-richblack-5 cursor-pointer text-2xl'
                                                 onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                                                 >
                                                {
                                                    showConfirmNewPassword 
                                                    ?(<AiOutlineEyeInvisible/>) 
                                                    :(<AiOutlineEye/>)
                                                }
                                                 </div>
                                        </div>
                                </div>
                            )
                        }
                
                        {/* button */}
                        <div className='flex flex-col gap-4'>
                                <button type='submit'
                                    className='bg-yellow-50 text-richblack-900 rounded-md text-center hover:scale-95 transition-all duration-200 w-full p-2'>
                                        {!passwordUpdated ? 'Reset Password' :'Return to login'}
                                    </button>
                                <div>
                                    <Link to='/login'>
                                        <div className='flex items-center gap-2 text-richblack-5'>
                                            <FaArrowLeftLong/>
                                            <p>Back to login</p>
                                        </div>
                                    </Link>
                                </div>    
                        </div>
                    </form>
                </div>
                
                </div> )
             }
        </div>
     )
}

export default UpdatePasswordPage