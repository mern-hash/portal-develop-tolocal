import { IFormTextInput } from "@/shared/types";
import { TextArea } from "@carbon/react";
import { FunctionComponent, ReactElement } from "react";
import { UseFormRegister } from "react-hook-form";

const FormTextAreaField: FunctionComponent<{
  register: UseFormRegister<any>;
  data: IFormTextInput;
  cancelForm: (e, id) => void;
  classNameCustom?: string;
}> = ({ register, data, cancelForm, classNameCustom }): ReactElement => {
  const { id, label, placeholder, validations, errors, readonly } = data;

  return (
    <TextArea
      className={classNameCustom}
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

export default FormTextAreaField;
