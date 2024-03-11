import { httpService } from "@/api/http";

export const getCountries = async () => {
  const { data } = await httpService.get("/utils/countries");
  return data;
};

export const getCities = async ({ queryKey }) => {
  const [, { country }] = queryKey;
  const { data } = await httpService.get(`/utils/cities`, {
    params: {
      country,
    },
  });
  return data;
};
