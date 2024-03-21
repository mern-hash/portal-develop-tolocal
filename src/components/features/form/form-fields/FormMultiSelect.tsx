import { IFormMultiSelect } from "@/shared/types/IForm";
import { MultiSelect } from "carbon-components-react";
import { useState } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

type ItemType = {
  id: string;
  label: string;
};

type ItemsType = ItemType[];

const FormMultiSelect = ({
  data: { id, value, label, placeholder, validations, errors },
  setValue,
  register,
}: {
  data: IFormMultiSelect;
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
}) => {
  const [selectedItems, setSelectedItems] = useState<ItemsType>([]);
  const generateItems = (value: string[] | null) => {
    return value && value.length > 0
      ? value.map((item) => ({ id: item, label: item }))
      : [];
  };

  const handleChange = (selectedItems: ItemsType) => {
    setValue(
      id,
      selectedItems
        .map((item) => {
          return item.label;
        })
        .toString()
    );
    setSelectedItems(selectedItems);
  };

  const generateLabel = () => {
    if (selectedItems.length > 0) {
      return selectedItems
        .map((item) => {
          return item.label;
        })
        .toString();
    } else {
      return placeholder;
    }
  };

  return (
    <MultiSelect
      id="example-multi-select"
      items={generateItems(value)}
      itemToString={(item) => (item ? item.label : "")}
      label={generateLabel()}
      {...register(id, {
        ...validations,
      })}
      onChange={({ selectedItems }) => handleChange(selectedItems)}
      selectedItems={selectedItems}
      titleText={label}
      useTitleInItem={false}
      invalid={errors ? errors.invalid : false}
      invalidText={errors ? errors.invalidText : ""}
    />
  );
};

export default FormMultiSelect;
