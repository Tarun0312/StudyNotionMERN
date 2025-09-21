import { setLoading, setToken } from '../../slices/AuthSlice';
import { resetCart } from '../../slices/CartSlice';
import { setUser } from '../../slices/ProfileSlice';
import { apiConnector } from '../apiConnector';
import { AUTH_ENDPOINTS } from '../serviceName';

export function sendOTP (email,loadingToast,successToast,errorToast,navigate){
    return async(dispatch) => {
        loadingToast();
        try{
            const result = await apiConnector("POST",AUTH_ENDPOINTS.SEND_OTP,{email})
    
            if(!result?.data?.success){
                throw new Error(result?.data?.message)
            }
            successToast(result?.data?.messag)
            navigate('/verify-email')
        }catch(error){
                const errorMessage = error?.response?.data?.message
                console.log("SEND_OTP_ERROR_RESPONSE",error);
                errorToast(errorMessage)
        }
    }
   
}

export function signup (body,loadingToast,successToast,errorToast,navigate){
    return async(dispatch) => {
        loadingToast();
        try{
            const result = await apiConnector("POST",AUTH_ENDPOINTS.SIGN_UP,body);
            const response=  result?.data;
            console.log("response",response);
            if(!response?.success){
                throw new Error(response?.message)
            }
            successToast(response?.message);
            navigate("/login");
    
        }catch(error){
            const errorMessage = error.response?.data?.message
            console.log("SIGNUP_ERROR_RESPONSE..",error)
            errorToast(errorMessage)
        }
    
    }
   
}

export function login (body,loadingToast,successToast,errorToast,navigate){
   return async(dispatch) => {
    loadingToast();
    try{
        const result = await apiConnector("POST",AUTH_ENDPOINTS.LOGIN,body);
        const response = result?.data;
        if(!response?.success){
            throw new Error(response?.message)
        }
        successToast(response?.message)

        localStorage.setItem("loginResponse",JSON.stringify(response?.userExist))
        // set token in redux state and local storage
        dispatch(setToken(response?.token))
        localStorage.setItem('token',JSON.stringify(response?.token));

        // set user data in profile
        dispatch(setUser(response?.userExist))

        navigate("/dashboard");
    }catch(error){
        const errorMessage = error?.response?.data?.message
        console.log("LOGIN_ERROR_RESPONE..",error)
        errorToast(errorMessage)
    }
   }
    
}

export function sendForgetPasswordTokenToMail (body,errorToast){
   return async (dispatch) => {
    let response = {}
    dispatch(setLoading(true))
    try{
        response = await apiConnector("POST",AUTH_ENDPOINTS.RESET_PASSWORD_TOKEN,body);

        if(!response?.data?.success){
            throw new Error(response?.data?.message)
        }
    }catch(error){
        const errorMessage = error?.response?.data?.message
        console.log("FORGET_PASSWORD_TOKEN_API_ERROR_RESPONSE...",error)
        errorToast(errorMessage);
    }
    dispatch(setLoading(false))
    return response?.data;
   }

}

export function forgetPassword (body,errorToast){
    return async (dispatch) => {
        dispatch(setLoading(true))
        let response = {}
        try{
            response = await apiConnector("POST",AUTH_ENDPOINTS.RESET_PASSWORD,body);
            if(!response?.data?.success){
                throw new Error(response?.data?.message)
            }
        }catch(error){
            const errorMessage = error?.response?.data?.message
            console.log("FORGET_PASSWORD_API_ERROR_RESPONSE...",error);
            errorToast(errorMessage);
        }
        dispatch(setLoading(false))
        return response?.data;
    }

}

export function logout (successToast,navigate){
    return async(dispatch) => {
        dispatch(setToken(null))
        dispatch(setUser(null))
        dispatch(resetCart())
        successToast("Logged out")
        localStorage.clear()
        navigate('/')
    }
}