import { AxiosError } from "axios";
import {
  TOAST_NOTIFICATION_KINDS,
  TOAST_NOTIFICATION_TITLES,
} from "@/core/constants";
import { toastNotification } from "@/shared/table-data/tableMethods";
import { errorMessages } from "../errorText";
import { ContextTypes } from "../types/ContextTypes";
import { clearModal } from "../outlet-context/outletContext";

export const forEditingEntry = ({
  navigate,
  updateContext,
  entity,
  setError,
  invalidate,
  ...optional
}) => ({
  onMutate: () => {
    updateContext(ContextTypes.MODAL, clearModal);
  },
  onSuccess: () => {
    toastNotification({
      updateContext,
      title: TOAST_NOTIFICATION_TITLES.SUCCESS,
      kind: TOAST_NOTIFICATION_KINDS.INFO,
      subtitle: `${entity} has successfully been edited.`,
    });
    invalidate();
    navigate?.();
  },
  onError: ({ response }: AxiosError | any) => {
    toastNotification({
      updateContext,
      title: TOAST_NOTIFICATION_TITLES.ERROR,
      kind: TOAST_NOTIFICATION_KINDS.ERROR,
      subtitle: errorMessages.try_again,
    });
    if (!response?.data) return;

    // set response errors as rhf errors to display them
    // on respective fields
    const errRes = response?.data?.error?.fields || response?.data;
    for (let key in errRes) {
      setError(key, { type: "custom", message: errRes[key] });
    }

    if (optional.setToastErrorMessage) {
      optional.setToastErrorMessage(response?.data.message);
    }
  },
});
