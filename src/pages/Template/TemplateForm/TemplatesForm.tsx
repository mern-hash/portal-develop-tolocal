// Core
import {
  FunctionComponent,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Helmet } from "react-helmet-async";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
// Components
import { Button, ToastNotification } from "@/components/ui";

// Util
import { createTemplate, editTemplate, getInstitutions, getSingleTemplate } from "@/api";
import FormTextAreaField from "@/components/features/form/form-fields/FormTextAreaField";
import FormTextField from "@/components/features/form/form-fields/FormTextField";
import ListItems from "@/components/ui/list/ListItems";
import ModalForCustomField from "@/components/ui/modal/ModalForCustomField";
import FormLabel from "@/components/ui/FormLabel/FormLabel";
import CustomForm from "@/components/ui/customForm/CustomForm";
import { ADMIN_HEADING_LINKS, ADMIN_HEADING_LOGOLINK } from "@/core/constants";
import { blankCustomTemplate } from "@/shared/blankFieldData";
import { errorMessages } from "@/shared/errorText";
import { templateFormFields } from "@/shared/form-fields/formFields";
import { forCreatingEntry } from "@/shared/query-setup/forCreatingEntry";
import { forEditingEntry } from "@/shared/query-setup/forEditingEntry";
import { IButton, IFormTextInput } from "@/shared/types";
import { ContextData, ContextTypes } from "@/shared/types/ContextTypes";
import {
  CustomItem,
  TemplateForm,
  TemplateFormEdit,
} from "@/shared/types/IForm";
import { debounceEvent } from "@/shared/util";
import { Search } from "@carbon/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Form as CForm,
  ContainedList,
  Loading,
  Stack,
} from "carbon-components-react";
import "./templateform.scss";

const TemplatesForm: FunctionComponent = (): ReactElement => {
  // Fetched data, used to compare freshly edited input fields to see which
  // one needs to get patched

  const navigate = useNavigate();
  const { id } = useParams();
  const [institution, setInstitution] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showDropdownNew, setShowDropdownNew] = useState<boolean>(false);

  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitted },
    setError,
    watch,
    trigger,
    control,
    setValue,
  } = useForm<TemplateForm>({
    mode: "onBlur",
    defaultValues: {},
  });

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "customField", // unique name for your Field Array
  });
  const queryClient = useQueryClient();
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

  const singleTemplate = useQuery(
    ["singleTemplate ", { id }],
    getSingleTemplate,
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
    }
  );

  const searchInstitution = useQuery(
    ["fields", { term: watch("institute") }],
    getInstitutions,
    {
      enabled: showDropdownNew && watch("institute")?.length > 0,
    }
  );

  const createTemplateEntry = useMutation(
    (data: FormData) => createTemplate(data),
    {
      ...forCreatingEntry({
        navigate: () => navigate("/admin/templates"),
        updateContext,
        entity: "UserSchema",
        setError,
        invalidate: () => queryClient.invalidateQueries(["templates"]),
      }),
    }
  );

  const editTemplateEntry = useMutation(
    (data: TemplateFormEdit) => editTemplate(id, data),
    {
      ...forEditingEntry({
        updateContext,
        navigate: () => {
          navigate("/admin/templates");
        },
        entity: "Templates",
        setError,
        invalidate: () =>
          queryClient.invalidateQueries(["singleTemplate ", { id }]),
      }),
    }
  );

  const renderErrorNotification = useCallback(() => {
    if (!(isSubmitted && !!Object.keys(errors).length)) return null;

    if (
      isSubmitted &&
      createTemplateEntry.status === "idle" &&
      editTemplateEntry.status === "idle"
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
  }, [
    isSubmitted,
    errors,
    createTemplateEntry.status,
    editTemplateEntry.status,
  ]);

  const onSearchChange = debounceEvent((e) => {
    setValue("institute", e.target.value);
  }, 500);

  const loading = useMemo(
    () => createTemplateEntry.isLoading || editTemplateEntry.isLoading,
    [createTemplateEntry, editTemplateEntry]
  );

  const setFormDefaultValues = (data: TemplateFormEdit) => {
    // Maps over data entries and set each of them as form's defaultValue
    Object.entries(data).forEach(([name, value]: any) => {
      setValue(name, value);
    });
    updateHeadingContext(`Edit ${data.name}`);
  };

  useEffect(() => {
    if (id && singleTemplate.data) {
      setFormDefaultValues(singleTemplate.data);
      return;
    }
    updateHeadingContext("Build a template");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleTemplate.data, id]);

  const onSubmit = async (data: TemplateForm) => {
    if (!institution) {
      setError("institute", {
        message: "Please select valid institution from suggested option!",
      });
      return;
    }

    if (loading || !isValid) return;
    const formData = new FormData();
    formData.append("name", data.name);
    data?.description && formData.append("description", data.description);
    formData.append("instituteId", institution);
    data.customField &&
      data.customField.map((field, index) => {
        for (let key in field) {
          if (field.hasOwnProperty(key)) {
            if (key === "value") {
              field[key]?.map((obj, i) => {
                formData.append(`fields[${index}][${key}][${i}]`, obj.value);
                return null;
              });
            } else {
              formData.append(`fields[${index}][${key}]`, field[key]);
            }
          }
        }
        return null;
      });

    const createTemplate = createTemplateEntry.mutate(formData);

    return createTemplate;
  };

  const onUpdate = async (data: TemplateForm) => {
    if (loading || !isValid) return;
    editTemplateEntry.mutate(data as unknown as TemplateFormEdit);
  };

  const formButtons: IButton[] = [
    {
      label: "Cancel",
      type: "button",
      kind: "secondary",
      clickFn: () => navigate("/admin/templates"),
      aria_label: "cancel",
    },
    {
      label: id ? "Save changes" : "Build a Template",
      type: "submit",
      kind: "primary",
      icon: id ? undefined : "add",
      aria_label: "submit",
    },
  ];

  const cancelForm = (evt, id) => {
    evt.relatedTarget?.getAttribute("aria-label") === "cancel"
      ? evt.relatedTarget.click()
      : trigger(id);
  };

  const onChangeInstitute = (item: { id: string; name: string }) => {
    setInstitution(item.id);
    setValue("institute", item.name);
  };

  const onBlur = () => {
    setShowDropdownNew(false);
    setTimeout(() => {
      setShowDropdown(false);
    }, 400);
  };

  const addCustomField = (item: CustomItem) => {
    if (!item) return;
    setOpen(false);
    let value;
    if ((item?.type === "list" || item?.type === "dropdown") && item?.value) {
      value = item.value.split(",").map((item) => ({ value: item }));
    }
    append({
      ...blankCustomTemplate,
      selectOption: item?.value,
      name: item?.name,
      label: item?.name,
      attributeType: item?.type,
      isCustom: true,
      value,
    });
  };
  return (
    <>
      <Helmet>
        <title>{id ? "Update" : "Create"}</title>
      </Helmet>
      {loading && <Loading />}
      <CForm onSubmit={handleSubmit(id ? onUpdate : onSubmit)} className="form">
        {renderErrorNotification()}
        <div className="template-form__wrapper">
          <div className="template-form__left-content">
            <h6>Template name</h6>
            <p>
              The template name is used to derive the "type" field in the
              credential. It is visible to everyone who views the credential.
            </p>
          </div>
          <Stack gap={7} className="form__stack template-form__stack">
            <FormTextField
              register={register}
              data={
                templateFormFields(register, errors, watch)[0] as IFormTextInput
              }
              cancelForm={cancelForm}
            />
          </Stack>
        </div>
        <div className="template-form__wrapper">
          <div className="template-form__left-content">
            <h6>Template description</h6>
            <p>
              Describe the template purpose. This is optional but recommended..
            </p>
          </div>
          <Stack gap={7} className="form__stack template-form__stack">
            <FormTextAreaField
              register={register}
              data={
                templateFormFields(register, errors, watch)[1] as IFormTextInput
              }
              cancelForm={cancelForm}
              classNameCustom="template-form__input-full-width template-form__input-textarea-style"
            />
          </Stack>
        </div>
        <div className="template-form__wrapper">
          <div className="template-form__left-content">
            <h6>Template institution</h6>
            <p>
              The template institution is used to link this template with the
              institution you specify.
            </p>
          </div>
          <Stack gap={7} className="form__stack template-form__stack">
            <div className="CredentialForm__search-wrapper">
              <FormLabel label={""} description={"Template Institution"} />
              <div className="CredentialForm__search-input-wrapper">
                <Search
                  labelText={"Institute"}
                  {...register("institute", {
                    required: { value: true, message: "Required field" },
                  })}
                  placeholder={"Search for institution"}
                  onBlur={onBlur}
                  onChange={onSearchChange}
                  disabled={!!id}
                  onFocus={() => {
                    setShowDropdownNew(true);
                    setShowDropdown(true);
                  }}
                />
                {errors?.institute && (
                  <p className="error_msg">{errors.institute.message}</p>
                )}
                {searchInstitution?.data?.data && (
                  <ContainedList
                    className={`search-list-wrapper ${
                      !showDropdown ? "hide" : ""
                    }`}
                    label=""
                    style={{ display: "none" }}
                  >
                    {searchInstitution?.data?.data?.length > 0 ? (
                      searchInstitution?.data?.data?.map((item) => (
                        <ListItems
                          key={item?.id}
                          name={item?.name}
                          onClickFunc={onChangeInstitute}
                          item={item}
                        />
                      ))
                    ) : (
                      <ListItems name={"No data found"} />
                    )}
                  </ContainedList>
                )}
              </div>
            </div>
          </Stack>
        </div>
        <div className="template-form__wrapper">
          <div className="template-form__left-content">
            <h6>Template attributes</h6>
            <p>Define the attributes you want on the credential.</p>
          </div>
          <Stack
            gap={7}
            className="form__stack template-form__stack-attributes"
          >
            {fields.map((item, i) => (
              <CustomForm
                key={item.id}
                indexOfField={i}
                remove={remove}
                register={register}
                cancelForm={cancelForm}
                watch={watch}
                errors={errors?.customField && errors?.customField[i]}
                id={!!id}
                isCustom={!!item.isCustom}
                control={control}
              />
            ))}
            <div className="template-form__Addfield-btnwrapper">
              <Button
                clickFn={() => {
                  append(blankCustomTemplate);
                }}
                label="Add Field"
                type="button"
                aria_label="add-button"
                kind="secondary"
                disabled={!!id}
              />

              <Button
                clickFn={() => {
                  setOpen(true);
                }}
                label="Add Custom Field"
                type="button"
                aria_label="add-button"
                kind="secondary"
                disabled={!!id}
              />
            </div>
          </Stack>
        </div>
        <div className="form__row form__row__buttons template-form__build-cancel-btn-wrapper">
          {formButtons.map((button: IButton, i: number) => (
            <Button key={i} {...button} />
          ))}
        </div>
        {open && (
          <ModalForCustomField
            open={open}
            setOpen={setOpen}
            heading="Add custom field"
            secondaryButtonText="Cancel"
            primaryButtonText="Add field"
            onSubmit={addCustomField}
          />
        )}
      </CForm>
    </>
  );
};

export default TemplatesForm;
