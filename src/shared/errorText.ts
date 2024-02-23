import { FieldErrors } from "react-hook-form";

export const invalidInput = (
  errors: FieldErrors<{
    message: string;
    ref: JSX.Element;
    type: string;
  }>,
  id: string
) => {
  if (id.includes("fields")) {
    return {
      invalid: errors && !!errors["fields"]?.[id.split(".")[1]],
      invalidText: errors && errors["fields"]?.[id.split(".")[1]]?.message,
    };
  }

  return {
    invalid: errors && !!errors[id],
    invalidText: errors && errors[id]?.message,
  };
};

export const errorMessages = {
  required: "Required field",
  email: "Invalid email pattern.",
  password:
    "Must contain at least 8 characters of which: one upper case letter, one lower case letter, a number and a special character.",
  password_match: "Your passwords don't match",
  url: "Invalid URL pattern.",
  hex: "Hex code should start with # and have 3 or 6 characters.",
  phone: "Please enter a valid phone number. (e.g. +12133734253)",
  img_type: "Please upload .png or .jpg file.",
  img_size: "Max file size is 500kB. Supported file types are .jpg and .png.",
  min_length: (num: number) => `Minimum ${num} characters.`,
  max_length: (num: number) => `Maximum ${num} characters.`,
  max_date:
    "The maximum selected date cannot be greater than today’s date. Please select a valid date.",
  csv_type: "Please upload a .csv file.",
  required_notification: "Please enter the required fields",
  try_again: "There was a problem. Please try again.",
};
