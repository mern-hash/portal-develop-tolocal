export interface IMyPassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IMyAccount {
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
