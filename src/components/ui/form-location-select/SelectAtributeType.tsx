import { FunctionComponent, useEffect, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { Select, SelectItem } from "carbon-components-react";

const attributeData = [
  { name: "text", value: "text" },
  { name: "number", value: "number" },
  { name: "checkbox", value: "checkbox" },
  { name: "file-image", value: "file-image" },
  { name: "file-csv", value: "file-csv" },
  { name: "select", value: "select" },
  { name: "password", value: "password" },
  { name: "time", value: "time" },
  { name: "date", value: "date" },
  { name: "date-time", value: "dateTime" },
  { name: "list", value: "list" },
];

const SelectAtributeType: FunctionComponent<{
  id: string;
  register: UseFormRegister<any>;
  errors: { message: string; ref: JSX.Element; type: string } | undefined;
  watch?: any;
  validations: any;
  label: string;
  classNameCustom?: string;
}> = ({ id, register, errors, watch, validations, label, classNameCustom }) => {
  const { attributeType } = watch;
  const [selectedValue, setSelectedValue] = useState<string>("");

  useEffect(() => {
    attributeType && setSelectedValue(attributeType);
  }, [attributeType]);

  return (
    <Select
      id={id}
      value={selectedValue}
      labelText={label}
      {...register(id, validations)}
      {...errors}
      className={classNameCustom}
    >
      <SelectItem disabled hidden value="" text="Select Atribute" />
      {attributeData?.map((c, i) => (
        <SelectItem key={i} value={c.value} text={c.name} />
      ))}
    </Select>
  );
};

export default SelectAtributeType;
