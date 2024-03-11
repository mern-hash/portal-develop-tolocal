//SECTION - Imports
//ANCHOR - Core
import { FunctionComponent, ReactElement, useEffect, useMemo } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
//ANCHOR - API
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createIntegration } from "@/api";
//ANCHOR - Components
import { ToastNotification } from "@/components/ui";
import { Loading } from "carbon-components-react";
import { Form } from "@/components/features";
//ANCHOR - Util
import { IButton } from "@/shared/types";
import { ContextData, ContextTypes } from "@/shared/types/ContextTypes";
import { integrationsFormHLC } from "@/shared/outlet-context/outletContext";
import { errorMessages } from "@/shared/errorText";
import { forCreatingEntry } from "@/shared/query-setup/forCreatingEntry";
import { intergationsFormField } from "@/shared/form-fields/integrationsFormFields";
import { toastNotification } from "@/shared/table-data/tableMethods";
import {
  TOAST_NOTIFICATION_KINDS,
  TOAST_NOTIFICATION_TITLES,
} from "@/core/constants";
//!SECTION

const IntegrationsForm: FunctionComponent = (): ReactElement => {
  const { updateContext } = useOutletContext<{
    updateContext: (state: string, data: ContextData) => void;
  }>();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    updateContext(ContextTypes.HLC, integrationsFormHLC());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { isValid, errors, isSubmitted },
    setError,
    setValue,
    trigger,
  } = useForm<{
    name: string;
    email: string;
  }>({
    mode: "onTouched",
    defaultValues: {},
  });

  //SECTION API
  const createIntegrationEntry = useMutation(
    (data: { name: string; email: string }) => createIntegration(data),
    {
      ...forCreatingEntry({
        updateContext,
        entity: "Integration",
        setError,
        invalidate: () => queryClient.invalidateQueries(["integrations"]),
      }),
      onSuccess: () => {
        navigate("/admin/integrations");
        toastNotification({
          updateContext,
          title: TOAST_NOTIFICATION_TITLES.SUCCESS,
          kind: TOAST_NOTIFICATION_KINDS.SUCCESS,
          subtitle: `Integration has successfully been created. The integration token has been sent to the email provided.`,
        });
      },
    }
  );

  const loading = useMemo(
    () => createIntegrationEntry.isLoading,
    [createIntegrationEntry]
  );
  //!SECTION

  const renderErrorNotification = () => {
    if (!(isSubmitted && !!Object.keys(errors).length)) return null;

    if (isSubmitted && createIntegrationEntry.status === "idle")
      return (
        <ToastNotification
          title="Error"
          type="inline"
          kind="error"
          subtitle={
            errors["message"]?.message || errorMessages.required_notification
          }
          full
        />
      );

    return null;
  };

  const onSubmit = (data) => {
    if (loading || !isValid) return;

    return createIntegrationEntry.mutate(data);
  };

  const formButtons: IButton[] = [
    {
      label: "Cancel",
      type: "button",
      kind: "secondary",
      clickFn: () => navigate("/admin/integrations"),
      aria_label: "cancel",
    },
    {
      label: "Create integration",
      type: "submit",
      kind: "primary",
      icon: "add",
      aria_label: "submit",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Create integration</title>
      </Helmet>
      {loading && <Loading />}
      <div className="password_override">
        <Form
          errorNotification={renderErrorNotification()}
          formButtons={formButtons}
          formFields={intergationsFormField(errors)}
          onSubmit={handleSubmit(onSubmit)}
          register={register}
          setValue={setValue}
          trigger={trigger}
        />
      </div>
    </>
  );
};

export default IntegrationsForm;
