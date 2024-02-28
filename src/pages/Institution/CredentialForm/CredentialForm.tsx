//SECTION - Imports
//ANCHOR - Core
import { FunctionComponent, useEffect, useState } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
//ANCHOR - Api
import { useQuery } from "@tanstack/react-query";
import { getSingleStudent } from "@/api";
//ANCHOR - Components
import { Button } from "@/components/ui";
//ANCHOR - Util

import { studentFormHLC } from "@/shared/outlet-context/outletContext";

//ANCHOR - Types
import { IButton, IFormTextInput } from "@/shared/types";
import { ContextData, ContextTypes } from "@/shared/types/ContextTypes";

import { errorMessages, invalidInput } from "@/shared/errorText";
import { ADD_STUDENT_BUTTON_TEXT, SAVE_CHANGES } from "@/core/constants";
import { Form as CForm, Stack } from "carbon-components-react";
import FormTextField from "@/components/features/form/form-fields/FormTextField";
import FormLabel from "@/components/ui/FormLabel/FormLabel";
import { Search } from "@carbon/react";
import { ICredentialForm } from "@/shared/types/IForm";
import ListItems from "@/components/newComponets/ListItems";

//!SECTION
const dropdownItems = [
  { name: "John Doe", email: "johndoe@example.com" },
  { name: "Jane Smith", email: "janesmith@example.com" },
  { name: "Alex Johnson", email: "alexj@example.com" },
];

function filterItems(
  items,
  searchString
): {
  name: string;
  email: string;
}[] {
  const lowerCaseSearchString = searchString.toLowerCase();

  return items.filter((item) => {
    return (
      item.name.toLowerCase().includes(lowerCaseSearchString) ||
      item.email.toLowerCase().includes(lowerCaseSearchString)
    );
  });
}
const CredentialForm: FunctionComponent = () => {
  const { updateContext } = useOutletContext<{
    updateContext: (state: string, data: ContextData) => void;
  }>();
  const [showDropdown, setShowDropdown] = useState({
    student: false,
    template: false,
  });
  const [studentList, setStudentList] = useState<
    {
      name: string;
      email: string;
    }[]
  >([]);
  const [templateList, setTemplateList] = useState<
    {
      name: string;
      email: string;
    }[]
  >([]);

  const { id } = useParams();
  const navigate = useNavigate();

  //ANCHOR - renderErrorNotification()

  //ANCHOR - RHF Setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<ICredentialForm>({
    mode: "onTouched",
    defaultValues: {},
  });

  //ANCHOR - setFormDefaultValues

  //ANCHOR - Submit
  const onSubmit = (data) => {
    console.log(data);
  };

  //SECTION - API
  //ANCHOR - getSingleStudent
  const singleStudent = useQuery(["singleStudent", { id }], getSingleStudent, {
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  //ANCHOR - useEffect setup
  useEffect(() => {
    window.scrollTo(0, 0);

    // if (id && singleStudent.data) {
    //   setFormDefaultValues(singleStudent.data);
    //   return;
    // }
    // If there is an ID in url, while waiting the data to fill in the form
    // in header display "Edit" title instead of "Add a Student"
    // Once data is fetched it will call setFormDefaultValues which updates header
    if (id) {
      updateContext(ContextTypes.HLC, studentFormHLC("Edit"));
      return;
    }

    updateContext(ContextTypes.HLC, studentFormHLC(ADD_STUDENT_BUTTON_TEXT));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleStudent.data]);

  const cancelForm = (evt, id) => {
    evt.relatedTarget?.getAttribute("aria-label") === "cancel"
      ? evt.relatedTarget.click()
      : trigger(id);
  };

  //ANCHOR - formButtons
  const formButtons: IButton[] = [
    {
      label: "Cancel",
      type: "button",
      kind: "secondary",
      clickFn: () => navigate("/institution/credentials"),
      aria_label: "cancel",
    },
    {
      label: id ? SAVE_CHANGES : ADD_STUDENT_BUTTON_TEXT,
      type: "submit",
      kind: "primary",
      icon: id ? undefined : "add",
      aria_label: "submit",
      // clickFn: (e) => {
      //   if (!isDirty) return;
      //   if (id) {
      //     validateThatDataIsUpdated(e);
      //   }
      // },
    },
  ];
  const handleBlurForStudent = () => {
    // Hides the dropdown when the user stops interacting with the input
    setShowDropdown((prev) => ({ ...prev, student: false }));
  };

  const handleBlurForTemplate = () => {
    // Hides the dropdown when the user stops interacting with the input
    setShowDropdown((prev) => ({ ...prev, template: false }));
  };

  useEffect(() => {
    if (watch("studentName").length > 0) {
      const filtered = filterItems(dropdownItems, watch("studentName"));
      setStudentList(filtered);
      setShowDropdown((prev) => ({ ...prev, student: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("studentName")]);

  useEffect(() => {
    if (watch("templateName").length > 0) {
      const filtered = filterItems(dropdownItems, watch("templateName"));
      setTemplateList(filtered);
      setShowDropdown((prev) => ({ ...prev, template: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("templateName")]);

  return (
    <>
      <Helmet>
        <title>{id ? "Edit Credential" : "Add Credential"}</title>
      </Helmet>
      {/* {loading && <Loading />} */}

      <CForm onSubmit={handleSubmit(onSubmit)} className="form">
        <Stack gap={1} className="form__stack">
          <div className="form__row">
            <FormTextField
              register={register}
              data={
                {
                  type: "text",
                  id: "name",
                  label: "Credential name",
                  placeholder: "How would you like to name this credential",
                  validations: {
                    required: errorMessages.required,
                    maxLength: {
                      value: 1000,
                      message: "",
                    },
                    minLength: {
                      value: 2,
                      message: "",
                    },
                  },
                  errors: invalidInput(errors, "name"),
                  isClaim: true,
                } as unknown as IFormTextInput
              }
              cancelForm={cancelForm}
            />
            <FormLabel
              label="Link to a student"
              description="Search and select the student you want this credential to be linked to"
            />
            <Search
              labelText=""
              {...register("studentName")}
              onClear={() => {}}
              placeholder="Search for student name or email"
              onBlur={handleBlurForStudent}
            />
            {showDropdown.student &&
              studentList.map((item, index) => (
                <ListItems
                  key={index}
                  details={item?.email}
                  name={item?.name}
                />
              ))}
            <FormLabel
              label="Link to a template"
              description="Search and select the template you want this credential to be linked to"
            />
            <Search
              labelText="dfsdf"
              {...register("templateName")}
              onClear={() => {}}
              placeholder="Search for template name"
              onBlur={handleBlurForTemplate}
            />
            {showDropdown.template &&
              templateList.map((item, index) => (
                <ListItems key={index} details={""} name={item?.name} />
              ))}
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

export default CredentialForm;
