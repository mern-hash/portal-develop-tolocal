export const ACCEPT_IMG_TYPES = ["image/jpeg", "image/jpg", "image/png"];
export const ACCEPT_CSV_TYPES = ["text/csv"];

export const ACCOUNT_TYPES = {
  ADMIN: "admin",
  INSTITUTION: "institution-admin",
  STUDENT: "student",
};

export const ACCOUNT_PATH_TYPES = {
  ADMIN: "admin",
  INSTITUTION: "institution",
  STUDENT: "student",
};

export const DATE_FILTER_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx";

export const TABLE_ORDER = {
  DEFAULT: "DESC",
  ASC: "ASC",
  DESC: "DESC",
};
export const TABLE_ORDER_DIRECTION = {
  none: TABLE_ORDER.DESC,
  ascending: TABLE_ORDER.ASC,
  descending: TABLE_ORDER.DESC,
};

export const TABLE_ORDER_BY = {
  CREATEDAT: "createdAt",
  ID: "id",
};

export const TOAST_NOTIFICATION_KINDS = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
};
export const TOAST_NOTIFICATION_TITLES = {
  SUCCESS: "Success!",
  ERROR: "Error!",
};
export const TOAST_NOTIFICATION_TYPES = {
  TOAST: "toast",
  INLINE: "inline",
};

export const TABLE_PAGE_SIZES = [10, 25, 50];

//! HEADING
// LOGOLINKS
export const ADMIN_HEADING_LOGOLINK = "/admin/institutions";
export const INSTUTION_HEADING_LOGOLINK = "/institution";
// LINKS
export const ADMIN_HEADING_LINKS = [
  {
    text: "Institutions",
    path: "/admin/institutions",
  },
  {
    text: "Integrations",
    path: "/admin/integrations",
  },
  {
    text: "Template",
    path: "/admin/template",
  },
];
export const INSTITUTION_HEADING_LINKS = [
  {
    text: "Dashboard",
    path: "/institution",
  },
  {
    text: "Students",
    path: "/institution/students",
  },
];

// FILES
export const logo = "logo";
// LOCATION
export const country = "country";
export const city = "city";
export const postalCode = "postalCode";

export const LOCATION_ARRAY = [country, city, postalCode];

//LABELS
export const ADD_STUDENT_BUTTON_TEXT = "Add a student";
export const ADD_STUDENTS_DROPDOWN_TEXT = "Add students";

// CREDENTIAL STATUS
export const CREDENTIAL_DATA_STATUS = {
  UNCOLLECTED: "uncollected",
  COLLECTING: "collecting",
  COLLECTED: "collected",
  EXPIRED: "expired",
};

export const CREDENTIAL_QR_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  SUCCESS: "success",
  ERROR: "error",
};

export const UPDATE_USER_MSG =
  "Once this user is updated, previously claimed credential will be revoked and an email with a link to claim new credential will be sent.";
export const SAVE_CHANGES = "Save changes";
