import Cookies from "js-cookie";

const ACCESS_TOKEN = "CP360";
const REFRESH_TOKEN = "CP360-REFRESH";

// Sets access token to localStorage
export const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN, token);
};

// Gets access token from localStorage
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN);
};

// Removes access token from localStorage
export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN);
};

// Decodes JWT token to extract payload
export const tokenDecoded = (token) => {
  try {
    return token ? JSON.parse(atob(token.split(".")[1])) : null;
  } catch {
    return null;
  }
};

// Checks if access token is expired
export const isTokenExpired = () => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) return true;

    const payload = tokenDecoded(accessToken);
    if (!payload || !payload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

// Stores refresh token in Cookies
export const setRefreshToken = (refreshToken) => {
  Cookies.set(REFRESH_TOKEN, refreshToken, {
    secure: true,
    sameSite: "Strict",
  });
};

// Gets refresh token from Cookies
export const getRefreshToken = () => {
  return Cookies.get(REFRESH_TOKEN);
};

// Removes refresh token from Cookies
export const removeRefreshToken = () => {
  Cookies.remove(REFRESH_TOKEN);
};
