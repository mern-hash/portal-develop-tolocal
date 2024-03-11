import { httpService } from "../../api/http";

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
