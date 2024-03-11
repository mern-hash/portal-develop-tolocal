import { invalidInput, errorMessages } from "@/shared/errorText";
import {
  validateEmailPattern,
  validateHexPattern,
  validatePasswordPattern,
  validateUrlPattern,
} from "../validations";
import { isValidPhoneNumber } from "react-phone-number-input";

export const myAccountFormFields = (register, errors, watchers) => {
  return [
    {
      type: "text",
      id: "name",
      label: "Institution name",
      placeholder: "Type in institution name",
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
      id: "website",
      label: "Institution website",
      placeholder: "Type in website URL",
      validations: {
        pattern: {
          value: validateUrlPattern,
          message: errorMessages.url,
        },
      },
      errors: invalidInput(errors, "website"),
    },
    {
      type: "text",
      id: "color",
      label: "Institution color",
      placeholder: "HEX format",
      validations: {
        pattern: {
          value: validateHexPattern,
          message: errorMessages.hex,
        },
      },
      errors: invalidInput(errors, "color"),
    },
    {
      type: "text",
      id: "adminEmail",
      label: "Administrator email",
      placeholder: "Email",
      validations: {
        required: "Required field",
        pattern: {
          value: validateEmailPattern,
          message: errorMessages.email,
        },
      },
      errors: invalidInput(errors, "adminEmail"),
    },
    {
      type: "select",
      id: "country",
      label: "Country",
      placeholder: "Select country",
      validations: {
        required: "Required field",
      },
      errors: invalidInput(errors, "country"),
      items: [],
      register,
      watch: watchers,
    },
    {
      type: "text",
      id: "postalCode",
      label: "Postal code",
      placeholder: "Postal code",
      validations: {
        required: "Required field",
        minLength: {
          value: 3,
          message: errorMessages.min_length(3),
        },
      },
      errors: invalidInput(errors, "postalCode"),
    },
    {
      type: "select",
      id: "city",
      label: "City",
      placeholder: "Select city",
      validations: {
        required: "Required field",
      },
      errors: invalidInput(errors, "city"),
      items: [],
      register,
      watch: watchers,
    },
    {
      type: "text",
      id: "address1",
      label: "Address",
      placeholder: "Type in address",
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
      errors: invalidInput(errors, "address1"),
    },
    {
      type: "text",
      id: "address2",
      label: "Address 2",
      placeholder: "Type in address",
      validations: {
        minLength: {
          value: 3,
          message: errorMessages.min_length(3),
        },
        maxLength: {
          value: 1000,
          message: errorMessages.max_length(1000),
        },
      },
      errors: invalidInput(errors, "address2"),
    },
    {
      type: "text",
      id: "phone",
      label: "Phone number",
      placeholder: "Type in phone no",
      validations: {
        required: "Required field",
        validate: (i) => {
          if (isValidPhoneNumber(i)) return true;
          return errorMessages.phone;
        },
      },
      errors: invalidInput(errors, "phone"),
    },
    {
      type: "file-image",
      id: "logo",
      label: "Institution logo",
      description:
        "Max file size is 500kB. Supported file types are .jpg and .png.",
      placeholder: "Drag and drop files here or click to upload",
      previewFile: watchers.logo,
    },
  ];
};

export const myPasswordFormFields = (errors, watchers) => {
  return [
    {
      type: "password",
      id: "currentPassword",
      label: "Current password",
      placeholder: "Current password",
      validations: {
        required: "Required field",
      },
      errors: invalidInput(errors, "currentPassword"),
    },
    {
      type: "password",
      id: "newPassword",
      label: "New password",
      placeholder: "New password",
      validations: {
        required: "Required field",
        pattern: {
          value: validatePasswordPattern,
          message: errorMessages.password,
        },
      },
      errors: invalidInput(errors, "newPassword"),
    },
    {
      type: "password",
      id: "confirmPassword",
      label: "Confirm password",
      placeholder: "Confirm password",
      validations: {
        required: "Required field",
        pattern: {
          value: validatePasswordPattern,
          message: errorMessages.password,
        },
        validate: (val: string) => {
          if (watchers.newPassword !== val) {
            return errorMessages.password_match;
          }
        },
      },
      errors: invalidInput(errors, "confirmPassword"),
    },
  ];
};
