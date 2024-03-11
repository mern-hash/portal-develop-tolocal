import { FunctionComponent, ReactElement } from "react";
import { IFormTextInput } from "@/shared/types";
import { TextInput } from "carbon-components-react";
import { UseFormRegister } from "react-hook-form";

const FormTextField: FunctionComponent<{
  register: UseFormRegister<any>;
  data: IFormTextInput;
  cancelForm: (e, id) => void;
  classNameCustom?: string;
}> = ({ register, data, cancelForm, classNameCustom }): ReactElement => {
  const { id, label, placeholder, validations, errors, readonly } = data;

  return (
    <TextInput
      id={id}
      className={`form__input ${classNameCustom && classNameCustom}`}
      labelText={label}
      placeholder={placeholder}
      readOnly={readonly}
      {...register(id, {
        ...validations,
      })}
      {...errors}
      onBlur={(e) => cancelForm(e, id)}
    />
  );
};

export default FormTextField;
