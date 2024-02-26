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

  return (
    <Stack gap={7} className="form__stack">
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
      />

      <FormSelectField
        register={register}
        data={
          customFormFields(
            register,
            errors,
            {
              attributeType: watch(`customField.${indexOfField}.attributeType`),
            },
            indexOfField
          )[2] as IFormSelectInput
        }
      />

      <Button
        clickFn={deleteFunc}
        label=""
        aria_label="delete"
        kind="secondary"
        icon="add"
        type="button"
      />
      <FormTextField
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
        />
      )}
      <FormCheck
        register={register}
        data={customFormFields(register, errors, watch, indexOfField)[3]}
      />
    </Stack>
  );
};

export default CustomForm;
