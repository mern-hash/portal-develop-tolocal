import { httpService } from "../http";

export const createTemplate = async (templateData: FormData) => {
  const { data } = await httpService.post(`/admin/user-schemas`, templateData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const fetchTemplate = async ({ queryKey }) => {
  const [, { page, pageSize, orderBy, order, term, from, to }] = queryKey;
  const { data } = await httpService.get(`/data/user-schema`, {
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

export const fetchTemplateForCredential = async ({ queryKey }) => {
  const [, { page, pageSize, orderBy, order, term, from, to }] = queryKey;
  const { data } = await httpService.get(`/data/user-schema/institutions`, {
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

export const getSingleTemplate = async ({ queryKey }) => {
  const [, { id }] = queryKey;
  const { data } = await httpService.get(`/data/user-schema/${id}`);
  return data;
};

export const getSingleTemplateFields = async ({ queryKey }) => {
  const [, { id }] = queryKey;
  const { data } = await httpService.get(
    `http://localhost:3002/institution/schemas/${id}/schema-fields`
  );
  return data;
};

export const editTemplate = async (id: string | undefined, templateData) => {
  const { data } = await httpService.patch(
    `/data/user-schema/${id}`,
    templateData
  );
  return data;
};
