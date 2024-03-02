import {
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import IButton from "./IButton";

export interface IFormTextInput {
  errors: { invalid: boolean; invalidText: string };
  id: string;
  label: string;
  placeholder: string;
  type: string;
  readonly?: boolean;
  validations?: { [key: string]: any };
  isClaim?: boolean;
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

export interface IListCredentials {
  type: string;
  id: string;
  data: { name: string; details: string }[];
}

export type IFormFieldsData =
  | IFormImageFile
  | IFormTextInput
  | IFormSelectInput;

export interface IFile {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
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
}

export interface TemplateForm {
  description: string | null;
  name: string;
  customField: {
    attributeType: string;
    name: string;
    description: string;
    require: boolean;
    selectOption?: string;
    isClaim: boolean;
    isSearchable: boolean;
    isSortable: boolean;
    isFilterable: boolean;
    inTable: boolean;
  }[];
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
