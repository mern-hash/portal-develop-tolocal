// Core
import { FunctionComponent, ReactElement, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
// Components
import { Button } from "@/components/ui";
// Util
import { IButton, IFormTextInput } from "@/shared/types";
import { ContextTypes, ContextData } from "@/shared/types/ContextTypes";
import { templateFormFields } from "@/shared/form-fields/formFields";
import { ADMIN_HEADING_LINKS, ADMIN_HEADING_LOGOLINK } from "@/core/constants";
import { Form as CForm, Stack } from "carbon-components-react";
import FormTextField from "@/components/features/form/form-fields/FormTextField";
import { TemplateForm } from "@/shared/types/IForm";
import CustomForm from "@/components/ui/customForm/CustomForm";
import "./templateform.scss";
import FormTextAreaField from "@/components/features/form/form-fields/FormTextAreaField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTemplate } from "@/api/template/template";
import { forCreatingEntry } from "@/shared/query-setup/forCreatingEntry";

const blankCustomTemplate = {
  attributeType: "",
  name: "",
  description: "",
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    trigger,
    control,
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

  const createTemplateEntry = useMutation(
    (data: FormData) => createTemplate(data),
    {
      ...forCreatingEntry({
        navigate: () => navigate("/admin/template"),
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
    console.log("createTemplate", createTemplate);
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
