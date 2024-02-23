import { httpService } from "@/api/http";
import qs from "qs";
import { ILogin } from "@/shared/types";

export const login = async (userInfo: ILogin, accType: string) => {
  const { data } = await httpService.post(
    `/${accType}/oauth`,
    qs.stringify(userInfo)
  );
  return data;
};

export const logout = async (accType: string) => {
  const { data } = await httpService.delete(`/${accType}/oauth`);
  return data;
};

export const authRecover = async (emailInfo: { email: string }) => {
  const { data } = await httpService.post(
    `/institution/reset-password`,
    emailInfo
  );
  return data;
};

export const authReset = async (passInfo: {
  password: string;
  token: string;
}) => {
  const { data } = await httpService.put(
    `/institution/reset-password`,
    passInfo
  );
  return data;
};
