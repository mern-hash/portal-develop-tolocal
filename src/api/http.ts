import axios from "axios";
import { getToken, removeToken, setToken } from "../core/storage";
import qs from "qs";

export const httpService = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

httpService.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token && new Date() < new Date(token!.accessTokenExpiresAt)) {
      config.headers.Authorization = `Bearer ${token.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpService.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;
    if (response) {
      // 401 - unauthorized
      if (response.status === 401) {
        try {
          const user = {
            admin: "admin",
            "institution-admin": "institution",
          };

          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL}/${user[getToken()?.scope!]}/oauth`,
            qs.stringify({
              refresh_token: getToken()?.refreshToken,
              client_id: "web",
              grant_type: "refresh_token",
            })
          );
          httpService.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
          setToken(JSON.stringify(data));
          return httpService(config);
        } catch (error: any) {
          removeToken();
          return (window.location.href = "/auth");
        }
      }
    }
    return Promise.reject(error);
  }
);
