import { FunctionComponent, useEffect, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { Select, SelectItem } from "carbon-components-react";

const attributeData = [
  { name: "Text", value: "text" },
  { name: "Number", value: "number" },
  { name: "Checkbox", value: "checkbox" },
  { name: "Dropdown ", value: "dropdown" },
  { name: "Date", value: "date" },
  { name: "List ", value: "list" },
];

const SelectAttributeType: FunctionComponent<{
  id: string;
  register: UseFormRegister<any>;
  errors: { message: string; ref: JSX.Element; type: string } | undefined;
  watch?: any;
  validations: any;
  label: string;
  classNameCustom?: string;
  disabled?: boolean;
}> = ({
  id,
  register,
  errors,
  watch,
  validations,
  label,
  classNameCustom,
  disabled,
}) => {
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
      disabled={disabled ? disabled : false}
    >
      <SelectItem disabled hidden value="" text="Select Atribute" />
      {attributeData?.map((c, i) => (
        <SelectItem key={i} value={c.value} text={c.name} />
      ))}
    </Select>
  );
};

export default SelectAttributeType;
