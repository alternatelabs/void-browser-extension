import axios from "axios";

export default {
  instance(baseURL: string, token: string | null) {
    const instance = axios.create({
      baseURL: baseURL + "api/v1/",
      timeout: 10000,
      withCredentials: token === "useCredentials",
    });

    // API Authentication
    if (token && token !== "useCredentials") {
      instance.defaults.headers.common.Authorization = "Token " + token;
    }

    // instance.interceptors.response.use(response => response, (error) => {
    //   // Do something with response error
    //   if (error.response.status === 401
    //     #TODO open voidapp.co to sign in
    //     && !error.response.request.responseURL.match(/auth$/)) {
    //     console.error("Unauthorized request, signing out.");
    //     localStorage.removeItem("apiToken");
    //     localStorage.removeItem("userData");
    //     window.location.reload();
    //   }

    //   return Promise.reject(error);
    // });

    return instance;
  }
};
