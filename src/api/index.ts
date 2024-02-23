// Auth
import { authRecover, authReset, login, logout } from "./auth/auth";

// Admin institutions
import {
  createInstitution,
  deleteInstitutions,
  editInstitution,
  getInstitutions,
  getSingleInstitution,
} from "./institutions/institutions";

// Credentials
import {
  getCredential,
  getQrCode,
  resendCredentialEmail,
} from "./credentials/credential";

// Institution
import {
  getAccountData,
  getInstitutionStatistics,
  editAccountData,
  editPassword,
} from "./institution/institution";

// Integrations
import {
  getIntegrations,
  createIntegration,
  deleteIntegration,
} from "./integrations/integrations";

// Location
import { getCities, getCountries } from "./util/countries";

// Students
import {
  createStudent,
  deleteStudent,
  editStudent,
  getBulkTemplate,
  getInstitutionTableFields,
  getSingleStudent,
  getStudents,
  getStudentsSchema,
  postBulkTemplate,
} from "./students/students";

export {
  // Auth
  authRecover,
  authReset,
  login,
  logout,
  // Admin institutions
  createInstitution,
  deleteInstitutions,
  editInstitution,
  getInstitutions,
  getSingleInstitution,
  // Credentials
  getCredential,
  getQrCode,
  resendCredentialEmail,
  // Institution
  getAccountData,
  getInstitutionStatistics,
  editAccountData,
  editPassword,
  // Integrations
  getIntegrations,
  createIntegration,
  deleteIntegration,
  // Location
  getCities,
  getCountries,
  // Students
  createStudent,
  deleteStudent,
  editStudent,
  getBulkTemplate,
  getInstitutionTableFields,
  getSingleStudent,
  getStudents,
  getStudentsSchema,
  postBulkTemplate,
};
