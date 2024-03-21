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
  console.log(orderBy);
  const { data } = await httpService.get(`/admin/user-schemas`, {
    params: {
      ...(orderBy === "credential_count"
        ? { orderByCustom: orderBy }
        : { orderBy }),
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
  const { data } = await httpService.get(`/institution/schemas/byTerm`, {
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
  const { data } = await httpService.get(`/admin/user-schemas/${id}`);
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

export const deleteTemplates = async (data: any[]) => {
  const resp = await httpService.delete("/admin/user-schemas", {
    data: { ids: data.map((i: any) => i.id) },
  });
  return resp;
};
