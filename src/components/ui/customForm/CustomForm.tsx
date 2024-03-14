import Delete from "@/assets/icons/Delete";
import FormCheck from "@/components/features/form/form-fields/FormCheck";
import FormSelectField from "@/components/features/form/form-fields/FormSelectField";
import FormTextField from "@/components/features/form/form-fields/FormTextField";
import {
  customFormFields,
  valueListField,
} from "@/shared/form-fields/formFields";
import { IFormSelectInput, IFormTextInput } from "@/shared/types";
import { TemplateForm } from "@/shared/types/IForm";
import { useEffect } from "react";
import {
  Control,
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormWatch,
  useFieldArray,
} from "react-hook-form";
import Button from "../button/Button";

type Props = {
  indexOfField: number;
  register: UseFormRegister<TemplateForm>;
  cancelForm: (evt: any, id: any) => void;
  remove: UseFieldArrayRemove;
  watch: UseFormWatch<TemplateForm>;
  errors: any;
  id: boolean;
  isCustom: boolean;
  control: Control<TemplateForm, any>;
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
  control,
}: Props) => {
  const {
    fields,
    append,
    remove: removeValue,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: `customField.${indexOfField}.value`, // unique name for your Field Array
  });

  const deleteFunc = () => {
    remove(indexOfField);
  };

  useEffect(() => {
    append({ value: "" });
  }, []);
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
            isCustom={isCustom}
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
          {(watch(`customField.${indexOfField}.attributeType`) === "list" ||
            watch(`customField.${indexOfField}.attributeType`) ===
              "dropdown") && (
            <>
              {fields.map((_, index) => {
                return (
                  <>
                    <FormTextField
                      register={register}
                      data={
                        valueListField({
                          errors,
                          parentIndex: indexOfField,
                          index,
                        }) as IFormTextInput
                      }
                      cancelForm={cancelForm}
                      classNameCustom="template-form__input-fifty"
                    />
                    <Delete
                      classNameCustom="template-form__DeleteSvg"
                      clickFunc={() => {
                        removeValue(index);
                      }}
                    />
                  </>
                );
              })}
              <div className="template-form__AddValue">
                <Button
                  clickFn={() => {
                    append({ value: "" });
                  }}
                  label="Add Value"
                  type="button"
                  aria_label="add-button"
                  kind="secondary"
                  // icon="add"
                  size="sm"
                />
              </div>
            </>
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
