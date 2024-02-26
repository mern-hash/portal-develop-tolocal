// Core
import { FunctionComponent, ReactElement, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

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

function findDuplicateIds(arr) {
  const idMap = new Map();

  arr.forEach((element, index) => {
    const idKey = element.id;
    if (!idMap.has(idKey)) {
      idMap.set(idKey, [index]);
    } else {
      idMap.get(idKey).push(index);
    }
  });

  const duplicates: any[] = [];
  idMap.forEach((indices, id) => {
    if (indices.length > 1) {
      duplicates.push({ indices });
    }
  });

  return duplicates;
}

const blankCustomTemplate = {
  attributeType: "",
  name: "",
  description: "",
  require: false,
  id: "",
};

const TemplatesForm: FunctionComponent = (): ReactElement => {
  // Fetched data, used to compare freshly edited input fields to see which
  // one needs to get patched

  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    trigger,
    control,
  } = useForm<TemplateForm>({
    mode: "onBlur",
    defaultValues: {},
  });
  // setError("attributeType");
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "customField", // unique name for your Field Array
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
    const duplicateId = findDuplicateIds(data.customField);
    if (duplicateId.length > 0) {
      duplicateId.forEach(({ indices }) => {
        indices.forEach((element) => {
          setError(`customField.${element}.id`, {
            type: "custom",
            message: "All field should have unique name!",
          });
        });
      });
      return;
    }
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
  console.log(errors);
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
            {fields.map((item, i) => (
              <CustomForm
                key={item.id}
                indexOfField={i}
                remove={remove}
                register={register}
                cancelForm={cancelForm}
                watch={watch}
                errors={errors?.customField && errors?.customField[i]}
                setError={setError}
              />
            ))}

            <Button
              clickFn={() => {
                append(blankCustomTemplate);
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
