import { IInstitutionTableData } from "@/shared/types";
import { httpService } from "@/api/http";

export const getInstitutions = async ({ queryKey }) => {
  const [, { page, pageSize, orderBy, order, term, from, to }] = queryKey;
  const { data } = await httpService.get("/admin/institutions", {
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

export const getSingleInstitution = async ({ queryKey }) => {
  const [, { id }] = queryKey;
  const { data } = await httpService.get(`/admin/institutions/${id}`);
  return data;
};

export const createInstitution = async (institutionData: FormData) => {
  const { data } = await httpService.post(
    `/admin/institutions`,
    institutionData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

export const editInstitution = async (
  id: string | undefined,
  institutionData
) => {
  const { data } = await httpService.patch(
    `/admin/institutions/${id}`,
    institutionData
  );
  return data;
};

export const deleteInstitutions = async (data: IInstitutionTableData[]) => {
  const resp = await httpService.delete("/admin/institutions", {
    data: { ids: data.map((i: IInstitutionTableData) => i.id) },
  });
  return resp;
};
