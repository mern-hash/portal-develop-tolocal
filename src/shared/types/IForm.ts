import {
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import IButton from "./IButton";

export interface ValidationError {
  invalid: boolean;
  invalidText: string | undefined;
}
export interface IFormTextInput {
  errors: ValidationError;
  id: string;
  label: string;
  placeholder: string;
  type: string;
  readonly?: boolean;
  validations?: { [key: string]: any };
  isClaim?: boolean;
  classNameCustom?: string;
}

export interface IFormImageFile {
  type: string;
  id: string;
  label: string;
  description?: string;
  placeholder: string;
  emptyFileSubmitted?: boolean;
  previewFile: string;
  isClaim?: boolean;
}

export interface IFormSelectInput {
  errors: { message: string; ref: JSX.Element; type: string } | undefined;
  id: string;
  items: { value: string; text: string }[];
  label: string;
  placeholder?: string;
  register: any;
  type: string;
  validations: { [key: string]: any };
  watch: any;
}

export interface IFormSearchInput {
  errors: ValidationError | undefined;
  id: string;
  label: string;
  placeholder: string;
  description: string;
  type: string;
  validations: { [key: string]: any };
  list: any[];
  onBlur: () => void;
  showDropdown: boolean;
  onClick: (item: any, id?: string) => void;
  onSearchChange: (e: { target: HTMLInputElement }, id?: string) => void;
  onFocus: (id?: string) => void;
  disabled: boolean;
}

export interface IListCredentials {
  type: string;
  id: string;
  data: { name: string; details: string; id: string }[];
}

export type IFormFieldsData =
  | IFormImageFile
  | IFormTextInput
  | IFormSelectInput
  | IFormMultiSelect;

export interface IFile {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

export interface IFormMultiSelect {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type: string;
  value: string[];
  isOptional: boolean;
  isClaim: boolean;
  isSearchable: boolean;
  isSortable: boolean;
  isFilterable: boolean;
  inTable: boolean;
  validations: any;
  errors?: ValidationError;
}

export interface IFormComponent {
  errorNotification: JSX.Element | null;
  formButtons: IButton[];
  //TODO: update types once form schema is finished
  formFields: any;
  onSubmit: () => void;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  trigger: UseFormTrigger<any>;
  getValues?: any;
  setError?: any;
  clearErrors?: any;
}

export interface IFormCredentialsComponent {
  formButtons: IButton[];
  //TODO: update types once form schema is finished
  formFields: any;
  onSubmit: () => void;
  register: UseFormRegister<any>;
  trigger: UseFormTrigger<any>;
}

// Institutions
export interface IInstitutionForm {
  address1: string;
  address2: string | null;
  adminEmail: string;
  city: string;
  color: string | null;
  country: string;
  logo: File | null | string;
  name: string;
  phone: string;
  postalCode: string;
  website: string | null;
  template: string;
}

export interface CustomFieldValue {
  value: string;
}

export interface CustomField {
  id?: string;
  name: string;
  label: string;
  value?: CustomFieldValue[];
  placeholder: string;
  isClaim: boolean;
  isSearchable: boolean;
  isSortable: boolean;
  isFilterable: boolean;
  inTable: boolean;
  validations?: any; // Change the type based on validations structure
  attributeType: string; // Change the type based on attributeType structure
  require: boolean;
  selectOption?: string | null;
  isCustom?: boolean;
}

export interface TemplateFormEdit {
  id: string;
  name: string;
  description: string;
  createdAt: string; // Change the type based on createdAt structure
  institute: string;
  customField: CustomField[];
}

export interface TemplateForm {
  description: string | null;
  name: string;
  institute: string;
  customField?: CustomField[];
}

export interface FieldForm {
  value: string;
  name: string;
  attributeType: string;
  valueList?: { value: string }[];
}

export interface FieldFormForRequest {
  value: string | string[];
  name: string;
  type: string;
}

export interface CustomFormType {
  description: string | null;
  attributeType: string;
  id: string;
  name: string;
  require: Boolean;
}

// Students
export interface IFormSchemaField {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type: string;
  isOptional: boolean;
  isSearchable: boolean;
  validations: any;
  value?: string[];
}

export interface IStudentForm {
  firstName: string;
  lastName: string;
  email: string;
  photo: File | null | string;
  fields: any;
}

export interface ICredentialForm {
  name: string;
  templateName: string;
  studentName: string;
}

export type TFieldID = keyof IInstitutionForm | keyof IStudentForm;

export interface CustomItem {
  id: string;
  name: string;
  value?: string | null;
  type: string;
  createdAt: number;
  updatedAt: number;
}
export interface ListOfCustomItem {
  data: CustomItem[];
}
