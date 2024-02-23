//SECTION - Imports
//ANCHOR - Core
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
//ANCHOR - Api
import { useMutation, useQuery, QueryClient } from "@tanstack/react-query";
import { getAccountData, editAccountData } from "@/api";
import { AxiosError } from "axios";
//ANCHOR - Components
import { ToastNotification } from "@/components/ui";
import { Form } from "@/components/features";
import { Loading } from "carbon-components-react";

//ANCHOR - Util
import {
  city,
  country,
  LOCATION_ARRAY,
  logo,
  TOAST_NOTIFICATION_KINDS,
  TOAST_NOTIFICATION_TITLES,
} from "@/core/constants";
import { myAccountFormFields } from "@/shared/form-fields/myAccountFormFields";
import { IButton, IMyAccount } from "@/shared/types";
import { ContextData } from "@/shared/types/ContextTypes";
import { toastNotification } from "@/shared/table-data/tableMethods";
import { errorMessages } from "@/shared/errorText";
import { successMessages } from "@/shared/successText";
//!SECTION

const MyAccount: FunctionComponent = (): ReactElement => {
  const { updateContext } = useOutletContext<{
    updateContext: (state: string, data: ContextData) => void;
  }>();

  const [defaultEditData, setDefaultEditData] = useState<any>();

  const queryClient = new QueryClient();

  //ANCHOR - RHF setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
    setError,
    watch,
    trigger,
  } = useForm<IMyAccount>({
    mode: "onTouched",
    defaultValues: {},
  });

  //SECTION - api
  //ANCHOR - getAccountData
  const institutionData = useQuery(["my-account"], getAccountData, {
    refetchOnWindowFocus: false,
  });

  //ANCHOR - editAccountData
  const editInstitutionData = useMutation(
    (data: FormData) => editAccountData(data),
    {
      onSuccess: () => {
        toastNotification({
          updateContext,
          title: TOAST_NOTIFICATION_TITLES.SUCCESS,
          kind: TOAST_NOTIFICATION_KINDS.INFO,
          subtitle: successMessages.information_edited,
        });
        queryClient.invalidateQueries(["my-account"]);
      },
      onError: ({ response }: AxiosError) => {
        toastNotification({
          updateContext,
          title: TOAST_NOTIFICATION_TITLES.ERROR,
          kind: TOAST_NOTIFICATION_KINDS.ERROR,
          subtitle: errorMessages.try_again,
        });
        if (!response?.data) return;
        const errRes = response?.data;
        for (let key in errRes) {
          //@ts-ignore
          setError(key, { type: "custom", message: errRes[key] });
        }
      },
    }
  );
  //!SECTION

  //ANCHOR - context setup
  useEffect(() => {
    if (institutionData.data) {
      setDefaultEditData(institutionData.data);
      Object.entries(institutionData.data).forEach(([name, value]: any) =>
        setValue(name, value)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institutionData.data]);

  //ANCHOR - renderError
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

  //ANCHOR - formButtons
  const formButtons: IButton[] = [
    {
      label: "Save changes",
      type: "submit",
      kind: "primary",
      aria_label: "submit",
    },
  ];

  //ANCHOR - onSubmit
  const onSubmit = (data) => {
    const formData = new FormData();

    for (let key in data) {
      // still need to send both city, country and postalcode even if only 1 is edited
      if (LOCATION_ARRAY.includes(key)) {
        LOCATION_ARRAY.forEach((i) => {
          formData.delete(i);
          formData.append(i, data[i]);
        });
      }

      if (defaultEditData[key] !== data[key] && !LOCATION_ARRAY.includes(key)) {
        formData.append(key, data[key]);
      }
    }
    return editInstitutionData.mutate(formData);
  };

  //ANCHOR - return()
  return (
    <>
      {editInstitutionData.isLoading && <Loading />}
      <Form
        errorNotification={renderErrorNotification()}
        formButtons={formButtons}
        formFields={myAccountFormFields(register, errors, {
          country: watch(country),
          city: watch(city),
          logo: watch(logo),
        })}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        setValue={setValue}
        trigger={trigger}
      />
    </>
  );
};

export default MyAccount;
