// Core
import { FunctionComponent } from "react";
import "./form.scss";
// Carbon
import { Form as CForm, Stack } from "carbon-components-react";
import { Button } from "@/components/ui";
// Util
import {
  IButton,
  IFormComponent,
  IFormFieldsData,
  IFormSelectInput,
  IFormTextInput,
} from "@/shared/types";

import FormDateField from "./form-fields/FormDateField";
import FormTextField from "./form-fields/FormTextField";
import FormFileField from "./form-fields/FormFileField";
import FormSelectField from "./form-fields/FormSelectField";
import FormPasswordField from "./form-fields/FormPasswordField";

/**
 * @description Form component that renders passed array of fields (objects)
 * as a full page form
 * @link https://github.com/weareneopix/certie-fe/blob/274689f/src/components/features/form/Form.tsx#L1
 *
 * @interface ```tsx
 * interface IFormComponent {
 * errorNotification: JSX.Element | null // pass the entire <ToastNotification .../> or nothing
 * formButtons: IButton[] // array of IButton components that will be rendered below the form
 * formFields: IFormFieldsData[] // adding new field types will require updating IFormFieldsData
 * onSubmit: () => void // requires one button type="submit" to be passed as formButton
 * register // from react-hook-form
 * setValue // from react-hook-form
 * }
 * ```
 *
 * @FieldExamples
 * @TextInput
 * ```tsx
 * interface IFormTextInput {
 *  errors: { invalid: boolean; invalidText: string } //rhf returns this object, if there is no error
 * // invalid will be false, if there is invalid will be true, so no need to double check the existance
 * // of errors prop
 *  id: string,
 *  labelText: string,
 *  placeholder: string
 *  type: "text", //(required)
 *  validations?: {[key: string]: any} // {required: "Message in case of empty text input error"}
 * }
 * ```
 * @example
 * ```tsx
 * {
 * errors: invalidInput(errors, "institution_name"), //errors - react hook form
 * id: "institution_name",
 * labelText: "Institution Name",
 * placeholder: "Type in institution name",
 * type: "text",
 * validations: { required: "required" },
 * },
 * ```
 *
 * @SelectInput
 * ```tsx
 * interface ISelectInput {
 * errors: { message: string; ref: JSX.Element; type: string } | undefined, // errors.id?.type,
 * id: string,
 * items: { value: string, text: string }[]
 * label: string,
 * placeholder?: string,
 * register: any, // (pass register from react-hook-form)
 * type: string, //("select" required)
 * validations: {[key: string]: any} // {required: "requried"}
 * }
 * ```
 * @example
 * ```tsx
 * {
 * errors: invalidInput(errors, "institution_name"), //custom method for displaying error
 * id: "country",
 * items: [{value: 'option1', text: "Option 1"}],
 * labelText: "Country",
 * placeholder: "Select country",
 * register
 * type: "select",
 * validations: { required: "Required field" },
 * }
 * ```
 *
 * @FileInput (for image file)
 * ```tsx
 * interface IFormImageFile {
 * description: string,
 * emptyFileSubmitted: boolean // toggled only when submit button is clicked without image
 * labelText: string,
 * placeholder: string,
 * setValue: UseFormSetValue<IInstitutionForm>,
 * type: string // for image "file-image"
 * }
 * ```
 *
 * @example
 * ```tsx
 * {
 * type: "file-image",
 * id: "logo",
 * labelText: "Institution logo",
 * description:
 *   "Max file size is 500kB. Supported file types are .jpg and .png.",
 * placeholder: "Drag and drop files here or click to upload",
 * emptyFileSubmitted: emptyFileSubmitted,
 * }
 * ```
 */
const Form: FunctionComponent<IFormComponent> = ({
  register,
  setValue,
  onSubmit,
  formFields,
  formButtons,
  errorNotification,
  trigger,
  setError,
  clearErrors,
}) => {
  const submitForm = (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    return onSubmit();
  };

  const cancelForm = (evt, id) => {
    evt.relatedTarget?.getAttribute("aria-label") === "cancel"
      ? evt.relatedTarget.click()
      : trigger(id);
  };
  console.log(formFields);
  return (
    <CForm onSubmit={(evt) => submitForm(evt)} className="form">
      {errorNotification}

      <Stack gap={7} className="form__stack">
        {formFields.map((row: IFormFieldsData, i: number) => {
          switch (row.type) {
            case "text":
              return (
                <FormTextField
                  key={i}
                  register={register}
                  data={row as IFormTextInput}
                  cancelForm={cancelForm}
                />
              );
            case "file-image":
            case "file-csv":
              return (
                <FormFileField key={i} setValue={setValue} data={row as any} />
              );
            case "select":
              return (
                <FormSelectField
                  key={i}
                  register={register}
                  data={row as IFormSelectInput}
                />
              );
            case "password":
              return (
                <FormPasswordField
                  key={i}
                  register={register}
                  data={row as IFormTextInput}
                  cancelForm={cancelForm}
                />
              );
            case "timestamp":
              return (
                <FormDateField
                  key={i}
                  register={register}
                  setValue={setValue}
                  trigger={trigger}
                  data={row}
                  setError={setError}
                  clearErrors={clearErrors}
                />
              );
            default:
              return undefined;
          }
        })}

        <div className="form__row form__row__buttons">
          {formButtons.map((button: IButton, i: number) => (
            <Button key={i} {...button} />
          ))}
        </div>
      </Stack>
    </CForm>
  );
};

export default Form;
