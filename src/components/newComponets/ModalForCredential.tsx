import { formatSchema } from "@/shared/form-fields/formSchemaFormat";
import { IButton } from "@/shared/types";
import { Modal } from "carbon-components-react";
import React, { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Form } from "../features";
import "./CustomFieldModal.scss";
import { getSingleTemplateFields } from "@/api/template/template";
import { useQuery } from "@tanstack/react-query";

const data = [
  {
    id: "6190932b-7e20-4198-b4a1-693c42e5d532",
    name: "Student",
    createdAt: "2024-03-16T00:57:15.681Z",
    fields: [
      {
        id: "b50d92ac-1a84-4539-a48a-c77fdfcf0c01",
        name: "studentId",
        label: "Student ID",
        placeholder: "Enter Student ID",
        type: "text",
        isOptional: false,
        isClaim: true,
        isSearchable: true,
        isSortable: true,
        isFilterable: false,
        inTable: true,
        validations: {},
      },
      {
        id: "b50d92ac-1a84-4539-a48a-c77fdfcf0c05",
        name: "age",
        label: "Age",
        placeholder: "Enter your age",
        type: "number",
        isOptional: false,
        isClaim: true,
        isSearchable: true,
        isSortable: true,
        isFilterable: false,
        inTable: true,
        validations: {},
      },
      {
        id: "b50d92ac-1a84-4539-a48a-c77fdfcf0c02",
        name: "city",
        label: "City",
        placeholder: "Please select state",
        type: "list",
        value: ["1", "2"],
        isOptional: false,
        isClaim: true,
        isSearchable: true,
        isSortable: true,
        isFilterable: false,
        inTable: true,
        validations: {},
      },
      {
        id: "b50d92ac-1a84-4539-a48a-c77fdfcf0c03",
        name: "success",
        label: "Success",
        placeholder: "Please select country",
        type: "checkbox",
        isOptional: true,
        isClaim: true,
        isSearchable: true,
        isSortable: true,
        isFilterable: false,
        inTable: true,
        validations: {},
      },
      {
        id: "b50d92ac-1a84-4539-a48a-c77fdfcf0c03",
        name: "country",
        label: "Country",
        placeholder: "Please select country",
        type: "dropdown",
        value: ["1", "2"],
        isOptional: false,
        isClaim: true,
        isSearchable: true,
        isSortable: true,
        isFilterable: false,
        inTable: true,
        validations: {},
      },

      {
        id: "a69ffa08-68f3-412e-952a-a12bc8e3f2bc",
        name: "degree",
        label: "Degree",
        placeholder: "Enter degree",
        type: "text",
        isOptional: false,
        isClaim: true,
        isSearchable: true,
        isSortable: true,
        isFilterable: false,
        inTable: true,
        validations: {},
      },
      {
        id: "949e354d-fcaa-42ca-9f0e-a84d2ad7f0c2",
        name: "grade",
        label: "Grade",
        placeholder: "Enter grade",
        type: "text",
        isOptional: false,
        isClaim: true,
        isSearchable: true,
        isSortable: false,
        isFilterable: false,
        inTable: false,
        validations: {},
      },
      {
        id: "6b657559-6c6e-466c-ac75-c6e9654ce7c4",
        name: "subject",
        label: "Subject",
        placeholder: "Enter subject",
        type: "text",
        isOptional: true,
        isClaim: true,
        isSearchable: false,
        isSortable: false,
        isFilterable: false,
        inTable: false,
        validations: {},
      },
      {
        id: "25cd9a1c-0c1c-49f0-8fa0-1f60a2381438",
        name: "subjectDescription",
        label: "Subject description",
        placeholder: "Enter subject description",
        type: "text",
        isOptional: true,
        isClaim: true,
        isSearchable: false,
        isSortable: false,
        isFilterable: false,
        inTable: false,
        validations: {},
      },
      {
        id: "6b3c0019-208c-49a1-a473-4618b300a24f",
        name: "completionDate",
        label: "Date of completion",
        placeholder: "Enter date of completion",
        type: "timestamp",
        isOptional: false,
        isClaim: true,
        isSearchable: true,
        isSortable: true,
        isFilterable: true,
        inTable: true,
        validations: {
          isBefore: {
            value: "now",
            message: "Date of completion cannot be greater than today’s date.",
          },
        },
      },
    ],
  },
];

const formButtonsBase = [
  {
    label: "Cancel",
    type: "button",
    kind: "secondary",
    aria_label: "cancel",
  },
  {
    label: "Submit",
    type: "submit",
    kind: "primary",
    aria_label: "submit",
  },
];

type props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  templateId: string | undefined;
  templateName: string | undefined;
  setFormValue: React.Dispatch<
    React.SetStateAction<
      | {
          id: string;
          name: string;
          value: any;
        }[]
      | null
    >
  >;
};

const ModalForCredential = ({
  open,
  setOpen,
  setFormValue,
  templateId,
  templateName,
}: props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
    trigger,
  } = useForm({
    mode: "onTouched",
    defaultValues: {},
  });

  const searchTemplateFields = useQuery(
    ["templates", { id: templateId }],
    getSingleTemplateFields,
    {
      enabled: templateId && templateId.length > 0 ? true : false,
    }
  );

  const formFields = formatSchema(
    searchTemplateFields?.data
      ? JSON.parse(JSON.stringify([{ fields: searchTemplateFields?.data }]))
      : { fields: [] },
    errors
  );

  const onCancel = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const formButtons = useMemo(
    () =>
      formButtonsBase.map((button) => ({
        ...button,
        clickFn: button.label === "Cancel" ? onCancel : undefined,
      })),
    [onCancel]
  );

  const onSubmit = useCallback(
    (submitData) => {
      const submittedFields = searchTemplateFields?.data.map((item) => ({
        id: item.id,
        name: item.name,
        value: submitData?.fields[item.name],
      }));

      setFormValue(submittedFields);
      onCancel();
    },
    [data, setFormValue, onCancel, searchTemplateFields]
  );

  return (
    <Modal
      open={open}
      modalHeading={templateName}
      onRequestClose={onCancel}
      className="CredentialsTemplateModal__wrapper"
      passiveModal
    >
      <Form
        errorNotification={<></>}
        formButtons={formButtons as IButton[]}
        formFields={formFields}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        setValue={setValue}
        trigger={trigger}
        setError={setError}
        clearErrors={clearErrors}
      />
    </Modal>
  );
};

export default React.memo(ModalForCredential);
