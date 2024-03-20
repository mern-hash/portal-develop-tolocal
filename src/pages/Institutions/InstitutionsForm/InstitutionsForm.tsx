// Core
import {
  FunctionComponent,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
// Api
import {
  createInstitution,
  editInstitution,
  getSingleInstitution,
} from "@/api/institutions/institutions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Components
import { Form } from "@/components/features";
import { ToastNotification } from "@/components/ui";
import { Loading } from "carbon-components-react";
// Util
import { fetchTemplate } from "@/api/template/template";
import {
  ADMIN_HEADING_LINKS,
  ADMIN_HEADING_LOGOLINK,
  LOCATION_ARRAY,
  city,
  country,
  logo,
} from "@/core/constants";
import { errorMessages } from "@/shared/errorText";
import { institutionFormFields } from "@/shared/form-fields/formFields";
import { forCreatingEntry } from "@/shared/query-setup/forCreatingEntry";
import { forEditingEntry } from "@/shared/query-setup/forEditingEntry";
import { IButton, IInstitutionForm } from "@/shared/types";
import { ContextData, ContextTypes } from "@/shared/types/ContextTypes";
import { debounceEvent } from "@/shared/util";

const InstitutionsForm: FunctionComponent = (): ReactElement => {
  // Fetched data, used to compare freshly edited input fields to see which
  // one needs to get patched
  const [defaultEditData, setDefaultEditData] = useState<IInstitutionForm>();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors, isSubmitted },
    setValue,
    setError,
    watch,
    trigger,
  } = useForm<IInstitutionForm>({
    mode: "onTouched",
    defaultValues: {},
  });
  // <Outlet /> context to update HeaderLayout data
  const { updateContext } = useOutletContext<{
    updateContext: (state: string, data: ContextData) => void;
  }>();

  // Initial heading setup
  const updateHeadingContext = (title: string) => {
    updateContext(ContextTypes.HLC, {
      logoLink: ADMIN_HEADING_LOGOLINK,
      links: ADMIN_HEADING_LINKS,
      title,
    });
  };

  const renderErrorNotification = () => {
    if (!(isSubmitted && !!Object.keys(errors).length)) return null;

    if (
      isSubmitted &&
      createInstitutionEntry.status === "idle" &&
      editInstitutionEntry.status === "idle"
    )
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

  /**
   * API
   * @singleInstitution - fetch single institution
   * @createInstitutionEntry - create new institution (empty form by default)
   * @editInstitutionEntry - patch update existing institution (first fetch singleInstitution
   * or use fetched data from table)
   */
  const singleInstitution = useQuery(
    ["singleInstitution", { id }],
    getSingleInstitution,
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
    }
  );
  const searchTemplate = useQuery(
    ["templates", { term: watch("template") }],
    fetchTemplate,
    {
      enabled: watch("template")?.length > 0,
    }
  );
  const createInstitutionEntry = useMutation(
    (data: FormData) => createInstitution(data),
    {
      ...forCreatingEntry({
        navigate: () => navigate("/admin/institutions"),
        updateContext,
        entity: "Institution",
        setError,
        invalidate: () => queryClient.invalidateQueries(["allInstitutions"]),
      }),
    }
  );
  const editInstitutionEntry = useMutation(
    (data: FormData) => editInstitution(id, data),
    {
      ...forEditingEntry({
        updateContext,
        navigate: () => navigate("/admin/institutions"),
        entity: "Institution",
        setError,
        invalidate: () =>
          queryClient.invalidateQueries(["singleInstitution", { id }]),
      }),
    }
  );
  const loading = useMemo(
    () => createInstitutionEntry.isLoading || editInstitutionEntry.isLoading,
    [createInstitutionEntry, editInstitutionEntry]
  );

  const setFormDefaultValues = (data: IInstitutionForm) => {
    setDefaultEditData(data);
    // Maps over data entries and set each of them as form's defaultValue
    Object.entries(data).forEach(([name, value]: any) => setValue(name, value));
    updateHeadingContext(`Edit ${data.name}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // If there is ID in url -> fetch institution data and set values
    // as form default and set heading to "Edit __"
    if (id && singleInstitution.data) {
      setFormDefaultValues(singleInstitution.data);
      return;
    }

    updateHeadingContext("Create institution");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleInstitution.data]);

  useEffect(() => {
    trigger("logo");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("logo")]);

  const onSubmit = (data) => {
    if (loading || !isValid) return;

    const formData = new FormData();

    if (id) {
      for (let key in data) {
        // Seding empty logo as empty string removes uploaded image from base
        if (key === "logo") {
          formData.append(key, data[key]);
        }
        // TODO: fix once BE enables not upading all 3 values
        if (LOCATION_ARRAY.includes(key)) {
          // this also means that it will be deleted and readded 3 times...
          LOCATION_ARRAY.forEach((i) => {
            formData.delete(i);
            formData.append(i, data[i]);
          });
        }
        // react-hook-form automatically assigns empty string on touch
        // and instead of sending nothing, or nulls, it sends empty strings which
        // results in validation error from backend...
        if (
          defaultEditData![key] !== data[key] &&
          key !== "logo" &&
          !LOCATION_ARRAY.includes(key)
        ) {
          formData.append(key, data[key]);
        }
      }
      selectedTemplate && formData.append("templateId", selectedTemplate.id);

      return editInstitutionEntry.mutate(formData);
    }

    for (let key in data) {
      // same story as above
      if (data[key]) formData.append(key, data[key]);
    }
    selectedTemplate && formData.append("templateId", selectedTemplate.id);
    return createInstitutionEntry.mutate(formData);
  };

  const formButtons: IButton[] = [
    {
      label: "Cancel",
      type: "button",
      kind: "secondary",
      clickFn: () => navigate("/admin/institutions"),
      aria_label: "cancel",
    },
    {
      label: id ? "Save changes" : "Create institution",
      type: "submit",
      kind: "primary",
      icon: id ? undefined : "add",
      aria_label: "submit",
    },
  ];

  const handleBlur = () => {
    // Hides the dropdown when the user stops interacting with the input
    setTimeout(() => {
      setShowDropdown(false);
    }, 400);
  };

  const handleSet = (item) => {
    setSelectedTemplate(item);
    setValue("template", item?.name);
  };

  const onSearchChange = debounceEvent((e) => {
    setValue("template", e.target.value);
  }, 500);

  const onFocus = () => {
    setShowDropdown(true);
  };

  return (
    <>
      <Helmet>
        <title>{id ? "Update" : "Create"}</title>
      </Helmet>
      {loading && <Loading />}
      <Form
        errorNotification={renderErrorNotification()}
        formButtons={formButtons}
        formFields={institutionFormFields(
          register,
          errors,
          {
            country: watch(country),
            city: watch(city),
            logo: watch(logo),
          },
          {
            onBlur: handleBlur,
            onClick: handleSet,
            list: searchTemplate?.data?.data,
            onSearchChange,
            showDropdown,
            onFocus,
            disabled: false,
          }
        )}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        setValue={setValue}
        trigger={trigger}
      />
    </>
  );
};

export default InstitutionsForm;
