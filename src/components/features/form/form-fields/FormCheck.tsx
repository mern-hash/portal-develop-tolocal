import { Checkbox } from "@carbon/react";
import { UseFormRegister } from "react-hook-form";

function FormCheck({
  data,
  register,
  classNameCustom,
  disabled,
}: {
  data: any;
  register: UseFormRegister<any>;
  classNameCustom?: string;
  disabled?: boolean;
}) {
  const { id, label } = data;
  return (
    <Checkbox
      id={id}
      labelText={label}
      {...register(id)}
      className={classNameCustom}
      disabled={disabled ? disabled : false}
    />
  );
}

export default FormCheck;
