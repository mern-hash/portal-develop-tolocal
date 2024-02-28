import { invalidInput } from "../errorText";
import { IFormImageFile, IFormSelectInput, IFormTextInput } from "../types";
import {
  validateEmailPattern,
  validateHexPattern,
  validateUrlPattern,
} from "../validations";
import { isValidPhoneNumber } from "react-phone-number-input";
import { errorMessages } from "../errorText";

type FormFieldsData = IFormImageFile | IFormTextInput | IFormSelectInput;

export const institutionFormFields = (
  register,
  errors,
  watchers
): FormFieldsData[] => {
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
      description: errorMessages.img_size,
      placeholder: "Drag and drop files here or click to upload",
      previewFile: watchers.logo,
    },
  ];
};

export const templateFormFields = (
  register,
  errors,
  watchers
): FormFieldsData[] => {
  return [
    {
      type: "text",
      id: "name",
      label: "Template Name",
      placeholder: "University Degree, State Identity...",
      validations: {
        required: "Required field",
        minLength: {
          value: 3,
          message: errorMessages.min_length(3),
        },
        maxLength: {
          value: 500,
          message: errorMessages.max_length(500),
        },
      },
      errors: invalidInput(errors, "name"),
    },
    {
      type: "text",
      id: "description",
      label: "Template Description",
      placeholder: "Describe what this template is all about...",
      validations: {
        maxLength: {
          value: 2000,
          message: errorMessages.max_length(2000),
        },
      },
      errors: invalidInput(errors, "description"),
    },
    {
      type: "select",
      id: "attributeType",
      label: "Attribute Type",
      placeholder: "Select Attribute Type",
      validations: {
        required: "Required field",
      },
      errors: invalidInput(errors, "attributeType"),
      items: [],
      register,
      watch: watchers,
    },
  ];
};

export const customFormFields = (
  register,
  errors,
  watchers,
  index
): FormFieldsData[] => {
  return [
    {
      type: "text",
      id: `customField.${index}.name`,
      label: "Atribute Name",
      placeholder: "University Degree, State Identity...",
      validations: {
        required: "Required field",
        minLength: {
          value: 3,
          message: errorMessages.min_length(3),
        },
        maxLength: {
          value: 500,
          message: errorMessages.max_length(500),
        },
      },
      errors: invalidInput(errors, "name"),
    },

    {
      type: "text",
      id: `customField.${index}.description`,
      label: "Atribute Description",
      placeholder: "Describe what this attribute is all about...",
      validations: {
        maxLength: {
          value: 2000,
          message: errorMessages.max_length(2000),
        },
      },
      errors: invalidInput(errors, "description"),
    },
    {
      type: "select",
      id: `customField.${index}.attributeType`,
      label: "Attribute Type",
      placeholder: "Select Attribute Type",
      validations: {
        required: "Required field",
        minLength: {
          value: 2,
          message: "Required field",
        },
      },
      errors: invalidInput(errors, "attributeType"),
      items: [],
      register,
      watch: watchers,
    },
    {
      type: "checkbox",
      id: `customField.${index}.require`,
      label: "Required",
      placeholder: "Require",
      errors: invalidInput(errors, "Require"),
    },
    {
      type: "text",
      id: `customField.${index}.id`,
      label: "Field unique Name(Without Spase)",
      placeholder: "Field unique Name(Without Spase)",
      validations: {
        required: "Required field",
        minLength: {
          value: 2,
          message: errorMessages.min_length(2),
        },
        maxLength: {
          value: 15,
          message: errorMessages.max_length(15),
        },
        pattern: {
          value: /^[^\d\s!@#$%^&*(),.?":{}|<>]*$/,
          message:
            "Input must not contain spaces, numbers, or special characters.",
        },
      },
      errors: invalidInput(errors, "id"),
    },
    {
      type: "text",
      id: `customField.${index}.selectOption`,
      label: "Field options with coma separated values",
      placeholder: "Field options with coma separated values",
      validations: {
        required: "Required field",
        minLength: {
          value: 2,
          message: "Required field",
        },
      },
      errors: invalidInput(errors, "selectOption"),
    },
  ];
};
