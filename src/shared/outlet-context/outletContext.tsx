import { Button, HeaderButton, HeaderSelect } from "@/components/ui";
import {
  ADD_CREDENTIALS_DROPDOWN_TEXT,
  ADD_STUDENTS_DROPDOWN_TEXT,
  ADMIN_HEADING_LINKS,
  ADMIN_HEADING_LOGOLINK,
  INSTITUTION_HEADING_LINKS,
  INSTUTION_HEADING_LOGOLINK,
} from "@/core/constants";

//SECTION - Master admin
//ANCHOR - institutionListHLC
export const institutionsListHLC = (navigate) => {
  return {
    logoLink: ADMIN_HEADING_LOGOLINK,
    links: ADMIN_HEADING_LINKS,
    title: "Institutions",
    button: (
      <Button
        label="Create institution"
        icon="add"
        type="button"
        clickFn={() => navigate("create")}
        kind="primary"
      />
    ),
  };
};

export const templatesListHLC = (navigate) => {
  return {
    logoLink: ADMIN_HEADING_LOGOLINK,
    links: ADMIN_HEADING_LINKS,
    title: "Templates",
    button: (
      <Button
        label="Build a template"
        icon="add"
        type="button"
        clickFn={() => navigate("create")}
        kind="primary"
      />
    ),
  };
};

export const fieldsListHLC = (navigate) => {
  return {
    logoLink: ADMIN_HEADING_LOGOLINK,
    links: ADMIN_HEADING_LINKS,
    title: "Fields",
    button: (
      <Button
        label="Build a field"
        icon="add"
        type="button"
        clickFn={() => navigate("create")}
        kind="primary"
      />
    ),
  };
};

export const formListHLC = (navigate) => {
  return {
    logoLink: ADMIN_HEADING_LOGOLINK,
    links: ADMIN_HEADING_LINKS,
    title: "Fields",
    button: (
      <Button
        label="Build a Fields"
        icon="add"
        type="button"
        clickFn={() => navigate("create")}
        kind="primary"
      />
    ),
  };
};

//ANCHOR - templatesFormHLC
export const templatesFormHLC = (title: string) => {
  return {
    logoLink: ADMIN_HEADING_LOGOLINK,
    links: ADMIN_HEADING_LINKS,
    title,
  };
};

//ANCHOR - institutionsFormHLC
export const institutionsFormHLC = (title: string) => {
  return {
    logoLink: ADMIN_HEADING_LOGOLINK,
    links: ADMIN_HEADING_LINKS,
    title,
  };
};

//ANCHOR - integrations
export const integrationsListHLC = (navigate) => {
  return {
    logoLink: ADMIN_HEADING_LOGOLINK,
    links: ADMIN_HEADING_LINKS,
    title: "Integrations",
    button: (
      <Button
        label="Create integration"
        icon="add"
        type="button"
        clickFn={() => navigate("create")}
        kind="primary"
      />
    ),
  };
};

export const integrationsFormHLC = () => {
  return {
    logoLink: ADMIN_HEADING_LOGOLINK,
    links: ADMIN_HEADING_LINKS,
    title: "Create integration",
  };
};
//!SECTION

//SECTION - Institution admin
//ANCHOR - institutionDashboardHLC
export const institutionDashboardHLC = (selectFn: (val) => void) => {
  return {
    links: INSTITUTION_HEADING_LINKS,
    logoLink: INSTUTION_HEADING_LOGOLINK,
    title: "Dashboard",
    button: (
      <HeaderSelect
        id="filter-by-time"
        items={[
          { value: "", text: "All time" },
          { value: "last-week", text: "Last week" },
          { value: "last-month", text: "Last month" },
          { value: "last-year", text: "Last year" },
        ]}
        onSelect={selectFn}
        label="All time"
      />
    ),
  };
};

//ANCHOR - institutionStudentsHLC
export const institutionStudentsHLC = (navigate) => {
  return {
    links: INSTITUTION_HEADING_LINKS,
    logoLink: INSTUTION_HEADING_LOGOLINK,
    title: "Students",
    button: (
      <HeaderButton
        id="add-student"
        buttonText={ADD_STUDENTS_DROPDOWN_TEXT}
        iconType="add"
        items={[
          {
            text: "Manually",
            onClick: () => navigate("create"),
          },
          {
            text: "Bulk upload",
            onClick: () => navigate("bulk"),
          },
        ]}
      />
    ),
  };
};

//ANCHOR - institutionStudentsHLC
export const institutionCredentialsHLC = (navigate) => {
  return {
    links: INSTITUTION_HEADING_LINKS,
    logoLink: INSTUTION_HEADING_LOGOLINK,
    title: "Credentials",
    button: (
      <Button
        label={ADD_CREDENTIALS_DROPDOWN_TEXT}
        icon="add"
        type="button"
        clickFn={() => navigate("create")}
        kind="primary"
      />
    ),
  };
};

//ANCHOR - studentFormHLC
export const studentFormHLC = (title) => {
  return {
    logoLink: INSTUTION_HEADING_LOGOLINK,
    links: INSTITUTION_HEADING_LINKS,
    title,
  };
};

//ANCHOR - My Account
export const myAccountHLC = {
  links: INSTITUTION_HEADING_LINKS,
  title: "My account",
};

export const myAccountTabs = (changeFn) => {
  return {
    tabs: [
      {
        text: "My account",
        value: "account",
      },
      {
        text: "Password",
        value: "password",
      },
    ],
    changeFn,
    visible: true,
  };
};
//!SECTION

//SECTION - Certificate
//ANCHOR - claimCertificateHLC
export const claimCertificateHLC = {
  logoLink: "#",
  links: [],
  title: "Your credential",
};
export const claimCredentialHLC = {
  logoLink: "#",
  links: [],
  title: "Your credential",
  disableMyAccNav: true,
};

//SECTION - utils
//ANCHOR - clearTabs
export const clearTabs = {
  tabs: [],
  changeFn: () => {},
  visible: false,
};

//ANCHOR clearModal
export const clearModal = {
  heading: "",
  onSubmit: () => {},
  open: false,
};
//!SECTION
