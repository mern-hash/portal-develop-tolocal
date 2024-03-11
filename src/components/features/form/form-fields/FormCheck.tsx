import { Checkbox } from "@carbon/react";

function FormCheck({
  data,
  register,
  classNameCustom,
  disabled,
}: {
  data: any;
  register: any;
  classNameCustom?: any;
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
