import FormTextField from "@/components/features/form/form-fields/FormTextField";
import { invalidInput } from "@/shared/errorText";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form as CForm, Stack } from "carbon-components-react";
import FormSelectField from "@/components/features/form/form-fields/FormSelectField";
import { customFormFields } from "@/shared/form-fields/formFields";
import { IFormSelectInput, IFormTextInput } from "@/shared/types";
import { CustomFormType } from "@/shared/types/IForm";
import { Button } from "@/components/ui";
import FormCheck from "@/components/features/form/form-fields/FormCheck";
import Delete from "@/assets/icons/Delete";
import { TextArea } from "@carbon/react";

const CustomForm = ({
  indexOfField,
  register,
  cancelForm,
  remove,
  watch,
  errors,
}: any) => {
  const deleteFunc = () => {
    remove(indexOfField);
  };

  useEffect(() => {
    console.log(watch(`customField.${indexOfField}.attributeType`));
  }, [watch(`customField.${indexOfField}.attributeType`)]);

  const textareaProps = {
    labelText: "Attribute Description",
    placeholder: "Describe what this attribute is all about...",
    id: "test5",
    rows: 4,
  };

  return (
    <>
      <div className="template-form__form-outer-wrapper">
        <div className="template-form__form-inner-wrapper">
          <FormTextField
            register={register}
            data={
              customFormFields(
                register,
                errors,
                watch,
                indexOfField
              )[0] as IFormTextInput
            }
            cancelForm={cancelForm}
            classNameCustom="template-form__input-first-half"
          />
          <FormSelectField
            register={register}
            data={
              customFormFields(
                register,
                errors,
                {
                  attributeType: watch(
                    `customField.${indexOfField}.attributeType`
                  ),
                },
                indexOfField
              )[2] as IFormSelectInput
            }
          />
          <FormTextField
            register={register}
            data={
              customFormFields(
                register,
                errors,
                watch,
                indexOfField
              )[4] as IFormTextInput
            }
            cancelForm={cancelForm}
            classNameCustom="template-form__input-full-width"
          />
          {/* <FormTextField
            register={register}
            data={
              customFormFields(
                register,
                errors,
                watch,
                indexOfField
              )[1] as IFormTextInput
            }
            cancelForm={cancelForm}
            classNameCustom="template-form__input-full-width"
          /> */}
          <TextArea
            {...textareaProps}
            className="template-form__input-full-width template-form__input-textarea-style"
          />
          {watch(`customField.${indexOfField}.attributeType`) === "select" && (
            <FormTextField
              register={register}
              data={
                customFormFields(
                  register,
                  errors,
                  watch,
                  indexOfField
                )[5] as IFormTextInput
              }
              cancelForm={cancelForm}
              classNameCustom="template-form__input-full-width"
            />
          )}
          <FormCheck
            register={register}
            data={customFormFields(register, errors, watch, indexOfField)[3]}
            classNameCustom="template-form__Requird-check"
          />
        </div>
        <Delete classNameCustom="template-form__DeleteSvg" />
      </div>
    </>
  );
};

export default CustomForm;
