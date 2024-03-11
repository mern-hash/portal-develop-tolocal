import { Form as CForm, Stack, ContainedList } from "carbon-components-react";
import FormTextField from "./form-fields/FormTextField";
import { IButton, IFormTextInput } from "@/shared/types";
import { Button } from "@/components/ui";
import { FunctionComponent } from "react";
import { IFormCredentialsComponent } from "@/shared/types/IForm";
import FormLabel from "@/components/ui/FormLabel/FormLabel";
import { Search } from "@carbon/react";
import ListItems from "@/components/newComponets/ListItems";

const FormForCredentials: FunctionComponent<IFormCredentialsComponent> = ({
  trigger,
  formFields,
  onSubmit,
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
    <CForm
      onSubmit={(evt) => submitForm(evt)}
      className="form CredentialForm__wrapper"
    >
      <Stack gap={1} className="form__stack">
        <div className="form__row">
          {formFields.map((row: any, i: number) => {
            switch (row.type) {
              case "text":
                return (
                  <div className="CredentialForm__input-wrapper">
                    <FormTextField
                      register={register}
                      data={row as IFormTextInput}
                      cancelForm={cancelForm}
                    />
                  </div>
                );
              case "search":
                return (
                  <div className="CredentialForm__search-wrapper">
                    <FormLabel
                      label={row.label}
                      description={row.description}
                    />
                    <div className="CredentialForm__search-input-wrapper">
                      <Search
                        labelText={row.label}
                        {...register(row.id)}
                        placeholder={row.placeholder}
                        onBlur={() => row.onBlur(row.id)}
                        onChange={(e) => {
                          row?.onSearchChange?.(e, row.id);
                        }}
                      />
                      {row.showDropdown && row.list && (
                        <ContainedList className="search-list-wrapper">
                          {row.showDropdown && row.list.length > 0 ? (
                            row.list.map((item, index) => (
                              <ListItems
                                key={index}
                                name={item?.name}
                                onClickFunc={(item) => {
                                  row?.onClick?.(row.id, item);
                                }}
                                item={item}
                              />
                            ))
                          ) : (
                            <ListItems name="data not found" />
                          )}
                        </ContainedList>
                      )}
                    </div>
                  </div>
                );
              default:
                return undefined;
            }
          })}
        </div>
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
