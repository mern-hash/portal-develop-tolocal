// Core
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
// Api
import { useQueryClient } from "@tanstack/react-query";

// Components
import { Button } from "@/components/ui";
// Util
import { IButton, IFormTextInput } from "@/shared/types";
import { ContextTypes, ContextData } from "@/shared/types/ContextTypes";
import { templateFormFields } from "@/shared/form-fields/formFields";
import { ADMIN_HEADING_LINKS, ADMIN_HEADING_LOGOLINK } from "@/core/constants";

import { Form as CForm, Stack } from "carbon-components-react";
import FormTextField from "@/components/features/form/form-fields/FormTextField";
import { TemplateForm } from "@/shared/types/IForm";
import CustomForm from "@/components/ui/customForm/CustomForm";

const blankCustomTemplate = {
  attributeType: "",
  name: "",
  desceription: "",
  require: false,
  id: "",
  handleSubmit: () => {},
};

const TemplatesForm: FunctionComponent = (): ReactElement => {
  // Fetched data, used to compare freshly edited input fields to see which
  // one needs to get patched
  const [customFieldArr, setCustomFieldArr] = useState<any>([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors, isSubmitted },
    setValue,
    setError,
    watch,
    trigger,
  } = useForm<TemplateForm>({
    mode: "onTouched",
    defaultValues: {},
  });
  // <Outlet /> context to update HeaderLayout data
  const { updateContext } = useOutletContext<{
    updateContext: (state: string, data: ContextData) => void;
  }>();

  // Initial heading setup
  const updateHeadingContext = (title: string) => {
    updateContext(ContextTypes.HLC, {
      logoLink: ADMIN_HEADING_LOGOLINK,
      links: ADMIN_HEADING_LINKS,
      title,
    });
  };

  useEffect(() => {
    updateHeadingContext("Build a template");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    console.log(data);
    console.log(
      await customFieldArr[0].handleSubmit((data) => {
        console.log(data);
      })
    );

    return;
  };

  const formButtons: IButton[] = [
    {
      label: "Cancel",
      type: "button",
      kind: "secondary",
      clickFn: () => navigate("/admin/template"),
      aria_label: "cancel",
    },
    {
      label: id ? "Save changes" : "Create institution",
      type: "submit",
      kind: "primary",
      icon: id ? undefined : "add",
      aria_label: "submit",
    },
  ];

  const cancelForm = (evt, id) => {
    evt.relatedTarget?.getAttribute("aria-label") === "cancel"
      ? evt.relatedTarget.click()
      : trigger(id);
  };

  return (
    <>
      <Helmet>
        <title>{id ? "Update" : "Create"}</title>
      </Helmet>

      <CForm onSubmit={handleSubmit(onSubmit)} className="form">
        <Stack gap={7} className="form__stack">
          <FormTextField
            register={register}
            data={
              templateFormFields(register, errors, watch)[0] as IFormTextInput
            }
            cancelForm={cancelForm}
          />
          <FormTextField
            register={register}
            data={
              templateFormFields(register, errors, watch)[1] as IFormTextInput
            }
            cancelForm={cancelForm}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {customFieldArr &&
              customFieldArr.map((item, i) => (
                <CustomForm
                  key={i}
                  setCustomFieldArr={setCustomFieldArr}
                  indexOfField={i}
                  tamplate={item}
                />
              ))}

            <Button
              clickFn={() => {
                setCustomFieldArr([...customFieldArr, blankCustomTemplate]);
              }}
              label="Add field"
              type="button"
              aria_label="add-button"
              kind="secondary"
            />
          </div>
          <div className="form__row form__row__buttons">
            {formButtons.map((button: IButton, i: number) => (
              <Button key={i} {...button} />
            ))}
          </div>
        </Stack>
      </CForm>
    </>
  );
};

export default TemplatesForm;
