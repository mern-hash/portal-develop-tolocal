import { httpService } from "@/api/http";

export const getInstitutionStatistics = async ({ queryKey }) => {
  const [, { from, to }] = queryKey;

  const { data } = await httpService.get(`/statistics`, {
    params: { from, to },
  });

  return data;
};

export const getAccountData = async () => {
  const { data } = await httpService.get(`/institutions/me`);

  return data;
};

export const editAccountData = async (accountData) => {
  const { data } = await httpService.patch(`/institutions/me`, accountData);
  return data;
};

export const editPassword = async (passwordData) => {
  const { data } = await httpService.put(`/me/password`, passwordData);
  return data;
};
