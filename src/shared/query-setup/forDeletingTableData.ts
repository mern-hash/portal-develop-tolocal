import { AxiosError } from "axios";
import {
  TOAST_NOTIFICATION_KINDS,
  TOAST_NOTIFICATION_TITLES,
} from "@/core/constants";
import { clearModal } from "@/shared/outlet-context/outletContext";
import { toastNotification } from "@/shared/table-data/tableMethods";
import { ContextTypes } from "@/shared/types/ContextTypes";
import { errorMessages } from "../errorText";

export const forDeletingTableData = ({
  refetch,
  updateContext,
  entity,
  setCount,
}: {
  refetch: () => void;
  updateContext: any;
  entity: string;
  setCount?: (val: number) => void;
}) => ({
  onSuccess: () => {
    refetch();
    toastNotification({
      updateContext,
      title: TOAST_NOTIFICATION_TITLES.SUCCESS,
      kind: TOAST_NOTIFICATION_KINDS.INFO,
      subtitle: `${entity} successfully been deleted.`,
    });
    setCount && setCount(0);
  },
  onError: (error: AxiosError) => {
    console.error(error);
    toastNotification({
      updateContext,
      title: TOAST_NOTIFICATION_TITLES.ERROR,
      kind: TOAST_NOTIFICATION_KINDS.ERROR,
      subtitle: errorMessages.try_again,
    });
  },
  onSettled: () => {
    // Close delete modal regardless of success/error
    updateContext(ContextTypes.MODAL, clearModal);
    setCount && setCount(0);
  },
});
