const BASE_URL = process.env.REACT_APP_BASE_URL

export const AUTH_ENDPOINTS = {
    SEND_OTP: BASE_URL + '/auth/sendOTP',
    SIGN_UP : BASE_URL + '/auth/signup',
    LOGIN : BASE_URL + '/auth/login',
    RESET_PASSWORD_TOKEN : BASE_URL + '/auth/reset-password-token',
    RESET_PASSWORD : BASE_URL + '/auth/reset-password'
}
export const categories = {
    CATEGORIES_API: BASE_URL + '/course/getAllCategories',
}

