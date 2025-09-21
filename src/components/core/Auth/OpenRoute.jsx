import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const OpenRoute = ({children}) => {
    const { token } = useSelector((state) => state.auth)

    if(token){
        // logged in user
        debugger
        return <Navigate to='/dashboard' />
    }else{
        // user not logged in
        return children
    }
  
}

export default OpenRoute