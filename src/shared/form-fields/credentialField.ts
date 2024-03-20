import { errorMessages, invalidInput } from "../errorText";

export const credentialFormField = (
  errors,
  searchFields,
  handleSet,
  onSearchChange
): any[] => {
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
      errors: invalidInput(errors, "studentName"),
      onBlur: searchFields.onBlur,
      list: searchFields.list.studentData,
      showDropdown: searchFields.showDropdown.studentName,
      onFocus: searchFields.onFocus,
      disabled: searchFields.disabled,
      onClick: handleSet,
      onSearchChange,
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
      errors: invalidInput(errors, "templateName"),
      onBlur: searchFields.onBlur,
      list: searchFields.list.templateList,
      showDropdown: searchFields.showDropdown.templateName,
      onFocus: searchFields.onFocus,
      disabled: false,
      onClick: handleSet,
      onSearchChange,
    },
  ];
};
