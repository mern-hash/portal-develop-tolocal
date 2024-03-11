import { invalidInput } from "../errorText";
import { IFormTextInput } from "../types";
import { validateEmailPattern } from "../validations";
import { errorMessages } from "../errorText";

export const intergationsFormField = (errors): IFormTextInput[] => [
  {
    type: "text",
    id: "name",
    label: "Integration name",
    placeholder: "Type in integration name",
    validations: {
      required: "Required field",
      minLength: {
        value: 3,
        message: errorMessages.min_length(3),
      },
      maxLength: {
        value: 1000,
        message: errorMessages.max_length(1000),
      },
    },
    errors: invalidInput(errors, "name"),
  },
  {
    type: "text",
    id: "email",
    label: "Email",
    placeholder: "Email",
    validations: {
      required: "Required field",
      pattern: {
        value: validateEmailPattern,
        message: errorMessages.email,
      },
    },
    errors: invalidInput(errors, "email"),
  },
];
