//SECTION - Imports
//ANCHOR - Core
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { isValid as validateDate, format } from "date-fns";
//ANCHOR - Api
import { useMutation, useQuery, QueryClient } from "@tanstack/react-query";
import {
  createStudent,
  editStudent,
  getSingleStudent,
  getStudentsSchema,
} from "@/api";
//ANCHOR - Components
import { Form } from "@/components/features";
import { ToastNotification } from "@/components/ui";
import { Loading } from "carbon-components-react";
//ANCHOR - Util
import { formatSchema } from "@/shared/form-fields/formSchemaFormat";
import {
  addTemplate,
  studentFormFields,
  studentFormImage,
} from "@/shared/form-fields/studentFormFields";
import { studentFormHLC } from "@/shared/outlet-context/outletContext";
import { confirmModal } from "@/shared/table-data/tableMethods";
import { formatDateWithoutTimezone } from "@/shared/util";
//ANCHOR - Types
import { IButton, IFormTextInput, IStudentForm } from "@/shared/types";
import { ContextData, ContextTypes } from "@/shared/types/ContextTypes";
import { forCreatingEntry } from "@/shared/query-setup/forCreatingEntry";
import { forEditingEntry } from "@/shared/query-setup/forEditingEntry";
import { errorMessages } from "@/shared/errorText";
import {
  ADD_STUDENT_BUTTON_TEXT,
  SAVE_CHANGES,
  UPDATE_USER_MSG,
} from "@/core/constants";
import { Form as CForm, Stack, FormItem } from "carbon-components-react";
import FormTextField from "@/components/features/form/form-fields/FormTextField";
import FormLabel from "@/components/ui/FormLabel/FormLabel";
import { Search } from "@carbon/react";
import FormForCredentials from "@/components/features/form/FormForCredentials";
import { ICredentialForm } from "@/shared/types/IForm";

//!SECTION

const CredentialForm: FunctionComponent = () => {
  const { updateContext } = useOutletContext<{
    updateContext: (state: string, data: ContextData) => void;
  }>();

  const [defaultEditData, setDefaultEditData] = useState<IStudentForm>();
  const [reqCredentialData, setReqCredentialData] = useState<any[]>();
  const [toastErrorMessage, setToastErrorMessage] = useState<string>();

  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = new QueryClient();

  //ANCHOR - renderErrorNotification()
  const renderErrorNotification = () => {
    if (toastErrorMessage) {
      return (
        <ToastNotification
          title="Error"
          type="inline"
          kind="error"
          subtitle={toastErrorMessage}
          full
        />
      );
    }

    if (!(isSubmitted && !!Object.keys(errors).length) || isValid) return null;

    return (
      <ToastNotification
        title="Error"
        type="inline"
        kind="error"
        subtitle={errorMessages.required_notification}
        full
      />
    );
  };

  //ANCHOR - RHF Setup
  const {
    register,
    handleSubmit,
    formState: { isValid, errors, isSubmitted, isDirty },
    setValue,
    setError,
    clearErrors,
    watch,
    trigger,
    getValues,
  } = useForm<ICredentialForm>({
    mode: "onTouched",
    defaultValues: {},
  });

  //ANCHOR - setFormDefaultValues

  //ANCHOR - Submit
  const onSubmit = (data) => {
    console.log(data);
  };

  //SECTION - API
  //ANCHOR - getSingleStudent
  const singleStudent = useQuery(["singleStudent", { id }], getSingleStudent, {
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  //ANCHOR - useEffect setup
  useEffect(() => {
    window.scrollTo(0, 0);

    // if (id && singleStudent.data) {
    //   setFormDefaultValues(singleStudent.data);
    //   return;
    // }
    // If there is an ID in url, while waiting the data to fill in the form
    // in header display "Edit" title instead of "Add a Student"
    // Once data is fetched it will call setFormDefaultValues which updates header
    if (id) {
      updateContext(ContextTypes.HLC, studentFormHLC("Edit"));
      return;
    }

    updateContext(ContextTypes.HLC, studentFormHLC(ADD_STUDENT_BUTTON_TEXT));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleStudent.data]);

  const cancelForm = (evt, id) => {
    evt.relatedTarget?.getAttribute("aria-label") === "cancel"
      ? evt.relatedTarget.click()
      : trigger(id);
  };

  //ANCHOR - formButtons
  const formButtons: IButton[] = [
    {
      label: "Cancel",
      type: "button",
      kind: "secondary",
      clickFn: () => navigate("/institution/students"),
      aria_label: "cancel",
    },
    {
      label: id ? SAVE_CHANGES : ADD_STUDENT_BUTTON_TEXT,
      type: "submit",
      kind: "primary",
      icon: id ? undefined : "add",
      aria_label: "submit",
      // clickFn: (e) => {
      //   if (!isDirty) return;
      //   if (id) {
      //     validateThatDataIsUpdated(e);
      //   }
      // },
    },
  ];

  return (
    <>
      <Helmet>
        <title>{id ? "Edit Credential" : "Add Credential"}</title>
      </Helmet>
      {/* {loading && <Loading />} */}
      {/* {!studentsSchema.isLoading && (
        <Form
          errorNotification={renderErrorNotification()}
          formButtons={formButtons}
          formFields={configFormFields(errors, {
            photo: watch("photo"),
          })}
          onSubmit={handleSubmit(onSubmit, onError)}
          register={register}
          setValue={setValue}
          trigger={trigger}
          setError={setError}
          clearErrors={clearErrors}
        />
      )} */}
      <FormForCredentials
        formButtons={formButtons}
        onSubmit={onSubmit}
        register={register}
        trigger={trigger}
        formFields={[]}
      />
      <CForm onSubmit={() => {}} className="form">
        <Stack gap={1} className="form__stack">
          <div className="form__row">
            <FormLabel
              label="Link to a student"
              description="Search and select the student you want this credential to be linked to"
            />

            <FormTextField
              register={register}
              data={
                {
                  type: "text",
                  id: "firstName",
                  label: "First name",
                  placeholder: "Type in first name",
                  validations: {
                    required: errorMessages.required,
                    maxLength: {
                      value: 1000,
                      message: "",
                    },
                    minLength: {
                      value: 2,
                      message: "",
                    },
                  },
                  errors: "",
                  isClaim: true,
                } as unknown as IFormTextInput
              }
              cancelForm={cancelForm}
            />
            <Search labelText="" />
          </div>
        </Stack>
      </CForm>
    </>
  );
};

export default CredentialForm;
