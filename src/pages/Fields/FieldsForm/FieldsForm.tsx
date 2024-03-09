// Core
import { FunctionComponent, ReactElement, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
// Components
import { Button } from "@/components/ui";
// Util
import { createFields } from "@/api/fields/fields";
import Delete from "@/assets/icons/Delete";
import FormSelectField from "@/components/features/form/form-fields/FormSelectField";
import FormTextField from "@/components/features/form/form-fields/FormTextField";
import { ADMIN_HEADING_LINKS, ADMIN_HEADING_LOGOLINK } from "@/core/constants";
import { fieldFormFields } from "@/shared/form-fields/formFields";
import { forCreatingEntry } from "@/shared/query-setup/forCreatingEntry";
import { IButton, IFormTextInput } from "@/shared/types";
import { ContextData, ContextTypes } from "@/shared/types/ContextTypes";
import { FieldForm, IFormSelectInput } from "@/shared/types/IForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form as CForm, Stack } from "carbon-components-react";
import "./fieldsform.scss";

const TemplatesForm: FunctionComponent = (): ReactElement => {
  // Fetched data, used to compare freshly edited input fields to see which
  // one needs to get patched

  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    trigger,
    control,
  } = useForm<FieldForm>({
    mode: "onBlur",
    defaultValues: {},
  });
  // setError("attributeType");
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "valueList", // unique name for your Field Array
  });
  // <Outlet /> context to update HeaderLayout data
  const { updateContext } = useOutletContext<{
    updateContext: (state: string, data: ContextData) => void;
  }>();

  const createFieldEntry = useMutation(
    (data: FieldForm) => createFields(data),
    {
      ...forCreatingEntry({
        navigate: () => navigate("/admin/fields"),
        updateContext,
        entity: "fields",
        setError,
        invalidate: () => queryClient.invalidateQueries(["fields"]),
      }),
    }
  );

  // Initial heading setup
  const updateHeadingContext = (title: string) => {
    updateContext(ContextTypes.HLC, {
      logoLink: ADMIN_HEADING_LOGOLINK,
      links: ADMIN_HEADING_LINKS,
      title,
    });
  };

  useEffect(() => {
    updateHeadingContext("Fields");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    createFieldEntry.mutate(data);
  };

  const formButtons: IButton[] = [
    {
      label: "Cancel",
      type: "button",
      kind: "secondary",
      clickFn: () => navigate("/admin/field"),
      aria_label: "cancel",
    },
    {
      label: id ? "Save changes" : "Create field",
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
        <div className="field-form__main-wrapper">
          <div className="field-form__wrapper">
            <Stack gap={7} className="form__stack field-form__stack">
              <FormTextField
                register={register}
                data={fieldFormFields(errors)[0] as IFormTextInput}
                cancelForm={cancelForm}
              />
              <FormSelectField
                register={register}
                data={
                  fieldFormFields(errors, register, {
                    attributeType: watch(`attributeType`),
                  })[1] as IFormSelectInput
                }
                classNameCustom="field-form__select-secound-half"
              />
            </Stack>
          </div>
          <div className="field-form__divider-hr"></div>
          <div className="field-form__wrapper">
            <Stack gap={7} className="form__stack field-form__stack">
              <FormTextField
                register={register}
                data={fieldFormFields(errors)[2] as IFormTextInput}
                cancelForm={cancelForm}
              />
            </Stack>
          </div>
          {watch("attributeType") === "list" && (
            <>
              {fields.length > 0 && (
                <div className="field-form__wrapper field-form__wrapper-list">
                  {fields.map((field, i) => (
                    <div className="field-form__inner-input-list-warpper">
                      <Stack gap={7} className="form__stack field-form__stack">
                        <FormTextField
                          register={register}
                          data={
                            fieldFormFields(
                              errors,
                              register,
                              watch,
                              i
                            )[3] as IFormTextInput
                          }
                          cancelForm={cancelForm}
                          key={field.id}
                        />
                      </Stack>
                      <Delete
                        classNameCustom="field-form__DeleteSvg"
                        clickFunc={() => {
                          remove(i);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="field-form__divider-hr"></div>
              <div className="field-form__Addfield-btnwrapper">
                <Button
                  clickFn={() => {
                    append({ value: "" });
                  }}
                  label="Add Field"
                  type="button"
                  aria_label="add-button"
                  kind="secondary"
                />
              </div>
            </>
          )}
        </div>
        <div className="form__row form__row__buttons field-form__build-cancel-btn-wrapper">
          {formButtons.map((button: IButton, i: number) => (
            <Button key={i} {...button} />
          ))}
        </div>
      </CForm>
    </>
  );
};

export default TemplatesForm;
