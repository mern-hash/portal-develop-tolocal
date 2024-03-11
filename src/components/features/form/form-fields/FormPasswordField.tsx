import { FunctionComponent, ReactElement } from "react";
import { IFormTextInput } from "@/shared/types";
import { PasswordInput } from "carbon-components-react";
import { UseFormRegister } from "react-hook-form";

const FormPasswordField: FunctionComponent<{
  register: UseFormRegister<any>;
  data: IFormTextInput;
  cancelForm: (e, id) => void;
}> = ({ register, data, cancelForm }): ReactElement => {
  const { id, label, placeholder, validations, errors } = data as any;
  return (
    <PasswordInput
      key={id}
      id={id}
      className="form__input"
      labelText={label}
      placeholder={placeholder}
      {...register(id, {
        ...validations,
      })}
      {...errors}
      onBlur={(e) => cancelForm(e, id)}
    />
  );
};

export default FormPasswordField;
