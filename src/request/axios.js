import axios from 'axios';
// import Qs from 'qs'

// 创建axios实例
const res = axios.create({
    withCredentials: true, // 默认的false  // `withCredentials` 表示跨域请求时是否需要使用凭证cookie
    timeout: 8000, // 请求超时时间
    baseURL: process.env.VUE_APP_BASE_API,
    // baseURL: '/webapi',
    headers: { post: { 'Content-Type': 'application/x-www-form-urlencoded' } },
});
// console.log(res.defaults);
// request拦截器
res.interceptors.request.use(config => {
    return config;
}, error => {
    // console.log("请求失败")
    Promise.reject(error);
});
// respone拦截器
res.interceptors.response.use(
    response => {
        if (response.data.Result === -11) {
            window.location.href = `https://login.lexun.com/login/touch/login.aspx?fw=`;
            return;
        }
        // console.log(response);
        return Promise.resolve(response.data)
    },
    error => {
        // 失败请求操作
        return Promise.reject(error);
    }
);


export default res;