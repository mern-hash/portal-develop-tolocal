import { FunctionComponent, ReactElement } from "react";
import { IFormTextInput } from "@/shared/types";
import { NumberInput } from "carbon-components-react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

const FormNumberField: FunctionComponent<{
  register: UseFormRegister<any>;
  data: IFormTextInput;
  cancelForm: (e, id) => void;
  classNameCustom?: string;
  isCustom?: boolean;
  setValue: UseFormSetValue<any>;
}> = ({
  register,
  data,
  cancelForm,
  classNameCustom,
  isCustom,
  setValue,
}): ReactElement => {
  const { id, label, placeholder, validations, errors, readonly } = data;

  return (
    <NumberInput
      id={id}
      className={`form__input ${classNameCustom && classNameCustom}`}
      label={label}
      placeholder={placeholder}
      readOnly={readonly}
      {...register(id, {
        ...validations,
      })}
      onChange={(_, { value }) => {
        setValue(id, value);
      }}
      {...errors}
      onBlur={(e) => cancelForm(e, id)}
      disabled={!!isCustom}
    />
  );
};

export default FormNumberField;
