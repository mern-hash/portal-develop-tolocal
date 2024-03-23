import { httpService } from "../../api/http";
import {IInstitutionTableData} from "@/shared/types";

//TODO - getCredential implement
export const getCredential = async ({ queryKey }) => {
  const [, { token }] = queryKey;

  const { data } = await httpService.get("/credential", {
    headers: {
      "X-Public-Token": token,
      "Content-Type": "application/json",
    },
  });

  return data;
};

export const getQrCode = async ({ token, isNew = false }) => {
  const { data } = await httpService.put(
    "/credential-collect-request",
    {
      isNew,
    },
    {
      headers: {
        "X-Public-Token": token,
        "Content-Type": "application/json",
      },
    }
  );

  return data;
};

export const resendCredentialEmail = async (id) => {
  const { data } = await httpService.put(`/users/${id}/credential`);

  return data;
};

export const createCredential = async (credentialData) => {
  const { data } = await httpService.post(`/credentials`, credentialData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const getCredentials = async ({ queryKey }) => {
  const { data } = await httpService.get("/credentials", {
    params: queryKey[1],
  });
  return data;
};


export const deleteCredentials = async (data: IInstitutionTableData[]) => {
  const resp = await httpService.delete("/credentials", {
    data: { ids: data.map((i: IInstitutionTableData) => i.id) },
  });
  return resp;
};
