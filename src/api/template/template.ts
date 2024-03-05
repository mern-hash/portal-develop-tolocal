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
