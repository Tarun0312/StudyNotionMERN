import React, { useEffect, useRef, useState } from 'react'
import { RxDashboard } from "react-icons/rx";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

const ProfileDropDown = ({imageUrl}) => {
  const [openDropDown,setOpenDropDown]=useState(false);
  const profileDropDownRef =  useRef(null);

  useEffect(() => {

    // close dropdown down if click outside profile icon and drop down
    const clickOutsideOfProfileDropDown = (event) => {
      if(!profileDropDownRef?.current?.contains(event.target)){
        setOpenDropDown(false);
      }
    }
    document.addEventListener('mousedown',clickOutsideOfProfileDropDown);
    return () => document.addEventListener('mousedown',clickOutsideOfProfileDropDown);
  },[]);
  const navigate = useNavigate();

  const goToDashboard = () => {
    setOpenDropDown(false)
    navigate('/dashboard')
  }

  const logoutUser = () => {

    setOpenDropDown(false);
    navigate('/')
  }

  

  return (
    <div ref={profileDropDownRef}
         className="flex flex-col items-center gap-2 relative">
        {/* profile icon */}
        <div className='lg:w-8 lg:h-8 cursor-pointer'
          onClick={() => setOpenDropDown((prev) => !prev)}>
          <img src={imageUrl} alt='profileIcon'
              className='rounded-full'          
           />
        </div>

        {/* triangle ,make square then rotate 45 deg to make diamond which acts like triangle by overlapaping */}
        {
          openDropDown && (<div className='bg-richblack-700 lg:w-6 lg:h-6 rotate-45 absolute top-[120%]'></div>
          )
        }

        {/* profile dropdown */}
        {
          openDropDown && (<div className='flex flex-col gap-y-1 lg:w-48 bg-richblack-700 text-richblack-25 absolute z-[999] top-[50%] translate-y-[35%] translate-x-[-20%] rounded-md p-2'>

              {/* Go To Dashboard */}
              <div 
                className='py-1 px-2 flex gap-2 items-center cursor-pointer hover:bg-richblack-500 transition-all duration-200 rounded-md'
                onClick={goToDashboard}>
                  <RxDashboard/>
                  <p>Go To Dashboard</p>
              </div>
              
              {/* Logout */}
              <div className='py-1 px-2 flex gap-2 items-center cursor-pointer
              hover:bg-richblack-500 transition-all duration-200 rounded-md' onClick={logoutUser}>
                <TbLogout2/>
                <p>Logout</p>
              </div>
          </div>)
        }
    </div>
  )
}

export default ProfileDropDown