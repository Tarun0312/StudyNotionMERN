import axios from 'axios';

const axiosInstance = axios.create({});

export const apiConnector = (method,url,body,headers,params) => {
    return axiosInstance({
        method:method,
        url:url,
        body: body ?? null,
        headers: headers ?? null,
        params: params ?? null
    })
}