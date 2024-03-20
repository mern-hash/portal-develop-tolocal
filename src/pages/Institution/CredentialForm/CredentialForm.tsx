//SECTION - Imports
//ANCHOR - Core
import { FunctionComponent, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

//ANCHOR - Api
import { createCredential, getStudents } from "@/api";
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
} from "@/core/constants";

import {
  fetchTemplateForCredential,
  getSingleTemplateFields,
} from "@/api/template/template";
import { Form } from "@/components/features";
import { credentialFormField } from "@/shared/form-fields/credentialField";
import { formatSchema } from "@/shared/form-fields/formSchemaFormat";
import { forCreatingEntry } from "@/shared/query-setup/forCreatingEntry";
import { ICredentialForm } from "@/shared/types/IForm";
import { debounceEvent } from "@/shared/util";
import "./CredentialForm.scss";

//!SECTION

const CredentialForm: FunctionComponent = () => {
  const { updateContext } = useOutletContext<{
    updateContext: (state: string, data: ContextData) => void;
  }>();
  const { id, name } = useParams();
  const [showDropdown, setShowDropdown] = useState({
    studentName: false,
    templateName: false,
  });
  const [selected, setSelected] = useState<{
    studentName: any;
    templateName: any;
  }>({
    studentName: id ? { id, name } : null,
    templateName: null,
  });

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
    clearErrors,
    handleSubmit,
  } = useForm<ICredentialForm>({
    mode: "all",
    defaultValues: { studentName: name || "" },
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
  const searchStudents = useQuery(
    ["allStudents", { term: watch("studentName") }],
    getStudents,
    {
      enabled: !id && watch("studentName")?.length > 0,
    }
  );

  const searchTemplateFields = useQuery(
    ["templates", { id: selected.templateName?.id }],
    getSingleTemplateFields,
    {
      enabled:
        selected.templateName?.id && selected.templateName?.id?.length > 0
          ? true
          : false,
    }
  );
  //ANCHOR - Submit
  const onSubmit = (submitData) => {
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
    const submittedFields = searchTemplateFields?.data.map((item) => ({
      id: item.id,
      name: item.name,
      value: submitData?.fields[item.name],
    }));

    const data = {
      name: watch("name"),
      studentId: selected.studentName?.id,
      templateId: selected.templateName?.id,
      formValue: submittedFields,
    };
    const createTemplate = createCredentialEntry.mutate(data);

    return createTemplate;
  };

  const onChange = debounceEvent((value, id) => {
    setSelected((prev) => ({ ...prev, [id]: null }));
    setValue(id, value);
  }, 500);

  const onSearchChange = ({ target: { value } }, id) => {
    if (value && value.length < 1) {
      setShowDropdown((prev) => ({ ...prev, [id]: false }));
    }
    onChange(value, id);
  };

  //ANCHOR - useEffect setup
  useEffect(() => {
    window.scrollTo(0, 0);

    updateContext(
      ContextTypes.HLC,
      studentFormHLC(ADD_CREDENTIALS_DROPDOWN_TEXT)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      label: ADD_STUDENT_BUTTON_TEXT,
      type: "submit",
      kind: "primary",
      icon: "add",
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

  const handleSet = (item, id) => {
    setSelected({ ...selected, [id]: item });

    setValue(id, item?.name);
    setShowDropdown((prev) => ({ ...prev, [id]: false }));
  };

  const onFocus = (id: string) => {
    !showDropdown[id] && setShowDropdown((prev) => ({ ...prev, [id]: true }));
  };

  const formFields = () => {
    const basicFields = credentialFormField(
      errors,
      {
        onBlur: handleBlur,
        list: {
          studentData: searchStudents?.data?.data,
          templateList: searchTemplate?.data?.data,
        },
        showDropdown,
        onFocus,
        disabled: !!id,
      },
      handleSet,
      onSearchChange
    );
    const templateFields = formatSchema(
      searchTemplateFields?.data
        ? JSON.parse(JSON.stringify([{ fields: searchTemplateFields?.data }]))
        : { fields: [] },
      errors
    );
    return [...basicFields, ...templateFields];
  };

  return (
    <>
      <Helmet>
        <title>{"Add Credential"}</title>
      </Helmet>
      {/* {loading && <Loading />} */}

      <Form
        errorNotification={null}
        formButtons={formButtons as IButton[]}
        formFields={formFields()}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        setValue={setValue}
        trigger={trigger}
        setError={setError}
        clearErrors={clearErrors}
      />
    </>
  );
};

export default CredentialForm;
