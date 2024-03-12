import Delete from "@/assets/icons/Delete";
import FormCheck from "@/components/features/form/form-fields/FormCheck";
import FormSelectField from "@/components/features/form/form-fields/FormSelectField";
import FormTextField from "@/components/features/form/form-fields/FormTextField";
import { customFormFields } from "@/shared/form-fields/formFields";
import { IFormSelectInput, IFormTextInput } from "@/shared/types";
import { TemplateForm } from "@/shared/types/IForm";
import {
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";

type Props = {
  indexOfField: number;
  register: UseFormRegister<TemplateForm>;
  cancelForm: (evt: any, id: any) => void;
  remove: UseFieldArrayRemove;
  watch: UseFormWatch<TemplateForm>;
  errors: any;
  id: boolean;
  isCustom: boolean;
};

const CustomForm = ({
  indexOfField,
  register,
  cancelForm,
  remove,
  watch,
  errors,
  id,
  isCustom,
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
              )[10] as IFormTextInput
            }
            cancelForm={cancelForm}
            classNameCustom="template-form__input-first-half"
            isCustom={isCustom}
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
            disabled={id || isCustom}
            classNameCustom="template-form__select-secound-half"
          />
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
            classNameCustom="template-form__input-fifty"
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
            classNameCustom="template-form__input-fifty"
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
              disabled={id}
            />
          ))}
        </div>
        {!id && (
          <Delete
            classNameCustom="template-form__DeleteSvg"
            clickFunc={deleteFunc}
          />
        )}
      </div>
    </>
  );
};

export default CustomForm;
