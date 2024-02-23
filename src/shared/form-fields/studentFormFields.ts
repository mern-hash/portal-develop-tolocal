import { errorMessages, invalidInput } from "@/shared/errorText";
import { IFormImageFile, IFormTextInput } from "@/shared/types";
import { validateEmailPattern } from "@/shared/validations";

type FormFieldsData = IFormImageFile | IFormTextInput;

export const studentFormFields = (errors): FormFieldsData[] => {
  return [
    {
      type: "text",
      id: "firstName",
      label: "First name",
      placeholder: "Type in first name",
      validations: {
        required: errorMessages.required,
        maxLength: {
          value: 1000,
          message: errorMessages.max_length(1000),
        },
        minLength: {
          value: 2,
          message: errorMessages.min_length(2),
        },
      },
      errors: invalidInput(errors, "firstName"),
      isClaim: true,
    },
    {
      type: "text",
      id: "lastName",
      label: "Last name",
      placeholder: "Type in last name",
      validations: {
        required: errorMessages.required,
        maxLength: {
          value: 1000,
          message: invalidInput(errors, "lastName"),
        },
      },
      errors: invalidInput(errors, "lastName"),
      isClaim: true,
    },
    {
      type: "text",
      id: "email",
      label: "Email",
      placeholder: "Email",
      validations: {
        required: errorMessages.required,
        pattern: {
          value: validateEmailPattern,
          message: errorMessages.email,
        },
      },
      errors: invalidInput(errors, "email"),
      isClaim: true,
    },
  ];
};

export const studentFormImage = (watchers) => ({
  type: "file-image",
  id: "photo",
  label: "Photo",
  description: errorMessages.img_size,
  placeholder: "Drag and drop files here or click to upload",
  previewFile: watchers.photo,
});
