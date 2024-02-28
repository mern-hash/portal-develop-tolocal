import { Form as CForm, Stack, FormItem } from "carbon-components-react";
import FormTextField from "./form-fields/FormTextField";
import { IButton, IFormFieldsData, IFormTextInput } from "@/shared/types";
import { Button } from "@/components/ui";

const FormForCredentials = ({
  onSubmit,
  trigger,
  formFields,
  register,
  formButtons,
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
  return (
    <CForm onSubmit={(evt) => submitForm(evt)} className="form">
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

export default FormForCredentials;
