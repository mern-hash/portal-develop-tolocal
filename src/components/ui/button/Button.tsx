import { FunctionComponent, ReactElement } from "react";
import { Button as CButton } from "carbon-components-react";
import { ArrowRight, Add } from "@carbon/icons-react";
import "./button.scss";

import { IButton } from "@/shared/types";

/**
 * @description Configured Carbon's button to be reusable with minimal effort.
 * @link https://github.com/weareneopix/certie-fe/blob/2e6ea2a/src/components/ui/button/Button.tsx#L1
 *
 * @interface ```tsx
 * interface IButton {
 *  label: string;
 *  type: keyof typeof Types; // enum - button/submit
 *  //optional
 *  kind?: keyof typeof Kinds; // enum - primary/secondary
 *  clickFn?: () => void;
 *  icon?: keyof typeof Icons; // enum - arrow/add
 *  full?: boolean;
 * }
 * ```
 *
 * @kind
 * - primary - lightblue background, black text
 * - secondary - darkgrey background, white text
 *
 * @example ```tsx
 * <Button
 *  label="Demo label"
 *  type="button"
 *  kind="primary"
 *  clickFn={() => console.log('ok)}
 *  icon="add"
 *  full
 * />
 * ```
 *
 * @param param0
 */
const Button: FunctionComponent<IButton> = ({
  label,
  type,
  kind,
  clickFn,
  icon,
  full,
  aria_label,
  size,
  disabled,
}): ReactElement => {
  const getIcon = () => {
    if (icon === "arrow") return ArrowRight;
    if (icon === "add") return Add;
  };

  return (
    <CButton
      className={`button--${kind}${full ? " button--full" : ""}`}
      type={type}
      renderIcon={getIcon()}
      onClick={clickFn}
      data-testid="button"
      aria-label={aria_label ? aria_label : "button"}
      kind={kind}
      size={size || "lg"}
      disabled={disabled ? disabled : false}
    >
      {label}
    </CButton>
  );
};

export default Button;
