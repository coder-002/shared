import { AxiosError } from "axios";
import { isRunningOnLocalHost } from "../helper/urlHelper";
import { AuthorizedApiRequest } from "./interceptor/axiosService";

export const dashboardUrl = "/home/";
export const baseUrl = isRunningOnLocalHost()
  ? "http://168.119.14.23:8000"
  : "";

export const baseEndpoint = "/api";

function getEndpointUrl(url: string) {
  const trimmedBaseEndpoint = baseEndpoint.replace(/\/$/, "");
  const trimmedUrl = url.replace(/^\//, "");
  return `${trimmedBaseEndpoint}/${trimmedUrl}`;
}

export async function get<TResponse>(
  url: string,
  onError?: false | ((error: AxiosError) => void)
) {
  const result = await AuthorizedApiRequest<TResponse>({
    baseUrl,
    method: "GET",
    url: getEndpointUrl(url),
    data: undefined,
    header: undefined,
    params: undefined,
    onError,
  });
  if (!result) {
    throw new Error("GET request returned undefined");
  }

  return result;
}

export async function post<TResponse>(
  url: string,
  body?: object,
  header?: object,
  onError?: false | ((error: AxiosError) => void)
) {
  const result = await AuthorizedApiRequest<TResponse>({
    baseUrl,
    method: "POST",
    url: getEndpointUrl(url),
    data: body,
    header,
    params: undefined,
    onError,
  });

  if (result) {
    return result;
  }
}

export async function put<TResponse>(
  url: string,
  body?: object,
  onError?: false | ((error: AxiosError) => void)
) {
  const result = await AuthorizedApiRequest<TResponse>({
    baseUrl,
    method: "PUT",
    url: getEndpointUrl(url),
    data: body,
    header: undefined,
    params: undefined,
    onError,
  });
  if (result) {
    return result;
  }
}

export async function del(url: string) {
  const result = await AuthorizedApiRequest<void>({
    baseUrl,
    url: getEndpointUrl(url),
    method: "DELETE",
  });
  if (result) {
    return result;
  }
}
