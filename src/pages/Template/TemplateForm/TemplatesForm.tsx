// Core
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
// Components
import { Button } from "@/components/ui";
// Util
import { getInstitutions } from "@/api";
import { createTemplate } from "@/api/template/template";
import FormTextAreaField from "@/components/features/form/form-fields/FormTextAreaField";
import FormTextField from "@/components/features/form/form-fields/FormTextField";
import ListItems from "@/components/newComponets/ListItems";
import FormLabel from "@/components/ui/FormLabel/FormLabel";
import CustomForm from "@/components/ui/customForm/CustomForm";
import { ADMIN_HEADING_LINKS, ADMIN_HEADING_LOGOLINK } from "@/core/constants";
import { templateFormFields } from "@/shared/form-fields/formFields";
import { forCreatingEntry } from "@/shared/query-setup/forCreatingEntry";
import { IButton, IFormTextInput } from "@/shared/types";
import { ContextData, ContextTypes } from "@/shared/types/ContextTypes";
import { TemplateForm } from "@/shared/types/IForm";
import { debounceEvent } from "@/shared/util";
import { Search } from "@carbon/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form as CForm, ContainedList, Stack } from "carbon-components-react";
import "./templateform.scss";

const blankCustomTemplate = {
  attributeType: "",
  name: "",
  placeholder: "",
  label: "",
  require: false,
  isClaim: false,
  isSearchable: false,
  isSortable: false,
  isFilterable: false,
  inTable: false,
};

const TemplatesForm: FunctionComponent = (): ReactElement => {
  // Fetched data, used to compare freshly edited input fields to see which
  // one needs to get patched

  const navigate = useNavigate();
  const { id } = useParams();
  const [institution, setInstitution] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    trigger,
    control,
    setValue,
  } = useForm<TemplateForm>({
    mode: "onBlur",
    defaultValues: {},
  });
  // setError("attributeType");
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

  const onSearchChange = debounceEvent((e) => {
    setValue("institute", e.target.value);
  }, 500);

  const searchInstitution = useQuery(
    ["institutions", { term: watch("institute") }],
    getInstitutions,
    {
      enabled: watch("institute")?.length > 0,
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
        invalidate: () => queryClient.invalidateQueries(["alltemplates"]),
      }),
    }
  );

  useEffect(() => {
    updateHeadingContext("Build a template");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);

    data.customField.map((field, index) => {
      for (let key in field) {
        if (field.hasOwnProperty(key)) {
          formData.append(`fields[${index}][${key}]`, field[key]);
        }
      }
    });
    const createTemplate = createTemplateEntry.mutate(formData);

    return createTemplate;
  };

  const formButtons: IButton[] = [
    {
      label: "Cancel",
      type: "button",
      kind: "secondary",
      clickFn: () => navigate("/admin/template"),
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

  const onChangeInstitute = (item: any) => {
    setInstitution(item);
    setValue("institute", item?.name);
  };

  const onBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  useEffect(() => {
    watch("institute") &&
      watch("institute").length > 0 &&
      setShowDropdown(true);
  }, [watch("institute")]);

  return (
    <>
      <Helmet>
        <title>{id ? "Update" : "Create"}</title>
      </Helmet>
      <CForm onSubmit={handleSubmit(onSubmit)} className="form">
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
                  {...register("institute")}
                  placeholder={"Search for institution"}
                  onBlur={onBlur}
                  onChange={onSearchChange}
                />
                {showDropdown && searchInstitution?.data?.data && (
                  <ContainedList className="search-list-wrapper" label="">
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
              />
            </div>
          </Stack>
        </div>

        <div className="form__row form__row__buttons template-form__build-cancel-btn-wrapper">
          {formButtons.map((button: IButton, i: number) => (
            <Button key={i} {...button} />
          ))}
        </div>
      </CForm>
    </>
  );
};

export default TemplatesForm;
