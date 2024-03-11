//SECTION - Imports
//ANCHOR - Core
import { FunctionComponent, ReactElement } from "react";
import "./password_override.scss";
import { useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
//ANCHOR - Components
import { Form } from "../../../../components/features";
import { ToastNotification } from "../../../../components/ui";
//ANCHOR - Api
import { useMutation } from "@tanstack/react-query";
import { editPassword } from "../../../../api";
//ANCHOR - Util
import { toastNotification } from "../../../../shared/table-data/tableMethods";
import {
  TOAST_NOTIFICATION_KINDS,
  TOAST_NOTIFICATION_TITLES,
} from "../../../../core/constants";
import { ContextData } from "../../../../shared/types/ContextTypes";
import { myPasswordFormFields } from "../../../../shared/form-fields/myAccountFormFields";
import { IButton, IMyPassword } from "../../../../shared/types";
import { errorMessages } from "../../../../shared/errorText";
import { successMessages } from "@/shared/successText";
//!SECTION
const Password: FunctionComponent = (): ReactElement => {
  const { updateContext } = useOutletContext<{
    updateContext: (state: string, data: ContextData) => void;
  }>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
    setError,
    watch,
    trigger,
  } = useForm<IMyPassword>({
    mode: "onTouched",
    defaultValues: {},
  });

  const renderErrorNotification = () => {
    if (!(isSubmitted && !!Object.keys(errors).length)) return null;

    return (
      <ToastNotification
        title="Error"
        type="inline"
        kind="error"
        subtitle={errorMessages.required_notification}
        full
      />
    );
  };

  const formButtons: IButton[] = [
    {
      label: "Save changes",
      type: "submit",
      kind: "primary",
      aria_label: "submit",
    },
  ];

  //ANCHOR - editPasswordData
  const editPasswordData = useMutation((data: FormData) => editPassword(data), {
    onSuccess: () => {
      toastNotification({
        updateContext,
        title: TOAST_NOTIFICATION_TITLES.SUCCESS,
        kind: TOAST_NOTIFICATION_KINDS.INFO,
        subtitle: successMessages.password_edited,
      });
    },
    onError: ({ response }) => {
      toastNotification({
        updateContext,
        title: TOAST_NOTIFICATION_TITLES.ERROR,
        kind: TOAST_NOTIFICATION_KINDS.ERROR,
        subtitle: errorMessages.try_again,
      });

      const errRes = response?.data?.error?.fields;
      if (!errRes) return;
      for (let key in errRes) {
        //@ts-ignore
        setError(key, { type: "custom", message: errRes[key] });
      }
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    for (let key in data) {
      if (data[key]) formData.append(key, data[key]);
    }
    return editPasswordData.mutate(formData);
  };

  return (
    <div className="password_override">
      <Form
        errorNotification={renderErrorNotification()}
        formButtons={formButtons}
        formFields={myPasswordFormFields(errors, {
          newPassword: watch("newPassword"),
        })}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        setValue={setValue}
        trigger={trigger}
      />
    </div>
  );
};

export default Password;
