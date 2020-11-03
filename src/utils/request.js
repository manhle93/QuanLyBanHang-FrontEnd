import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers["Authorization"] = "Bearer " + getToken();
    }
    return config;
  },
  error => {
    // do something with request error
    // // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;

    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //     Message({
    //         message: res.message || 'Error',
    //         type: 'error',
    //         duration: 5 * 1000
    //     })

    //     // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //         // to re-login
    //         MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //             confirmButtonText: 'Re-Login',
    //             cancelButtonText: 'Cancel',
    //             type: 'warning'
    //         }).then(() => {
    //             store.dispatch('user/resetToken').then(() => {
    //                 location.reload()
    //             })
    //         })
    //     }
    //     return Promise.reject(new Error(res.message || 'Error'))
    // } else {

    return res;
    //}
  },
  error => {
    if (
      error.response &&
      error.response.status &&
      error.response.status === 422
    ) {
      for (let field in error.response.data.errors) {
        error.response.data.errors[field].forEach(error => {
          Message({
            message: error,
            type: "error",
            duration: 2 * 1000
          });
        });
      }
    } else if (
      error.response &&
      error.response.data.message == "Unauthenticated."
    ) {
      // to re-login
      MessageBox.confirm("Phiên làm việc đã kết thúc, vui lòng đăng nhập lại để tiếp tục", "Hết phiên làm việc", {
        confirmButtonText: "Đăng nhập lại",
        cancelButtonText: "Hủy bỏ",
        type: "warning"
      }).then(() => {
        store.dispatch("user/resetToken").then(() => {
          location.reload();
        });
      });
    } else if (error.response) {
      Message({
        message: error.response.data.message,
        type: "error",
        duration: 5 * 1000
      });
    }

    return Promise.reject(error);
  }
);

export default service;
