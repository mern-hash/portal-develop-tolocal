import { httpService } from "@/api/http";

export const getStudents = async ({ queryKey }) => {
  const { data } = await httpService.get("/users", {
    params: queryKey[1],
  });
  return data;
};

export const getSingleStudent = async ({ queryKey }) => {
  const [, { id }] = queryKey;
  const { data } = await httpService.get(`/users/${id}`);
  return data;
};

export const createStudent = async (userData) => {
  const { data } = await httpService.post(`/users`, userData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const editStudent = async (id: string | undefined, studentData) => {
  const { data } = await httpService.patch(`/users/${id}`, studentData);
  return data;
};

export const deleteStudent = async (data) => {
  const resp = await httpService.delete(`/users`, {
    data: { ids: data.map((i) => i.id) },
  });
  return resp;
};

export const getStudentsSchema = async () => {
  const { data } = await httpService.get(`/institution/schemas`);
  return data;
};

export const getInstitutionTableFields = async () => {
  const { data } = await httpService.get(`/institution/schemas/table-fields`);
  return data;
};

export const getBulkTemplate = async () => {
  const { data } = await httpService.get(`/users/import/template`, {
    headers: {
      "Content-type": "text/csv",
    },
    responseType: "blob",
  });

  return data;
};

export const postBulkTemplate = async (bulkData) => {
  const { data } = await httpService.post(`/users/import`, bulkData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};
