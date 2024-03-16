import { FieldErrors } from "react-hook-form";
import { IFormSchemaField } from "@/shared/types";
import { errorMessages, invalidInput } from "@/shared/errorText";

/**
 * Pass form fields received as array of objects that need
 * to be formatted to work with current form setup:
 * Validation needs to be configured
 */
export const formatSchema = (arrayOfFields, errors: FieldErrors) => {
  if (!arrayOfFields?.[0]?.fields) return [];

  return arrayOfFields?.[0].fields?.map((field: IFormSchemaField) => {
    if (Object.keys(field.validations)) {
      for (let key in field.validations) {
        field.validations[key] = {
          value: field.validations[key].value,
          message: field.validations[key].message,
        };
      }
    }

    if (!field.isOptional) {
      field.validations["required"] = errorMessages.required;
    }

    field["errors"] = invalidInput(errors, `fields.${field.name}`);
    field["id"] = `fields.${field.name}`;
    if (field.type === "dropdown") {
      field["type"] = "select";
      field["items"] = field.value
        ? field.value.map((item) => ({ value: item, text: item }))
        : [];
    }
    return field;
  });
};
