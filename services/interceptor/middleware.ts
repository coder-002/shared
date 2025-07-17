import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

import {
  addPendingErrorMessage,
  showErrorMessage,
} from "@/shared/helper/message-helper/messageHelper";
import {
  redirectToHomePage,
  redirectToLoginPage,
} from "@/shared/helper/redirectionHelper";

export function preflightMiddleware(config: InternalAxiosRequestConfig) {
  return config;
}

export function successMiddleware(response: AxiosResponse): void {
  if (response.status === 200) return;
  if (response.status === 203) {
    addPendingErrorMessage(
      "This action is reserved for unauthorized users only!"
    );
    redirectToHomePage();
  }
}

export function errorMiddleware(error: AxiosError): void {
  if (error?.response?.status === 401) redirectToLoginPage();
  if (error?.response?.status === 403) {
    addPendingErrorMessage("You are not authorized to perform this action!");
    redirectToHomePage();
  }
  if (error?.code === "ERR_NETWORK") findAndShowErrorMessageFromResponse(error);
  if (error?.response?.status === 500)
    findAndShowErrorMessageFromResponse(error);
}

const findAndShowErrorMessageFromResponse = (error: any) => {
  const message =
    error?.response?.data?.ExceptionMessage?.toString() ??
    error?.response?.data?.exceptionMessage?.toString() ??
    error?.response?.data?.Message?.toString() ??
    error?.response?.data?.message?.toString() ??
    error?.response?.data?.Info?.toString() ??
    error?.response?.data?.info?.toString() ??
    error?.ExceptionMessage?.toString() ??
    error?.exceptionMessage?.toString() ??
    error?.Message?.toString() ??
    error?.message?.toString() ??
    error?.Info?.toString() ??
    error?.info?.toString() ??
    "Error while making API call.";
  showErrorMessage(message);
};
