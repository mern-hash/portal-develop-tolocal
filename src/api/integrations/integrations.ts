import { httpService } from "../http";

export const getIntegrations = async ({ queryKey }) => {
  const [, { orderBy, order, page, pageSize, term }] = queryKey;
  const { data } = await httpService.get("/admin/integrations", {
    params: {
      orderBy,
      order,
      page,
      pageSize,
      term,
    },
  });
  return data;
};

export const createIntegration = async (integrationData: {
  name: string;
  email: string;
}) => {
  const { data } = await httpService.post("/admin/integrations", {
    ...integrationData,
  });
  return data;
};

export const deleteIntegration = async (id: string) => {
  const { data } = await httpService.delete(`/admin/integrations/${id}`);
  return data;
};
