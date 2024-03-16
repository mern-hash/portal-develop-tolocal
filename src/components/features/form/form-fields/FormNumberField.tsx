import { FunctionComponent, ReactElement } from "react";
import { IFormTextInput } from "@/shared/types";
import { NumberInput } from "carbon-components-react";
import { UseFormRegister } from "react-hook-form";

const FormNumberField: FunctionComponent<{
  register: UseFormRegister<any>;
  data: IFormTextInput;
  cancelForm: (e, id) => void;
  classNameCustom?: string;
  isCustom?: boolean;
}> = ({
  register,
  data,
  cancelForm,
  classNameCustom,
  isCustom,
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
      {...errors}
      onBlur={(e) => cancelForm(e, id)}
      disabled={!!isCustom}
    />
  );
};

export default FormNumberField;
