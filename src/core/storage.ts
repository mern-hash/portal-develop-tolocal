import { IToken } from "@/shared/types";

export const setToken = (token: string) => {
  localStorage.setItem("jwt", token);
};

export const getToken = (): IToken | undefined => {
  const tokenString = localStorage.getItem("jwt");
  if (!tokenString) return;
  return JSON.parse(tokenString);
};

export const removeToken = () => {
  localStorage.removeItem("jwt");
};
