import axios from "axios";

export default {
  instance(baseURL, token) {
    const instance = axios.create({
      baseURL: baseURL + "v1/",
      timeout: 3000,
    });

    // API Authentication
    instance.defaults.headers.common.Authorization = "Bearer " + token;

    return instance;
  }
};
