import { toastNotification } from "@/shared/table-data/tableMethods";
import {
  TOAST_NOTIFICATION_KINDS,
  TOAST_NOTIFICATION_TITLES,
} from "@/core/constants";
import { AxiosError } from "axios";
import { errorMessages } from "../errorText";

export const forCreatingEntry = ({
  navigate,
  updateContext,
  entity,
  setError,
  invalidate,
}: {
  navigate?: () => void;
  updateContext: any;
  entity: string;
  setError: any;
  invalidate: () => void;
}) => ({
  onSuccess: () => {
    navigate?.();
    toastNotification({
      updateContext,
      title: TOAST_NOTIFICATION_TITLES.SUCCESS,
      kind: TOAST_NOTIFICATION_KINDS.SUCCESS,
      subtitle: `${entity} has successfully been created.`,
    });
  },
  onError: ({ response }: AxiosError) => {
    toastNotification({
      updateContext,
      title: TOAST_NOTIFICATION_TITLES.ERROR,
      kind: TOAST_NOTIFICATION_KINDS.ERROR,
      subtitle: errorMessages.try_again,
    });
    if (!response?.data) return;
    // set response errors as rhf errors to display them
    // on respective fields
    const errRes = response?.data;
    for (let key in errRes) {
      setError(key, { type: "custom", message: errRes[key] });
    }
  },
  onSettled: () => {
    invalidate();
  },
});
