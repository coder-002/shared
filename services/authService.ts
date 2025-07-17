import axios from "axios";
import qs from 'query-string';
import {resetInactiveTimer} from "@/shared/helper/idlePageHandler.ts";
import {isRunningOnLocalHost} from "@/shared/helper/urlHelper.ts";


export interface LoginResponse {
  error: string | null;
  token: string | null;
  refreshToken: string | null;
  branches: any | null;
}
const localStorageAuthTokenKey = "PremiumCbsAuthToken";

export function getBearerToken() {
  return sessionStorage.getItem(localStorageAuthTokenKey);
}

export function setBearerToken(token: string) {
  sessionStorage.setItem(localStorageAuthTokenKey, token);
  window.dispatchEvent(new Event("token-change"));
  localStorage.setItem(localStorageAuthTokenKey, "***");
}

export function getRefreshToken() {
  const jwtToken = getBearerToken();
  if (!jwtToken) return "";
  const jwt = JSON.parse(atob(jwtToken.split(".")[1]));
  return jwt.rid;
}

export async function refreshSession() {
  const refreshToken = getRefreshToken();
  const bearerToken = getBearerToken();

  const res = await axios.get(
    `https://auth.premiumtech.com.np/refresh/${refreshToken}`,
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    }
  );

  if (res) {
    const result = res.data as { token: string };

    if (result.token) setBearerToken(result.token);
    return;
  }
}


export const handleTokenAndReturnUrlInQueryString = async()=>{
  const parameter = qs.parse(window.location.search);
  if(parameter.token){
    resetInactiveTimer();
    setBearerToken(parameter.token.toString())

    const response = await axios.post<LoginResponse>(
        isRunningOnLocalHost() ? "http://168.119.14.23/api/login" :"/login",{}, {
          headers: {
            Authorization: `Bearer ${parameter.token.toString()}`,
          },
        }
    );
    if (response.data) {
      setBearerToken(response?.data?.token?.toString() ?? "");
    }
    if (parameter.returnUrl) {
      if (isRunningOnLocalHost(parameter.returnUrl.toString() ?? "")) {
        window.location.href = `${parameter.returnUrl}?token=${parameter.token}`;
        return;
      } else {
        window.location.href = `${parameter.returnUrl}`;
        return;
      }
    } else {
      window.location.href = "/";
      return;
    }

  }
}


function getRefreshTimeInMillisecondsFromJwt() {
  const jwtToken = getBearerToken();
  if (!jwtToken) return 0;
  const jwt = JSON.parse(atob(jwtToken.split(".")[1]));
  const jwtRemainingLifeInMilliseconds = jwt.exp * 1000 - Date.now();

  // noinspection UnnecessaryLocalVariableJS
  const oneMinuteInMillisecond = 1000 * 60;
  // noinspection UnnecessaryLocalVariableJS
  const refreshBefore = oneMinuteInMillisecond;

  let refreshTimeInMilliseconds =
      jwtRemainingLifeInMilliseconds - refreshBefore;
  if (refreshTimeInMilliseconds < 0) refreshTimeInMilliseconds = 0;
  return refreshTimeInMilliseconds;
}



export function launchRefreshSessionLoop() {
  const jwtToken = getBearerToken();
  if (!jwtToken) return;
  const refreshTimeInMilliseconds = getRefreshTimeInMillisecondsFromJwt();

  const refresh = () => {
    refreshSession()
        .then(() => {
          setTimeout(() => launchRefreshSessionLoop(), 1000);
        })
        .catch(() => {
          //todo remove this
          // addPendingErrorMessage(
          //     "Unable to refresh session. Resulting in page reloaded."
          // );
          // logout().catch(() => window.location.reload());
        });
  };

  if (refreshTimeInMilliseconds > 0)
    setTimeout(refresh, refreshTimeInMilliseconds - 5000);
  else refresh();
}
