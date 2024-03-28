import { FunctionComponent, ReactElement } from "react";
import { DatePicker, DatePickerInput } from "carbon-components-react";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import { format } from "date-fns";
import { errorMessages } from "@/shared/errorText";

const FormDateField: FunctionComponent<{
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  trigger: UseFormTrigger<any>;
  data: any;
  setError: any;
  clearErrors: any;
}> = ({
  register,
  setValue,
  trigger,
  data,
  setError,
  clearErrors,
}): ReactElement => {
  const { id, label, validations, errors } = data as any;

  const onHandleChange = (e) => {
    if (e[0]) {
      setValue(id, format(e[0], "yyyy-MM-dd"));
      if (+e[0] > +new Date()) {
        setError(id, {
          type: "custom",
          message: errorMessages.max_date,
        });
      } else {
        clearErrors(id);
      }
    } else {
      setValue(id, "");
      trigger(id);
    }
  };

  return (
    <DatePicker
      datePickerType="single"
      {...register(id, {
        ...validations,
        validate: (i) => {
          if (i === "") return true;
          if (+new Date(i) <= +new Date()) return true;
          return errorMessages.max_date;
        },
      })}
      onChange={onHandleChange}
      dateFormat="Y-m-d"
    >
      <DatePickerInput
        id={id}
        labelText={label}
        placeholder="yyyy-mm-dd"
        size="md"
        pattern={null}
        {...errors}
      />
    </DatePicker>
  );
};

export default FormDateField;
