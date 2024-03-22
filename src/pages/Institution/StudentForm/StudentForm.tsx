//SECTION - Imports
//ANCHOR - Core
import { format, isValid as validateDate } from "date-fns";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
//ANCHOR - Api
import { createStudent, editStudent, getSingleStudent } from "@/api";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
//ANCHOR - Components
import { Form } from "@/components/features";
import { ToastNotification } from "@/components/ui";
import { Loading } from "carbon-components-react";
//ANCHOR - Util
import {
  addTemplate,
  credentialsList,
  studentFormFields,
  studentFormImage,
} from "@/shared/form-fields/studentFormFields";
import { studentFormHLC } from "@/shared/outlet-context/outletContext";
import { confirmModal } from "@/shared/table-data/tableMethods";
import { formatDateWithoutTimezone } from "@/shared/util";
//ANCHOR - Types
import {
  ADD_STUDENT_BUTTON_TEXT,
  SAVE_CHANGES,
  UPDATE_USER_MSG,
} from "@/core/constants";
import { errorMessages } from "@/shared/errorText";
import { forCreatingEntry } from "@/shared/query-setup/forCreatingEntry";
import { forEditingEntry } from "@/shared/query-setup/forEditingEntry";
import { IButton, IStudentForm } from "@/shared/types";
import { ContextData, ContextTypes } from "@/shared/types/ContextTypes";
//!SECTION

const StudentForm: FunctionComponent = () => {
  const { updateContext } = useOutletContext<{
    updateContext: (state: string, data: ContextData) => void;
  }>();

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
  } = useForm<IStudentForm>({
    mode: "onTouched",
    defaultValues: {},
  });

  //ANCHOR - setFormDefaultValues
  const setFormDefaultValues = (data: any) => {
    // setDefaultEditData(data);
    // Maps over data entries and set each of them as form's defaultValue
    Object.entries(data).forEach(([name, value]: any) => {
      if (name === "fields") {
        for (let key in value) {
          if (validateDate(value[key])) {
            setValue("fields", {
              ...value,
              [key]: format(
                formatDateWithoutTimezone(new Date(value[key])),
                "yyyy-MM-dd"
              ),
            });
          }
        }
      } else {
        setValue(name, value);
      }
    });
    updateContext(ContextTypes.HLC, studentFormHLC(`Edit ${data.name}`));
  };

  //ANCHOR - Submit
  const onSubmit = (data) => {
    if (loading || !isValid) return;

    const formData = new FormData();

    for (let key in data) {
      if (key === "fields") {
        for (let a in data.fields) {
          if (validateDate(data.fields[a])) {
            formData.append(
              `fields[${a}]`,
              format(data.fields[a], "yyyy-MM-dd")
            );
          } else {
            if (data.fields[a]) formData.append(`fields[${a}]`, data.fields[a]);
            else formData.append(`fields[${a}]`, "");
          }
        }
      } else {
        if (key === "photo") {
          if (!data[key]) formData.append(key, "");
          else formData.append(key, data[key]);
        } else {
          formData.append(key, data[key]);
        }
      }
    }

    if (id) return editStudentEntry.mutate(formData);
    else return createStudentEntry.mutate(formData);
  };

  const onError = () => {
    if (!errors.fields) onSubmit(getValues());
  };

  //SECTION - API
  //ANCHOR - getSingleStudent
  const singleStudent = useQuery(["singleStudent", { id }], getSingleStudent, {
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const createStudentEntry = useMutation(
    (data: FormData) => createStudent(data),
    {
      ...forCreatingEntry({
        updateContext,
        navigate: (id) => navigate("/institution/students/edit/" + id),
        entity: "Student",
        setError,
        invalidate: () => queryClient.invalidateQueries(["allStudents"]),
      }),
      onError: ({ response }) => {
        const errRes = response?.data?.error?.fields;
        for (let key in errRes) {
          //@ts-ignore
          setError(key, { type: "custom", message: errRes[key] });
        }
      },
    }
  );

  const editStudentEntry = useMutation(
    (data: FormData) => editStudent(id, data),
    {
      ...forEditingEntry({
        updateContext,
        navigate: () => navigate("/institution/students"),
        entity: "Student",
        setError,
        invalidate: () =>
          queryClient.invalidateQueries(["singleStudent", { id }]),
        setToastErrorMessage: (val: string) => setToastErrorMessage(val),
      }),
    }
  );
  //!SECTION
  const loading = useMemo(
    () => createStudentEntry.isLoading || editStudentEntry.isLoading,
    [createStudentEntry, editStudentEntry]
  );

  //ANCHOR - useEffect setup
  useEffect(() => {
    window.scrollTo(0, 0);

    if (id && singleStudent.data) {
      setFormDefaultValues(singleStudent.data);
      return;
    }
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

  //ANCHOR - validate new data
  const validateThatDataIsUpdated = (e) => {
    // Array of credential-required ids
    let fieldIds: any[] = [];
    // Array of previously submitted values for those ids
    let defaultFieldValues: string[] = [];

    // reqCredentialData?.map((i) => {
    //   fieldIds.push(i.id);

    //   // We go by either-or, since there are fields that are like "id" and fields like "fields.studentId"
    //   const defaultValue =
    //     defaultEditData?.[i.id] ||
    //     defaultEditData?.[i.id.split(".")[0]][i.id.split(".")[1]];

    //   return defaultFieldValues.push(
    //     i.type === "timestamp"
    //       ? format(defaultValue, "yyyy-MM-dd")
    //       : defaultValue
    //   );
    // });

    // If both arrays are the same, no change has been done to required fields for credential, therefore
    // double confirmation is not required. Updating "irrelevant" fields such as photo will not trigger double
    // confirmation because the credential is not being reissued in that case.
    // If arrays differ then some of the required fields have been updated and pop-up modal appears warning the
    // user that submitting the form will reissue the credential, invalidating previously issued.
    if (
      JSON.stringify(getValues(fieldIds!)) !==
      JSON.stringify(defaultFieldValues)
    ) {
      e.preventDefault();
      return confirmModal(
        updateContext,
        `Update ${getValues().firstName} ${getValues().lastName}`,
        UPDATE_USER_MSG,
        handleSubmit(onSubmit, onError),
        SAVE_CHANGES
      );
    }
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
      clickFn: (e) => {
        if (!isDirty) return;
        if (id) {
          validateThatDataIsUpdated(e);
        }
      },
    },
  ];

  const configFormFields = (
    errors,
    watchers,
    credentialData: any[] | undefined
  ) => {
    const formFieldData: any = [
      ...studentFormFields(errors),
      studentFormImage({
        photo: watchers.photo,
      }),
    ];

    if (id) {
      formFieldData.push({
        ...addTemplate,
        navigateFunc: () => {
          navigate(
            `/institution/credentials/${id}/${singleStudent.data?.name}`
          );
        },
      });
      formFieldData.push({
        ...credentialsList,
        data: credentialData && credentialData.length > 0 ? credentialData : [],
      });
    }

    return formFieldData;
  };

  return (
    <>
      <Helmet>
        <title>{id ? "Edit student" : "Create student"}</title>
      </Helmet>
      {loading && <Loading />}
      <Form
        errorNotification={renderErrorNotification()}
        formButtons={formButtons}
        formFields={configFormFields(
          errors,
          {
            photo: watch("photo"),
          },
          singleStudent.data?.credentialData
        )}
        onSubmit={handleSubmit(onSubmit, onError)}
        register={register}
        setValue={setValue}
        trigger={trigger}
        setError={setError}
        clearErrors={clearErrors}
      />
    </>
  );
};

export default StudentForm;
