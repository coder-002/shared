import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";
import { getBearerToken } from "../authService";
import { errorMiddleware, successMiddleware } from "./middleware";

export type requestMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "OPTIONS"
  | "HEAD"
  | "TRACE"
  | "CONNECT";

interface ApiRequestOptions<TResponse> {
  baseUrl: string;
  url: string;
  method: requestMethod;
  data?: object;
  header?: object;
  params?: object;
  onError?: false | ((error: AxiosError) => void);
}

export async function AuthorizedApiRequest<TResponse>({
  baseUrl,
  url,
  method,
  data,
  header,
  params,
  onError,
}: ApiRequestOptions<TResponse>): Promise<AxiosResponse<TResponse>> {
  const token = getBearerToken();
  const headers = { ...header, Authorization: `Bearer ${token}` };

  const apiCallData: AxiosRequestConfig = {
    method: method as Method,
    url,
    data,
    params,
    headers,
  };

  const axiosInstance = axios.create({ baseURL: baseUrl });

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      successMiddleware(response);
      return response;
    },
    (error: AxiosError) => {
      errorMiddleware(error);
      return Promise.reject(error);
    }
  );

  return await axiosInstance
    .request<TResponse>(apiCallData)
    .catch((error: AxiosError) => {
      throw error.response ?? "Error while making request";
    });
}
