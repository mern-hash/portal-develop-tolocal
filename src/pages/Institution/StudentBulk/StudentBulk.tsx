//SECTION - Imports
import {
  FunctionComponent,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "../institution.scss";
import { Helmet } from "react-helmet-async";
import { useOutletContext, useNavigate } from "react-router-dom";
//ANCHOR - Components
import { Form } from "@/components/features";
import { ToastNotification } from "@/components/ui";
//ANCHOR - API
import { getBulkTemplate, postBulkTemplate } from "@/api";
import { useForm } from "react-hook-form";
import { QueryClient, useMutation } from "@tanstack/react-query";
//ANCHOR - Util
import { studentFormHLC } from "@/shared/outlet-context/outletContext";
import { IButton } from "@/shared/types";
import { ContextData, ContextTypes } from "@/shared/types/ContextTypes";
import { toastNotification } from "@/shared/table-data/tableMethods";
import {
  TOAST_NOTIFICATION_KINDS,
  TOAST_NOTIFICATION_TITLES,
} from "@/core/constants";
import { successMessages } from "@/shared/successText";
//!SECTION

const StudentBulk: FunctionComponent = (): ReactElement => {
  const { updateContext } = useOutletContext<{
    updateContext: (state: string, data: ContextData) => void;
  }>();

  const [errorMessage, setErrorMessage] = useState<string>();

  const navigate = useNavigate();

  //ANCHOR - RHF Setup
  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm<any>({
    mode: "onTouched",
    defaultValues: {},
  });

  const linkRef = useRef<any>();
  const queryClient = new QueryClient();

  //ANCHOR - useEffect setup
  useEffect(() => {
    window.scrollTo(0, 0);
    return updateContext(ContextTypes.HLC, studentFormHLC("Add students"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //ANCHOR - formButtons
  const formButtons: IButton[] = [
    {
      label: "Cancel",
      type: "button",
      kind: "secondary",
      clickFn: () => navigate("/institution/students"),
      aria_label: "cancel",
    },
    {
      label: "Add students",
      type: "submit",
      kind: "primary",
      icon: "add",
      aria_label: "submit",
    },
  ];

  //ANCHOR - Submit
  const onSubmit = (data) => {
    reset();

    if (loading || data.csv?.type !== "text/csv") return;

    const formData = new FormData();
    formData.append("csv", data.csv);

    return postTemplate.mutate(formData);
  };

  //ANCHOR - renderErrorNotification()
  const renderErrorNotification = () => {
    if (!isSubmitted || !errorMessage) return null;

    return (
      <ToastNotification
        title="Error"
        type="inline"
        kind="error"
        subtitle={errorMessage}
        full
        customClass="institution-students__error"
      />
    );
  };

  //SECTION - API
  //ANCHOR - csv template
  const fetchTemplate = useMutation(() => getBulkTemplate(), {
    onSuccess: (data) => {
      const href = window.URL.createObjectURL(data);
      const a = linkRef.current;
      a.download = "template.csv";
      a.href = href;
      a.click();
      a.href = "";
    },
  });

  const getRowRanges = (objects) => {
    // basically iterates over array of objects and groups rows with errors
    // returns string like "2-3, 5-6, 8, 9-10"
    return (
      objects
        // Extract all "row" properties from error objects
        .map(({ row }) => row)
        // Sort them ascendingly (received array is sorted by error priority - e.g. email > date)
        .sort((a, b) => a - b)
        // Initialize empty array that will be filled with so-called ranges
        .reduce((ranges, row, index, array) => {
          // Check if current number is first in array, or not consecutive to the previous one
          if (index === 0 || row - array[index - 1] !== 1) {
            // If so, push number to array
            ranges.push(`${row}`);
          } else if (
            // Check if current number is last in array
            index === array.length - 1 ||
            // or if next number isn't consecutive to current
            array[index + 1] - row !== 1
          ) {
            // If last or nonconsecutive attach it to the last element in ranges array
            // in form of -${row} which leads to [2, 4, 5-9]
            ranges[ranges.length - 1] += `-${row}`;
          }
          // else {... if number gets to here it basically means that it is consecutive and
          // between two numbers, so it doesn't need to be displayed
          return ranges;
        }, [])
        .join(", ")
    );
  };

  const postTemplate = useMutation((data: FormData) => postBulkTemplate(data), {
    onSuccess: (val) => {
      if (val.rejected) {
        if (val.inserted === 0 && val.rejected) {
          setErrorMessage(
            "We couldn’t match the data, please use the template provided below."
          );
        } else {
          setErrorMessage(
            (
              <div className="institution-students__bulk__error">
                The CSV file was only partially uploaded. It appears that the
                following rows in the file failed to upload: <br />
                {getRowRanges(val.rejectedRows)}
              </div>
            ) as unknown as string
          );
        }
      } else {
        toastNotification({
          updateContext,
          title: TOAST_NOTIFICATION_TITLES.SUCCESS,
          kind: TOAST_NOTIFICATION_KINDS.SUCCESS,
          subtitle: successMessages.students_created,
        });
        navigate("/institution/students");
      }
    },
    onError: ({ response }) => {
      setErrorMessage(response.data.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["allStudents"]);
    },
  });

  const loading = useMemo(
    () => fetchTemplate.isLoading || postTemplate.isLoading,
    [fetchTemplate, postTemplate]
  );

  return (
    <>
      <Helmet>
        <title>Add students</title>
      </Helmet>
      <a ref={linkRef} href="/" aria-label="hidden" hidden>
        Download
      </a>
      <Form
        errorNotification={renderErrorNotification()}
        formButtons={formButtons}
        formFields={[
          {
            type: "file-csv",
            id: "csv",
            label: "Bulk upload",
            description: (
              <>
                Please download our{" "}
                <span
                  className="file-input__description__template"
                  onClick={() => fetchTemplate.mutate()}
                >
                  template here
                </span>
                . Add data to it, and then upload it below. We support .csv
                files with comma separated values, and the accepted date format
                pattern is "yyyy-mm-dd".
                <br />
                Keep in mind that updating students will cause the already
                claimed credentials to be invalidated, and new credentials will
                be issued.
              </>
            ),
            placeholder: "Drag and drop files here or click to upload",
            previewFile: watch("csv"),
          },
        ]}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        setValue={setValue}
        trigger={trigger}
      />
    </>
  );
};

export default StudentBulk;
