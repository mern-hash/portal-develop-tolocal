import { FunctionComponent } from "react";
import styles from "./toastNotification.module.scss";
import {
  InlineNotification,
  ToastNotification as CToastNotification,
} from "carbon-components-react";
import { format } from "date-fns";

import { IToastNotification } from "@/shared/types";

/**
 * @description Toast-like notification
 * @link https://github.com/weareneopix/certie-fe/blob/2e6ea2a/src/components/ui/error-notification/ErrorNotification.tsx#L1
 *
 * @interface ```tsx
 * interface IErrorNotification {
 *  title: string;
 *  type: keyof typeof Types;
 *  kind: keyof typeof Kinds;
 *  subtitle?: string;
 *  customClass?: string;
 *  full?: boolean;
 *  corner?: boolean;
 *  onClose?: () => void;
 * }
 * ```
 *
 * @params
 * - title: string
 * - type: toast/inline (enum - string; toast - multiline, inline - single line)
 * - subtitle: string (text below title)
 * - customClass: string (for optional className)
 *
 * @example ```tsx
 * <ToastNotification
 *   type="toast"
 *   title="Sorry, "
 *   subtitle="Wrong Email or Password. Please try again."
 *   customClass={styles.error}
 *   kind="error"
 * />
 * ```
 *
 * @param param0
 */
const ToastNotification: FunctionComponent<IToastNotification> = ({
  title,
  type,
  kind,
  subtitle,
  customClass,
  full,
  corner,
  onClose,
  timeStamp,
  timeout,
}) => {
  const toastProps = {
    className: `${full ? `${styles.container}` : ""}${
      corner ? ` ${styles.corner}` : ""
    }${customClass ? ` ${customClass}` : ""}`,
    kind,
    lowContrast: true,
    title,
    onClose,
    timeout: timeout ? timeout : 3000,
  };

  return type === "inline" ? (
    <InlineNotification aria-label="closes notification" {...toastProps}>
      {subtitle && (
        <div className="cds--inline-notification__subtitle">{subtitle}</div>
      )}
    </InlineNotification>
  ) : (
    <CToastNotification aria-label="closes notification" {...toastProps}>
      {subtitle && (
        <div className="cds--toast-notification__subtitle">{subtitle}</div>
      )}
      {timeStamp && (
        <div className="cds--toast-notification__caption">
          Time stamp [{format(new Date(), "HH:mm:ss")}]
        </div>
      )}
    </CToastNotification>
  );
};

export default ToastNotification;
