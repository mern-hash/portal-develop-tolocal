import { Checkbox } from "@carbon/react";
import { useState } from "react";

function FormCheck({ data, register }) {
  const { id, label } = data;

  return <Checkbox id={id} labelText={label} {...register("require")} />;
}

export default FormCheck;
