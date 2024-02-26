import { FunctionComponent, ReactElement } from "react";
import { UseFormRegister } from "react-hook-form";
import { SelectCity, SelectCountry, SelectInput } from "@/components/ui";
import { IFormSelectInput } from "@/shared/types";
import SelectAtributeType from "@/components/ui/form-location-select/SelectAtributeType";

const FormSelectField: FunctionComponent<{
  register: UseFormRegister<any>;
  data: IFormSelectInput;
}> = ({ register, data }): ReactElement => {
  const { id, label, placeholder, validations, errors, items, watch } =
    data as IFormSelectInput;
  const locationProps = { id, register, errors, watch };

  if (id === "country") return <SelectCountry key={id} {...locationProps} />;
  if (id === "city") return <SelectCity key={id} {...locationProps} />;
  if (id.includes("attributeType")) {
    return (
      <SelectAtributeType
        key={id}
        {...locationProps}
        validations={validations}
      />
    );
  }

  return (
    <SelectInput
      errors={errors}
      id={id}
      items={items}
      label={label}
      key={id}
      placeholder={placeholder}
      register={register}
      validations={validations}
    />
  );
};

export default FormSelectField;
