// Core
import { FunctionComponent, ReactElement, useState } from "react";
import "./fileInput.scss";
import { UseFormSetValue } from "react-hook-form";
// Carbon
import {
  FormItem,
  FileUploaderDropContainer,
  FileUploaderItem,
} from "carbon-components-react";
// Util
import { ACCEPT_IMG_TYPES, ACCEPT_CSV_TYPES } from "@/core/constants";
import { IFile, IInstitutionForm, IStudentForm } from "@/shared/types";
import { errorMessages } from "@/shared/errorText";

import { TFieldID } from "@/shared/types/IForm";

const FileInput: FunctionComponent<{
  id: string;
  setValue: UseFormSetValue<IInstitutionForm | IStudentForm>;
  type: string;
  labelText: string;
  description?: string;
  placeholder?: string;
  previewFile?: string;
}> = ({
  id,
  setValue,
  type,
  labelText,
  description,
  placeholder,
  previewFile,
}): ReactElement => {
  const [uploadedFilePreview, setUploadedFilePreview] = useState<IFile | null>(
    null
  );

  /**
   * Check if uploaded file is of required type, size, etc.
   */
  const invalidFileUploaded = ():
    | { status: boolean; message?: string }
    | undefined => {
    if (!uploadedFilePreview) return { status: false };

    // Image upload
    if (type === "file-image") {
      // Check size
      if (uploadedFilePreview?.size! / 1000 > 500) {
        return {
          status: true,
          message: errorMessages.img_size,
        };
      }
      // Check type
      if (!ACCEPT_IMG_TYPES.includes(uploadedFilePreview?.type!)) {
        return {
          status: true,
          message: errorMessages.img_type,
        };
      }
    }

    if (type === "file-csv") {
      if (uploadedFilePreview?.type !== "text/csv") {
        return {
          status: true,
          message: errorMessages.csv_type,
        };
      }
    }
  };

  const configAcceptTypes = () => {
    if (type === "file-image") {
      return ACCEPT_IMG_TYPES;
    }

    if (type === "file-csv") {
      return ACCEPT_CSV_TYPES;
    }
  };

  const addFile = (id, file) => {
    setUploadedFilePreview(file);
    setValue(id, file);
  };

  return (
    <FormItem className="file-input">
      <p className="cds--file--label">{labelText}</p>
      {description ? (
        <p className="file-input__description cds--label--description">
          {description}
        </p>
      ) : undefined}
      <FileUploaderDropContainer
        accept={configAcceptTypes()}
        labelText={placeholder}
        multiple={false}
        onAddFiles={(e) => {
          e.type === "change" && addFile(id, e.target?.files?.[0]);
          e.type === "drop" && addFile(id, e.dataTransfer?.files?.[0]);
        }}
      />
      {/* New uploaded file */}
      {uploadedFilePreview ? (
        <FileUploaderItem
          errorBody={invalidFileUploaded()?.message}
          errorSubject="Invalid file uploaded"
          iconDescription="Delete file"
          invalid={invalidFileUploaded()?.status}
          name={uploadedFilePreview?.name}
          status="edit"
          size="lg"
          onDelete={() => {
            setUploadedFilePreview(null);
            setValue(id as TFieldID, null);
          }}
        />
      ) : null}
      {/* Submitted file for edit */}
      {previewFile && !uploadedFilePreview ? (
        <div className="file-input__preview-edit">
          <img
            className="file-input__preview-img"
            style={{ maxWidth: "140px" }}
            src={previewFile}
            alt="uplaoded file"
          />
          <FileUploaderItem
            iconDescription="Delete file"
            name={previewFile}
            status="edit"
            size="lg"
            onDelete={() => {
              setUploadedFilePreview(null);
              setValue(id as TFieldID, null);
            }}
          />
        </div>
      ) : null}
    </FormItem>
  );
};

export default FileInput;
