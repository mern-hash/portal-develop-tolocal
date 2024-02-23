import { FunctionComponent, ReactElement } from "react";
import { Select, SelectItem } from "carbon-components-react";
import { ISelectInput } from "@/shared/types";

/**
 * @description Select one option from the array passed to this component
 * @link https://github.com/weareneopix/certie-fe/blob/66b60ec/src/components/ui/select-input/SelectInput.tsx#L1
 *
 * @interface ```tsx
 * interface ISelectInput {
 *  errors: string | undefined;
 *  id: string;
 *  items: {value: string; text: string}[];
 *  label: string;
 *  register: any;
 *  validations: {[key: string]: any};
 * }
 * ```
 *
 * @example ```tsx
 * <SelectInput
 *  id="id12"
 *  label="Select an option"
 *  placeholder="Placeholder"
 *  validation={{required: "required"}} //same as any react-hook-form validation
 *  errors={errors.id?.type} //same as any react-hook-form error
 *  items={[{value: "opt1", text: "opt1"}]}
 *  register={register} //react-hook-form register
 * />
 * ```
 *
 * @param param0
 * @returns
 */
const SelectInput: FunctionComponent<ISelectInput> = ({
  errors,
  id,
  items,
  label,
  placeholder,
  register,
  validations,
}): ReactElement => {
  return (
    <Select
      id={id}
      defaultValue=""
      labelText={label}
      {...register(id, {
        ...validations,
      })}
      {...errors}
    >
      {/* Carbon way of setting up placeholder */}
      <SelectItem disabled hidden value="" text={placeholder} />
      {items.map(
        ({ value, text }, i): JSX.Element => (
          <SelectItem key={i} value={value} text={text} />
        )
      )}
    </Select>
  );
};

export default SelectInput;
