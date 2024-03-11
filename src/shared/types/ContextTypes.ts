import {
  IToastNotification,
  IModal,
  IHeaderLayoutContext,
  IHeaderTabsContext,
} from "./";

export enum ContextTypes {
  HLC = "hlc",
  TOAST = "toast",
  MODAL = "modal",
  TABS = "tabs",
}

export type ContextData =
  | IToastNotification
  | IModal
  | IHeaderLayoutContext
  | IHeaderTabsContext;
