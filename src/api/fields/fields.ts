import { FieldForm } from "@/shared/types/IForm";
import { httpService } from "../http";

export const createFields = async (fieldsData: FieldForm) => {
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
