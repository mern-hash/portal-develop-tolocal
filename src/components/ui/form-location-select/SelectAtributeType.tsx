import { FunctionComponent, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UseFormRegister } from "react-hook-form";
import { getCountries } from "@/api";
import { Select, SelectItem } from "carbon-components-react";
import { LocationContext } from "@/shared/context/LocationContext";

const attributeData = [
  { name: "text", value: "text" },
  { name: "file-image", value: "file-image" },
  { name: "file-csv", value: "file-csv" },
  { name: "select", value: "select" },
  { name: "password", value: "password" },
  { name: "timestamp", value: "timestamp" },
];

const SelectAtributeType: FunctionComponent<{
  id: string;
  register: UseFormRegister<any>;
  errors: { message: string; ref: JSX.Element; type: string } | undefined;
  watch?: any;
}> = ({ id, register, errors, watch }) => {
  const { attributeType } = watch;

  const [selectedValue, setSelectedValue] = useState<string>("");

  useEffect(() => {
    attributeType && setSelectedValue(attributeType);
  }, [attributeType]);

  return (
    <Select
      id={id}
      value={selectedValue}
      labelText={`Select Attribute Type`}
      {...register(id, {
        required: "Required field",
      })}
      {...errors}
    >
      <SelectItem disabled hidden value="" text="Select Atribute" />
      {attributeData?.map((c, i) => (
        <SelectItem key={i} value={c.value} text={c.name} />
      ))}
    </Select>
  );
};

export default SelectAtributeType;
