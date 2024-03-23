import { FieldFormForRequest, CustomItem } from "@/shared/types/IForm";
import { httpService } from "../http";

export const createFields = async (fieldsData: FieldFormForRequest) => {
  const { data } = await httpService.post(`/custom-field`, fieldsData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const fetchFields = async ({ queryKey }) => {
  const [, { page, pageSize, orderBy, order, term, from, to }] = queryKey;
  const { data } = await httpService.get(`/custom-field`, {
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

export const deleteFields = async (data: CustomItem[]) => {
  const resp = await httpService.delete("/custom-field", {
    data: { ids: data.map((i: CustomItem) => i.id) },
  });
  return resp;
};

export const getSingleField = async ({ queryKey }) => {
  const [, { id }] = queryKey;
  const { data } = await httpService.get(`/custom-field/${id}`);
  return data;
};

export const editField = async (id: string | undefined, FieldData) => {
  const { data } = await httpService.patch(`/custom-field/${id}`, FieldData);
  return data;
};
