import { httpService } from "../http";

export const createTemplate = async (templateData: FormData) => {
  console.log("templateData", templateData);
  const { data } = await httpService.post(
    `/institution/schemas`,
    templateData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

export const fetchTemplate = async ({ queryKey }) => {
  const [, { page, pageSize, orderBy, order, term, from, to }] = queryKey;
  const { data } = await httpService.get(`/admin/user-schemas`, {
    params: {
      orderBy,
      order,
      page,
      pageSize,
      term,
      from,
      to,
    },
  });
  return data;
};
