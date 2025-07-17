import axios from "axios";
import { isRunningOnLocalHost } from "@/shared/helper/urlHelper";

function getHomeUrl() {
  return isRunningOnLocalHost() ? window.location.origin : "";
}

export function redirectToHomePage(): void {
  window.location.href = getHomeUrl();
}

export const redirectToLoginPage = async () => {
  if (isRunningOnLocalHost()) {
    window.location.href = `https://auth.premiumtech.com.np/login?clientId=DEV&returnUrl=${window.location}`;
  } else {
    const res = await axios.get(`/home/login?returnUrl=${location.href}`);
    if (res) location.href = res.data;
  }
};
