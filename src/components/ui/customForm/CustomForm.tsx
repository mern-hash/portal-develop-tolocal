import FormTextField from "@/components/features/form/form-fields/FormTextField";
import { invalidInput } from "@/shared/errorText";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form as CForm, Stack } from "carbon-components-react";
import FormSelectField from "@/components/features/form/form-fields/FormSelectField";
import { customeFormFields } from "@/shared/form-fields/formFields";
import { IFormSelectInput, IFormTextInput } from "@/shared/types";
import { CustomFormType } from "@/shared/types/IForm";
import { Button } from "@/components/ui";
import FormCheck from "@/components/features/form/form-fields/FormCheck";

const changeFunc = (prevArr, indexOfField, field, value) => {
  const newArray = prevArr.map((item, i) => {
    if (i === indexOfField) {
      return {
        ...item,
        [field]: value,
      };
    }
    return item;
  });

  return newArray;
};

const CustomForm = ({ setCustomFieldArr, indexOfField }: any) => {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors, isSubmitted },
    setValue,
    setError,
    watch,
    trigger,
  } = useForm<CustomFormType>({
    mode: "onTouched",
    defaultValues: {},
  });

  const cancelForm = (evt, id) => {
    evt.relatedTarget?.getAttribute("aria-label") === "cancel"
      ? evt.relatedTarget.click()
      : trigger(id);
  };

  const deleteFunc = () => {
    setCustomFieldArr((prevArr) => {
      if (indexOfField < 0 || indexOfField >= prevArr.length) {
        throw new Error("Invalid index");
      }

      const newArray = [
        ...prevArr.slice(0, indexOfField),
        ...prevArr.slice(indexOfField + 1),
      ];
      return newArray;
    });
  };

  useEffect(() => {
    setCustomFieldArr((prevArr) => {
      return changeFunc(prevArr, indexOfField, "name", watch("name"));
    });
  }, [watch("name")]);

  useEffect(() => {
    setCustomFieldArr((prevArr) => {
      return changeFunc(
        prevArr,
        indexOfField,
        "attributeType",
        watch("attributeType")
      );
    });
  }, [watch("attributeType")]);

  useEffect(() => {
    setCustomFieldArr((prevArr) => {
      return changeFunc(
        prevArr,
        indexOfField,
        "desceription",
        watch("desceription")
      );
    });
  }, [watch("desceription")]);

  useEffect(() => {
    setCustomFieldArr((prevArr) => {
      return changeFunc(prevArr, indexOfField, "id", watch("id"));
    });
  }, [watch("id")]);

  useEffect(() => {
    setCustomFieldArr((prevArr) => {
      return changeFunc(prevArr, indexOfField, "require", watch("require"));
    });
  }, [watch("require")]);

  useEffect(() => {
    setCustomFieldArr((prevArr) => {
      return changeFunc(prevArr, indexOfField, "handleSubmit", handleSubmit);
    });
  }, [handleSubmit]);

  return (
    <Stack gap={7} className="form__stack">
      <FormTextField
        register={register}
        data={
          customeFormFields(
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
          customeFormFields(
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
          customeFormFields(
            register,
            errors,
            {
              attributeType: watch("attributeType"),
            },
            indexOfField
          )[2] as IFormSelectInput
        }
      />
      <button
        className="testBtn"
        onClick={handleSubmit((data) => {
          console.log(data);
        })}
        style={{ display: "none" }}
      ></button>
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
          customeFormFields(
            register,
            errors,
            watch,
            indexOfField
          )[1] as IFormTextInput
        }
        cancelForm={cancelForm}
      />
      <FormCheck
        register={register}
        data={customeFormFields(register, errors, watch, indexOfField)[3]}
      />
    </Stack>
  );
};

export default CustomForm;
