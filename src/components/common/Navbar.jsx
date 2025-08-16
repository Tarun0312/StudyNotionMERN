import React, { useEffect, useState } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom';
import StudyNotionLogo from '../../assets/Logo/Logo-Full-Light.png';
import { NavbarLinks } from '../../data/navbar-links';
import {useSelector} from 'react-redux'
import { AiOutlineShoppingCart } from 'react-icons/ai';
import * as Constants from '../../constants/index';
import ProfileDropDown from '../core/Auth/ProfileDropDown';
import { apiConnector } from '../../services/apiConnector';
import { categories } from '../../services/serviceName';
import { IoIosArrowDropdownCircle } from "react-icons/io";

// const subCategories = [
//     {
//         title:"Python",
//         path:"catalog/python"
//     },
//     {
//         title:"Web Dev",
//         path:"catalog/web-dev"
//     },
//     {
//         title:"App Dev",
//         path:"catalog/app-dev"
//     },
//     {
//         title:"Devops",
//         path:"catalog/devops"
//     },

// ]

const Navbar = () => {


    const {token} = useSelector((state) => state.auth)
    const {user} = useSelector((state) => state.profile)
    const {totalItems} = useSelector((state) => state.cart)
    const [subCategories,setSubCategories] = useState([]);

    const fetchSubCategories = async () => {
        try{
            const result = await apiConnector("GET",categories.CATEGORIES_API)
            console.log(result,"result");
            setSubCategories(result.data.data)
        }catch(error){
            console.log("Could not able to fetch sub categories");
        }
    }

    useEffect(() => {
        fetchSubCategories();
    },[])


    const location = useLocation();
    const matchRoute = (route) => {
        return matchPath({path:route},location.pathname);
    }

    // method to show selected category in drop down on basis of url
    const checkSelectedCategory = (subCategory) => {
        subCategory = subCategory.toLowerCase().replaceAll(' ','-');
        return location.pathname.split('/').at(-1) === subCategory;
    }

  return (
    <div className='h-14 flex items-center border-b-[1px] border-richblack-700'>
        <div className='w-11/12  mx-auto  flex flex-row justify-between items-center'>

           {/* logo */}
            <Link to='/'>
                <img 
                    src={StudyNotionLogo}
                    alt={'Study Notion Logo'}
                    loading='lazy'
                    width={160}
                    height={42}
                />

            </Link>

            {/* Navbar */}
            <nav>
                <ul className='flex gap-x-6 text-richblack-25'>
                    {
                        NavbarLinks.map((navLink,index) => (
                                <li 
                                key={index}
                                >
                               
                                {
                                    navLink?.title === 'Catalog' ? 
                                    (   
                                        <div className='flex gap-2 items-center group relative'>
                                            <p className={`${location.pathname.includes('catalog')?'text-yellow-50':'text-richblack-25'}`} >{navLink?.title}</p>
                                            <IoIosArrowDropdownCircle className={`${location.pathname.includes('catalog')?'text-yellow-50':'text-richblack-25'}`}/>

                                            {/* drop down */}
                                            <div className='invisible absolute z-10 left-[50%] top-[170%] translate-x-[-50%]  rounded-md
                                            bg-richblack-5 text-richblack-900  
                                            flex flex-col p-4 opacity-0
                                            group-hover:visible group-hover:opacity-100 transition-all duration-200 lg:w-[300px] max-h-fit'>
                                                
                                                {/* triangle (rotate square by 45deg to make it diamond shape) */}
                                                <div className='absolute left-[50%] translate-y-[-40%] translate-x-[80%] top-0 w-6 h-6 rotate-45 bg-richblack-5 rounded-sm z-[-1]'></div>

                                                <div className='flex flex-col gap-y-1'>
                                                    {
                                                        subCategories?.length ? ( 
                                                            subCategories?.map((category,index) => (
                                                                <Link 
                                                                    key={index}

                                                                    to={`/catalog/${category.categoryName.replaceAll(' ','-').toLowerCase()}`}

                                                                    className={`${checkSelectedCategory(category.categoryName) && 'bg-richblack-50'}  p-3 text-lg font-md hover:bg-richblack-50 rounded-md transition-all duration-200 cursor-pointer`}
                                                                    >
                                                                    <p>{category?.categoryName}</p>
                                                                </Link>))
                                                            ) :
                                                            (
                                                                <div></div>
                                                            )
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                    ) : 
                                    (
                                        <Link to={navLink?.path}>
                                            <p className={`${matchRoute(navLink?.path) ? 'text-yellow-50' :'text-richblack-25'}`}>{navLink?.title}</p>
                                        </Link>
                                    )

                                }
                                </li>
                        ))
                    }
                </ul>
            </nav>


           {/* Login/Signup/Dashboard/Logout bUTTON CONTAINer  */}
           <div
            className='flex gap-x-4 items-center'>


                {/* cart icon shows after login and if user is not instructor */}
                
                {
                    token && user?.accountType !== Constants.INSTRUCTOR  && 
                    (
                        <Link to='/dashboard/cart' className='relative'>
                        <AiOutlineShoppingCart className='text-2xl'/>
                        {
                            totalItems > 0 && (
                                <span className='absolute right-[-20%] top-[-30%] text-sm bg-richblack-500 rounded-[50%] w-[20px] h-[20px] flex justify-center items-center animate-bounce transition-all duration-200'>{totalItems}</span>
                            )
                        }
                        </Link>
                    )
                }

                {/* Login btn */}
                
               {
                !token && (
                    <Link to='/login'>
                        <button className='font-inter text-richblack-100 border border-richblack-700 bg-richblack-800 px-4 py-2 rounded-md font-medium hover:scale-95 transition-all duration-200'>Login</button>
                    </Link>
                )
               }

                {/* signup btn */}

                {
                !token && (
                    <Link to='/signup'>
                        <button className='font-inter text-richblack-100 border border-richblack-700 bg-richblack-800 px-4 py-2 rounded-md font-medium hover:scale-95 transition-all duration-200'>Sign up</button>
                    </Link>
                )
               }



                {/* profile dropdown shows after login  */}
                {
                 token &&  (
                        <ProfileDropDown imageUrl={user?.imageUrl} />
                    )
                }



           </div>
           
        </div>
    
    </div>
  )
}

export default Navbar