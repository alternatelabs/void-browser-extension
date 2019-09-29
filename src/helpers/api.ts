import qs from "qs"

type RequestType = "get" | "post" | "put" | "patch" | "delete"

type StringDict = {
  [s: string]: string
}

type ApiToken = string | null

function withAuthHeader(headers: StringDict, apiToken: ApiToken): StringDict {
  const newHeaders = {
    ...headers,
  }

  if (apiToken) newHeaders["Authorization"] = `Token ${apiToken}`

  return newHeaders
}

const makeRequest = async (requestType: RequestType, url: string, params: any | null , apiToken: ApiToken) => {
  return await fetch(url, {
    method: requestType,
    headers: withAuthHeader({
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest"
    }, apiToken),
    credentials: "same-origin",
    body: params ? JSON.stringify(params) : undefined
  })
}

export function createFetchAPI(baseURL: string, apiToken: ApiToken) {
  const URLPrefix = `${baseURL}api/v1/`
  return {
    getRequest: async function(url: string, params: any = null) {
      const queryString = params ? qs.stringify(params) : ""
      return await fetch(`${URLPrefix}${url}?${queryString}`, {
        credentials: "same-origin",
        headers: withAuthHeader({
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        }, apiToken)
      })
    },
    postRequest: async (url: string, params: any = null) => (await makeRequest("post", URLPrefix + url, params, apiToken)),
    putRequest: async (url: string, params: any = null) => (await makeRequest("put", URLPrefix + url, params, apiToken)),
    patchRequest: async (url: string, params: any = null) => (await makeRequest("patch", URLPrefix + url, params, apiToken)),
    deleteRequest: async (url: string, params: any = null) => (await makeRequest("delete", URLPrefix + url, params, apiToken)),
  }
}

export default {
  createFetchAPI
};
