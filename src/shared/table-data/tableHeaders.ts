import { ITableHeaderItem } from "../types";

const institutionsHeaderData: ITableHeaderItem[] = [
  {
    header: "Name",
    key: "name",
    isSortable: false,
  },
  {
    header: "Creation date",
    key: "createdAt",
    isSortable: true,
  },
  {
    header: "Admin email",
    key: "adminEmail",
    isSortable: false,
  },
  {
    header: "# of students",
    key: "userCount",
    isSortable: false,
  },
  {
    header: "# of credentials issued",
    key: "credentialCount",
    isSortable: false,
  },
  {
    header: "# of verifications",
    key: "verificationCount",
    isSortable: false,
  },
];

const templateHeaderData: ITableHeaderItem[] = [
  {
    header: "Name",
    key: "name",
    isSortable: false,
  },
  {
    header: "Date Created",
    key: "createdAt",
    isSortable: true,
  },
  // {
  //   header: "Admin email",
  //   key: "adminEmail",
  //   isSortable: false,
  // },
  {
    header: "Description",
    key: "description",
    isSortable: false,
  },
  {
    header: "No of issuance",
    key: "credential_count",
    isSortable: true,
  },
  // {
  //   header: "# of verifications",
  //   key: "verificationCount",
  //   isSortable: false,
  // },
];

const fieldHeaderData: ITableHeaderItem[] = [
  {
    header: "Name",
    key: "name",
    isSortable: false,
  },
  {
    header: "Date Created",
    key: "createdAt",
    isSortable: true,
  },
  {
    header: "Field type",
    key: "type",
    isSortable: false,
  },
  {
    header: "Value",
    key: "value",
    isSortable: false,
  },
];

const integrationsHeaderData: ITableHeaderItem[] = [
  {
    header: "Name",
    key: "name",
    isSortable: true,
  },
  {
    header: "Created at",
    key: "createdAt",
    isSortable: false,
  },
  {
    header: "Email",
    key: "email",
    isSortable: true,
  },
];

const studentsHeaderData = [
  {
    name: "Name",
    key: "name",
    isSortable: false,
  },
  {
    name: "Date Created",
    key: "createdAt",
    isSortable: true,
  },
  {
    name: "Email",
    key: "email",
    isSortable: false,
  },
  {
    name: "Student ID",
    key: "id",
    isSortable: true,
  },
  {
    name: "Date of completion",
    key: "dateOfCompletion",
    isSortable: true,
  },
  {
    name: "Degree",
    key: "degree",
    isSortable: true,
  },
  {
    name: "Resend email",
    key: "resend_email",
    limit_width: 170,
    isSortable: false,
  },
];

export {
  institutionsHeaderData,
  integrationsHeaderData,
  studentsHeaderData,
  templateHeaderData,
  fieldHeaderData,
};
