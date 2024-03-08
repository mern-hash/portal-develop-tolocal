import {
  TOAST_NOTIFICATION_KINDS,
  TOAST_NOTIFICATION_TITLES,
} from "@/core/constants";
import { toastNotification } from "@/shared/table-data/tableMethods";
import { errorMessages } from "../errorText";

export const forGettingTableData = ({
  setItemsFetched,
  updateContext,
  setInitialFetch,
  itemCount,
  setItemCount,
}: {
  setItemsFetched: (val: any[]) => void;
  setInitialFetch: (val: boolean) => void;
  updateContext: any;
  itemCount?: number;
  setItemCount: (val: number) => void;
}) => ({
  onSuccess: ({ pages }: any) => {
    // Sets fetched data in state, to prevent table flashing while fetching next page, and keep
    // displaying stored data during allInstitutions.isLoading/isFetching
    setItemsFetched(pages[0]);
  },
  onError: () => {
    toastNotification({
      updateContext,
      title: TOAST_NOTIFICATION_TITLES.ERROR,
      kind: TOAST_NOTIFICATION_KINDS.ERROR,
      subtitle: errorMessages.try_again,
    });
  },
  onSettled: () => {
    setInitialFetch(false);
  },
  getNextPageParam: ({ meta }: any) => {
    // If total number of items stored in state is different from the one in meta
    // (e.g. after deleting one entry and refetching) set itemCount from meta data
    if (itemCount !== meta?.itemCount && meta?.itemCount)
      setItemCount(meta?.itemCount);
  },
  refetchOnWindowFocus: false,
  refetchInterval: 60 * 1000,
});
