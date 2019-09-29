import qs from "qs"

type RequestType = "get" | "post" | "put" | "patch" | "delete"

type StringDict = {
  [s: string]: string
}

type ApiToken = string | null

function withAuthHeader(headers: StringDict): StringDict {
  const apiToken: ApiToken = localStorage.getItem("apiToken")

  const newHeaders = {
    ...headers,
  }

  console.log("withAuthHeader", apiToken)

  if (apiToken) newHeaders["Authorization"] = `Token ${apiToken}`

  return newHeaders
}

const makeRequest = async (requestType: RequestType, url: string, params: any | null) => {
  return await fetch(url, {
    method: requestType,
    headers: withAuthHeader({
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest"
    }),
    credentials: "same-origin",
    body: params ? JSON.stringify(params) : undefined
  })
}

export const getRequest = async function(url: string, params: any = null) {
  const queryString = params ? qs.stringify(params) : ""
  return await fetch(`${url}?${queryString}`, {
    credentials: "same-origin",
    headers: withAuthHeader({
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest"
    })
  })
}
export const postRequest = async (url: string, params: any = null) => (await makeRequest("post", url, params))
export const putRequest = async (url: string, params: any = null) => (await makeRequest("put", url, params))
export const patchRequest = async (url: string, params: any = null) => (await makeRequest("patch", url, params))
export const deleteRequest = async (url: string, params: any = null) => (await makeRequest("delete", url, params))

export const buildURL = (baseURL: string, path: string) => {
  return `${baseURL}api/v1/${path}`
}

export default {
  getRequest,
  postRequest,
  putRequest,
  patchRequest,
  deleteRequest,
  buildURL
};
