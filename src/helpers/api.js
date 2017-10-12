import axios from "axios";

export default {
  instance(baseURL, token) {
    const instance = axios.create({
      baseURL: baseURL + "api/v1/",
      timeout: 3000,
    });

    // API Authentication
    if (token) {
      instance.defaults.headers.common.Authorization = "Token " + token;
    }

    instance.interceptors.response.use(response => response, (error) => {
      // Do something with response error
      if (error.response.status === 401
        && !error.response.request.responseURL.match(/auth$/)) {
        console.error("Unauthorized request, signing out.");
        localStorage.removeItem("apiToken");
        localStorage.removeItem("userData");
        window.location.reload();
      }

      return Promise.reject(error);
    });

    return instance;
  }
};
