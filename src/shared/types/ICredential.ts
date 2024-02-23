export interface ICredential {
  createdAt: number;
  email: string;
  fields: { [key: string]: any };
  firstName: string;
  lastName: string;
  id: string;
  photo: string;
  updatedAt: number;
}

export interface ICredentialField {
  name: string;
  field: string;
  type: string;
}
