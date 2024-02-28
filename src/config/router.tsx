import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import Home from "@/pages/Home";
// Authorization
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import HeaderLayout from "@/components/layout/header-layout/HeaderLayout";
import InstitutionsList from "@/pages/Institutions/InstitutionsList";
import InstitutionsForm from "@/pages/Institutions/InstitutionsForm";
// Institution
import InstitutionAccount from "@/pages/Institution/InstitutionAccount";
import InstitutionDashboard from "@/pages/Institution/InstitutionDashboard";
import InstitutionStudents from "@/pages/Institution/InstitutionStudents";
import StudentBulk from "@/pages/Institution/StudentBulk";
import StudentForm from "@/pages/Institution/StudentForm";
import IntegrationsForm from "@/pages/Integrations/IntegrationsForm/IntegrationsForm";
import IntegrationsList from "@/pages/Integrations/IntegrationsList";

import Credential from "@/pages/Credential";

import * as Sentry from "@sentry/react";
import TemplateList from "@/pages/Template/TemplateList";
import TemplatesForm from "@/pages/Template/TemplateForm";
import InstitutionCredentials from "@/pages/Institution/InstitutionCredentials";
import CredentialForm from "@/pages/Institution/CredentialForm";

const sentryCreateBrowserRouter =
  Sentry.wrapCreateBrowserRouter(createBrowserRouter);

const router = sentryCreateBrowserRouter([
  {
    // example route
    path: "/",
    element: <ProtectedRoute type="authorized" element={<Home />} />,
    errorElement: <NotFound />,
  },
  {
    path: "/auth/:id?/:account_type?",
    element: <ProtectedRoute type="unauthorized" element={<Auth />} />,
    errorElement: <NotFound />,
  },
  {
    path: "/institution-admin/:id/:token",
    element: (
      <ProtectedRoute
        type="unauthorized"
        element={<Auth type="admin-setup" />}
      />
    ),
  },

  {
    path: "/collect-credential/:token",
    element: <HeaderLayout />,
    children: [{ path: "", element: <Credential /> }],
  },

  {
    path: "/admin",
    element: <ProtectedRoute type="authorized" element={<HeaderLayout />} />,
    children: [
      { path: "institutions", element: <InstitutionsList /> },
      {
        path: "institutions/create",
        element: <InstitutionsForm />,
      },
      {
        path: "institutions/edit/:id",
        element: <InstitutionsForm />,
      },
      {
        path: "institutions/edit",
        element: <Navigate to="/institutions" replace />,
      },
      { path: "integrations", element: <IntegrationsList /> },
      { path: "integrations/create", element: <IntegrationsForm /> },
      { path: "template", element: <TemplateList /> },
      {
        path: "template/create",
        element: <TemplatesForm />,
      },
    ],
  },

  {
    path: "/institution",
    element: <ProtectedRoute type="authorized" element={<HeaderLayout />} />,
    children: [
      {
        path: "",
        element: <InstitutionDashboard />,
      },
      {
        path: "account",
        element: <InstitutionAccount />,
      },
      {
        path: "students",
        element: <InstitutionStudents />,
      },
      {
        path: "students/create",
        element: <StudentForm />,
      },
      {
        path: "students/edit/:id",
        element: <StudentForm />,
      },
      {
        path: "students/bulk",
        element: <StudentBulk />,
      },
      {
        path: "credentials",
        element: <InstitutionCredentials />,
      },
      {
        path: "credentials/create",
        element: <CredentialForm />,
      },
    ],
  },
]);

const Router = () => {
  return (
    <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />
  );
};

export default Router;
