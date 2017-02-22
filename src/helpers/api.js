import axios from "axios";

export default {
  instance(baseURL, token) {
    const instance = axios.create({
      baseURL: baseURL + "api/v1/",
      timeout: 3000,
    });

    // API Authentication
    instance.defaults.headers.common.Authorization = "Token " + token;

    return instance;
  }
};
