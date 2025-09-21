import axios from 'axios';

const axiosInstance = axios.create({});

export const apiConnector = (method,url,body,headers,params) => {
    console.log("body",body)
    return axiosInstance({
        method:method,
        url:url,
        data: body ?? null,
        headers: headers ?? null,
        params: params ?? null
    })
}