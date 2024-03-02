import { errorMessages, invalidInput } from "../errorText";

export const credentialFormField = (errors, searchFields): any[] => {
  return [
    {
      type: "text",
      id: "name",
      label: "Credential name",
      placeholder: "How would you like to name this credential",
      validations: {
        required: errorMessages.required,
        maxLength: {
          value: 1000,
          message: "",
        },
        minLength: {
          value: 2,
          message: "",
        },
      },
      errors: invalidInput(errors, "name"),
      isClaim: true,
    },
    {
      type: "search",
      id: `studentName`,
      label: "Link to a student",
      placeholder: "Search for student name or email",
      description:
        "Search and select the student you want this credential to be linked to",
      validations: {
        required: errorMessages.required,
      },
      errors: invalidInput(errors, "description"),
      onBlur: searchFields.onBlur,
      list: searchFields.list.studentList,
      showDropdown: searchFields.showDropdown.studentName,
    },
    {
      type: "search",
      id: `templateName`,
      label: "Link to a template",
      placeholder: "Search for template name",
      description:
        "Search and select the template you want this credential to be linked to",
      validations: {
        required: errorMessages.required,
      },
      errors: invalidInput(errors, "description"),
      onBlur: searchFields.onBlur,
      list: searchFields.list.templateList,
      showDropdown: searchFields.showDropdown.templateName,
    },
  ];
};
