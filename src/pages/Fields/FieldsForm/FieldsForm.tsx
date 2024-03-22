// Core
import { FunctionComponent, ReactElement, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import "./fieldsform.scss";
// Components
import { Button } from "@/components/ui";
// Util
import Delete from "@/assets/icons/Delete";
import FormSelectField from "@/components/features/form/form-fields/FormSelectField";
import FormTextField from "@/components/features/form/form-fields/FormTextField";
import { ADMIN_HEADING_LINKS, ADMIN_HEADING_LOGOLINK } from "@/core/constants";
import { fieldFormFields } from "@/shared/form-fields/formFields";
import { forCreatingEntry } from "@/shared/query-setup/forCreatingEntry";
import { IButton, IFormTextInput } from "@/shared/types";
import { ContextData, ContextTypes } from "@/shared/types/ContextTypes";
import {
  FieldForm,
  FieldFormForRequest,
  IFormSelectInput,
} from "@/shared/types/IForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form as CForm, Stack, Loading } from "carbon-components-react";
import { forEditingEntry } from "@/shared/query-setup/forEditingEntry";
import { createFields, editField, getSingleField } from "@/api";

const FieldsForm: FunctionComponent = (): ReactElement => {
  // Fetched data, used to compare freshly edited input fields to see which
  // one needs to get patched

  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    setValue,
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
    (data: FieldFormForRequest) => createFields(data),
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

  const singleField = useQuery(["singleField", { id }], getSingleField, {
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  // Initial heading setup
  const updateHeadingContext = (title: string) => {
    updateContext(ContextTypes.HLC, {
      logoLink: ADMIN_HEADING_LOGOLINK,
      links: ADMIN_HEADING_LINKS,
      title,
    });
  };

  const editFieldEntry = useMutation(
    (data: FieldFormForRequest) => editField(id, data),
    {
      ...forEditingEntry({
        updateContext,
        navigate: () => {
          navigate("/admin/fields");
        },
        entity: "Fields",
        setError,
        invalidate: () =>
          queryClient.invalidateQueries(["singleField ", { id }]),
      }),
    }
  );

  const setFormDefaultValues = (data: {
    type: string;
    name: string;
    value?: string;
  }) => {
    // Set the form's default values for attributeType and name.
    setValue("attributeType", data.type);
    setValue("name", data.name);

    // Handle the specific logic for 'dropdown' and 'list' types.
    if (data.type === "dropdown" || data.type === "list") {
      // Split the value by comma and iterate over the items.
      const values = data?.value ? data.value.split(",") : [];
      values.forEach((item, i) => {
        // For the first item, use setValue. For subsequent items, use append.
        if (i === 0) {
          setValue("value", item);
        } else {
          append({ value: item });
        }
      });
    } else {
      // For other types, simply set the value.
      setValue("value", data.value || "");
    }

    updateHeadingContext(`Edit ${data.name}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // If there is ID in url -> fetch institution data and set values
    // as form default and set heading to "Edit __"
    if (id && singleField.data) {
      setFormDefaultValues(singleField.data);
      return;
    }
    updateHeadingContext("Fields");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleField.data]);

  const loading = useMemo(
    () => createFieldEntry.isLoading || editFieldEntry.isLoading,
    [createFieldEntry, editFieldEntry]
  );

  const onSubmit = async (data: FieldForm) => {
    if (loading || !isValid) return;
    const { name, attributeType: type, value, valueList } = data;

    const newObj: FieldFormForRequest = { name, value, type };

    if (valueList && valueList.length > 0) {
      const newValue = [value];
      valueList.map(({ value }) => {
        newValue.push(value);
        return null;
      });
      newObj.value = newValue;
    }

    id ? editFieldEntry.mutate(newObj) : createFieldEntry.mutate(newObj);
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
  const formField = fieldFormFields(errors, register, {
    attributeType: watch(`attributeType`),
  });
  return (
    <>
      <Helmet>
        <title>{id ? "Update" : "Create"}</title>
      </Helmet>
      {loading && <Loading />}
      <CForm onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="field-form__main-wrapper">
          <div className="field-form__wrapper">
            <Stack gap={7} className="form__stack field-form__stack">
              <FormTextField
                register={register}
                data={formField[0] as IFormTextInput}
                cancelForm={cancelForm}
              />
              <FormSelectField
                register={register}
                data={formField[1] as IFormSelectInput}
                classNameCustom="field-form__select-secound-half"
              />
            </Stack>
          </div>
          <div className="field-form__divider-hr"></div>

          {(watch("attributeType") === "list" ||
            watch("attributeType") === "dropdown") && (
            <>
              <div className="field-form__wrapper">
                <Stack gap={7} className="form__stack field-form__stack">
                  <FormTextField
                    register={register}
                    data={
                      {
                        ...formField[2],
                        validations: {
                          required:
                            watch("attributeType") === "list" ||
                            watch("attributeType") === "dropdown"
                              ? "Required field"
                              : false,
                        },
                      } as IFormTextInput
                    }
                    cancelForm={cancelForm}
                  />
                </Stack>
              </div>
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

export default FieldsForm;
