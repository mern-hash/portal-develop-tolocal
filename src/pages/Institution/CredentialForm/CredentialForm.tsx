//SECTION - Imports
//ANCHOR - Core
import { FunctionComponent, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

//ANCHOR - Api
import { createCredential, getSingleStudent, getStudents } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
//ANCHOR - Components
//ANCHOR - Util

import { studentFormHLC } from "@/shared/outlet-context/outletContext";

//ANCHOR - Types
import { IButton } from "@/shared/types";
import { ContextData, ContextTypes } from "@/shared/types/ContextTypes";

import {
  ADD_CREDENTIALS_DROPDOWN_TEXT,
  ADD_STUDENT_BUTTON_TEXT,
  SAVE_CHANGES,
  TOAST_NOTIFICATION_KINDS,
  TOAST_NOTIFICATION_TITLES,
} from "@/core/constants";

import { fetchTemplateForCredential } from "@/api/template/template";
import FormForCredentials from "@/components/features/form/FormForCredentials";
import ModalForCredential from "@/components/newComponets/ModalForCredential";
import { credentialFormField } from "@/shared/form-fields/credentialField";
import { forCreatingEntry } from "@/shared/query-setup/forCreatingEntry";
import { ICredentialForm } from "@/shared/types/IForm";
import { debounceEvent } from "@/shared/util";
import "./CredentialForm.scss";
import { toastNotification } from "@/shared/table-data/tableMethods";

//!SECTION

const CredentialForm: FunctionComponent = () => {
  const { updateContext } = useOutletContext<{
    updateContext: (state: string, data: ContextData) => void;
  }>();
  const [showDropdown, setShowDropdown] = useState({
    studentName: false,
    templateName: false,
  });
  const [selected, setSelected] = useState<{
    studentName: any;
    templateName: any;
  }>({
    studentName: null,
    templateName: null,
  });
  const [open, setOpen] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<
    { id: string; name: string; value: any }[] | null
  >(null);

  const { id } = useParams();
  const navigate = useNavigate();

  //ANCHOR - renderErrorNotification()

  //ANCHOR - RHF Setup
  const {
    register,
    formState: { errors },
    watch,
    trigger,
    setValue,
    setError,
  } = useForm<ICredentialForm>({
    mode: "all",
    defaultValues: {},
  });
  const queryClient = useQueryClient();

  //ANCHOR - setFormDefaultValues
  const searchTemplate = useQuery(
    ["templates", { term: watch("templateName") }],
    fetchTemplateForCredential,
    {
      enabled: watch("templateName")?.length > 0,
    }
  );
  const createCredentialEntry = useMutation(
    (data: any) => createCredential(data),
    {
      ...forCreatingEntry({
        updateContext,
        navigate: () => navigate("/institution/credentials"),
        entity: "Credential",
        setError,
        invalidate: () => queryClient.invalidateQueries(["allCredential"]),
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
  //ANCHOR - Submit
  const onSubmit = () => {
    if (!selected.studentName?.id) {
      setError("studentName", {
        type: "custom",
        message: "Please select valid student from list!",
      });
      return;
    }
    if (!selected.templateName?.id) {
      setError("templateName", {
        type: "custom",
        message: "Please select valid template from list!",
      });
      return;
    }
    if (!formValue) {
      toastNotification({
        updateContext,
        title: TOAST_NOTIFICATION_TITLES.ERROR,
        kind: TOAST_NOTIFICATION_KINDS.ERROR,
        subtitle: `Please enter value before creating credentials.`,
      });
      return;
    }

    const data = {
      name: watch("name"),
      studentId: selected.studentName?.id,
      templateId: selected.templateName?.id,
      formValue,
    };
    const createTemplate = createCredentialEntry.mutate(data);

    return createTemplate;
  };

  //SECTION - API
  //ANCHOR - getSingleStudent
  const singleStudent = useQuery(["Student", { id }], getSingleStudent, {
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const onSearchChange = debounceEvent((e, id) => {
    setValue(id, e.target.value);
  }, 500);

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

    updateContext(
      ContextTypes.HLC,
      studentFormHLC(ADD_CREDENTIALS_DROPDOWN_TEXT)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleStudent.data]);

  //ANCHOR - formButtons
  const formButtons: IButton[] = [
    {
      label: "Cancel",
      type: "button",
      kind: "secondary",
      clickFn: () => navigate("/institution/credentials"),
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
  const handleBlur = (key) => {
    // Hides the dropdown when the user stops interacting with the input
    setTimeout(() => {
      setShowDropdown((prev) => ({ ...prev, [key]: false }));
    }, 500);
  };

  const searchStudents = useQuery(
    ["allStudents", { term: watch("studentName") }],
    getStudents,
    {
      enabled: watch("studentName")?.length > 0,
    }
  );

  const handleSet = (id, item) => {
    setSelected({ ...selected, [id]: item });
    if (id === "templateName") {
      setOpen(true);
    }
    setValue(id, item?.name);
  };

  const onFocus = (id: string) => {
    !showDropdown[id] && setShowDropdown((prev) => ({ ...prev, [id]: true }));
  };

  // useEffect(() => {
  //   if (watch("studentName") && watch("studentName").length > 0) {
  //     setShowDropdown((prev) => ({ ...prev, studentName: true }));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [watch("studentName")]);

  // useEffect(() => {
  //   if (watch("templateName") && watch("templateName").length > 0) {
  //     setShowDropdown((prev) => ({ ...prev, templateName: true }));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [watch("templateName")]);

  return (
    <>
      <Helmet>
        <title>{id ? "Edit Credential" : "Add Credential"}</title>
      </Helmet>
      {/* {loading && <Loading />} */}
      <FormForCredentials
        trigger={trigger}
        formFields={credentialFormField(
          errors,
          {
            onBlur: handleBlur,
            list: {
              studentData: searchStudents?.data?.data,
              templateList: searchTemplate?.data?.data,
            },
            showDropdown,
            onFocus,
          },
          handleSet,
          onSearchChange
        )}
        onSubmit={onSubmit}
        register={register}
        formButtons={formButtons}
      />
      {open && (
        <ModalForCredential
          open={open}
          setOpen={setOpen}
          setFormValue={setFormValue}
          templateId={selected.templateName?.id}
          templateName={selected.templateName?.name}
        />
      )}
    </>
  );
};

export default CredentialForm;
