import {
  DATE_FILTER_FORMAT,
  TABLE_ORDER,
  TABLE_ORDER_DIRECTION,
} from "@/core/constants";
import { format } from "date-fns";
import { ContextTypes } from "../types/ContextTypes";

export const toastNotification = ({ updateContext, title, kind, subtitle }) => {
  updateContext(ContextTypes.TOAST, {
    title,
    type: "toast",
    kind,
    subtitle,
    corner: true,
    timeStamp: true,
  });
};

export const deleteModal = (updateContext, heading, text, fn) => {
  updateContext(ContextTypes.MODAL, {
    open: true,
    type: "danger",
    heading,
    text,
    primaryButtonText: "Delete",
    onSubmit: fn,
  });
};

export const confirmModal = (
  updateContext,
  heading,
  text,
  onSubmit,
  primaryButtonText = "Confirm"
) => {
  updateContext(ContextTypes.MODAL, {
    open: true,
    type: "success",
    heading,
    text,
    primaryButtonText,
    onSubmit,
  });
};

export const filterByDate = (keys, vals, state, setState) => {
  setState({
    ...state,
    [keys[0]]: vals.length ? format(vals[0], DATE_FILTER_FORMAT) : undefined,
    [keys[1]]: vals.length ? format(vals[1], DATE_FILTER_FORMAT) : undefined,
  });
};

export const configDateForFilter = (val, num) =>
  val?.length ? format(val[num], DATE_FILTER_FORMAT) : undefined;

export const onSortTable = ({ term, direction, tableInfo, setTableInfo }) => {
  // The id of selected header is received (e.g. "createdAt")
  // if current "orderBy" is equal to received term we're trying to sort by (orderBy is what's
  // set on BE, so we follow that name for sending req) simply swap between ascending and descending
  if (term === tableInfo.orderBy) {
    setTableInfo({
      ...tableInfo,
      order: TABLE_ORDER_DIRECTION[direction],
    });
  } else {
    // If "orderBy" thats active is different from the one we're trying to apply
    // (e.g. currently we're sorting by "id" and now we're trying to sort by "createdAt"),
    // then change orderBy and sort by ascending order (default value)
    setTableInfo({ ...tableInfo, orderBy: term, order: TABLE_ORDER.DEFAULT });
  }
};
