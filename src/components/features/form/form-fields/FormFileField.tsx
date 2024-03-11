import { FunctionComponent, ReactElement } from "react";
import { UseFormSetValue } from "react-hook-form";
import { IFormImageFile } from "@/shared/types";
import { FileInput } from "@/components/ui";

const FormFileField: FunctionComponent<{
  setValue: UseFormSetValue<any>;
  data: IFormImageFile;
}> = ({ setValue, data }): ReactElement => {
  const { id, type, label, description, placeholder, previewFile } =
    data as IFormImageFile;
  return (
    <div className="form__row" key={id}>
      <FileInput
        id={id}
        description={description}
        labelText={label}
        placeholder={placeholder}
        setValue={setValue}
        type={type}
        previewFile={previewFile}
      />
    </div>
  );
};

export default FormFileField;
