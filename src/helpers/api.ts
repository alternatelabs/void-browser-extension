import qs from "qs";
import storage from "../helpers/storage";

type RequestType = "get" | "post" | "put" | "patch" | "delete";

type StringDict = {
  [s: string]: string;
};

function withAuthHeader(token: any, headers: StringDict): StringDict {
  const newHeaders = {
    ...headers,
  };

  console.log("withAuthHeader", token);

  if (typeof token === "string") newHeaders["Authorization"] = `Token ${token}`;

  return newHeaders;
}

const makeRequest = async (
  requestType: RequestType,
  url: string,
  params: any | null
) => {
  const data = await storage.get();
  return await fetch(url, {
    method: requestType,
    headers: withAuthHeader(data.token, {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    }),
    credentials: "same-origin",
    body: params ? JSON.stringify(params) : undefined,
  });
};

export const getRequest = async function (url: string, params: any = null) {
  const queryString = params ? qs.stringify(params) : "";
  const data = await storage.get();
  return await fetch(`${url}?${queryString}`, {
    credentials: "same-origin",
    headers: withAuthHeader(data.token, {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    }),
  });
};
export const postRequest = async (url: string, params: any = null) =>
  await makeRequest("post", url, params);
export const putRequest = async (url: string, params: any = null) =>
  await makeRequest("put", url, params);
export const patchRequest = async (url: string, params: any = null) =>
  await makeRequest("patch", url, params);
export const deleteRequest = async (url: string, params: any = null) =>
  await makeRequest("delete", url, params);

export const buildURL = (baseURL: string, path: string) => {
  return `${baseURL}api/v1/${path}`;
};

export default {
  getRequest,
  postRequest,
  putRequest,
  patchRequest,
  deleteRequest,
  buildURL,
};
