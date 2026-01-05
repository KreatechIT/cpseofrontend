import axiosPublicInstance from "@/services/axiosPublicInstance";
import store, { persistor } from "@/store";
import { removeAccessToken, removeRefreshToken } from "@/utils/tokenHelper";
import { removeAuthData } from "../store/authSlice";

const adminLogin = async (data) => {
  try {
    const res = await axiosPublicInstance({
      method: "POST",
      url: "/login/admin-access-token/",
      data,
    });

    return res;
  } catch (err) {
    throw new Error(err);
  }
};

const memberLogin = async (data) => {
  try {
    const res = await axiosPublicInstance({
      method: "POST",
      url: "/login/member-access-token/",
      data,
    });

    return res;
  } catch (err) {
    throw new Error(err);
  }
};

const logout = () => {
  removeAccessToken();
  removeRefreshToken();

  store.dispatch(removeAuthData());
  persistor.purge();
};

export { adminLogin, memberLogin, logout };
