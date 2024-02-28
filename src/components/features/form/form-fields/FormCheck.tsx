import { Checkbox } from "@carbon/react";
import { useState } from "react";

function FormCheck({
  data,
  register,
  classNameCustom,
}: {
  data: any;
  register: any;
  classNameCustom?: any;
}) {
  const { id, label } = data;

  return (
    <Checkbox
      id={id}
      labelText={label}
      {...register("require")}
      className={classNameCustom}
    />
  );
}

export default FormCheck;
