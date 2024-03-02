import FormTextField from "@/components/features/form/form-fields/FormTextField";
import FormSelectField from "@/components/features/form/form-fields/FormSelectField";
import { customFormFields } from "@/shared/form-fields/formFields";
import { IFormSelectInput, IFormTextInput } from "@/shared/types";
import FormCheck from "@/components/features/form/form-fields/FormCheck";
import Delete from "@/assets/icons/Delete";
import FormTextAreaField from "@/components/features/form/form-fields/FormTextAreaField";
import {
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { TemplateForm } from "@/shared/types/IForm";

type Props = {
  indexOfField: number;
  register: UseFormRegister<TemplateForm>;
  cancelForm: (evt: any, id: any) => void;
  remove: UseFieldArrayRemove;
  watch: UseFormWatch<TemplateForm>;
  errors: any;
};

const CustomForm = ({
  indexOfField,
  register,
  cancelForm,
  remove,
  watch,
  errors,
}: Props) => {
  const deleteFunc = () => {
    remove(indexOfField);
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

          <FormTextAreaField
            classNameCustom="template-form__input-full-width template-form__input-textarea-style"
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
                )[3] as IFormTextInput
              }
              cancelForm={cancelForm}
              classNameCustom="template-form__input-full-width"
            />
          )}
          {Array.from({ length: 6 }, (_, index) => index + 4).map((item) => (
            <FormCheck
              register={register}
              data={
                customFormFields(register, errors, watch, indexOfField)[item]
              }
              classNameCustom="template-form__Requird-check"
              key={item}
            />
          ))}
        </div>
        <Delete
          classNameCustom="template-form__DeleteSvg"
          clickFunc={deleteFunc}
        />
      </div>
    </>
  );
};

export default CustomForm;
