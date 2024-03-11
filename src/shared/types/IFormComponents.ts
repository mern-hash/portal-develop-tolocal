export interface ISelectInput {
  errors: { message: string; ref: JSX.Element; type: string } | undefined;
  id: string;
  items: { value: string; text: string }[];
  label: string;
  placeholder?: string;
  register: any;
  validations: { [key: string]: any };
}
