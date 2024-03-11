// Core
import { FunctionComponent, ReactElement } from "react";
import "./header-block.scss";
// Carbon
import { Heading } from "carbon-components-react";
// Util
import { IHeaderBlock } from "@/shared/types";

/**
 * @description Header block that displays page title to the left, and optional button to the right
 * (regardless of being button, select, or something else)
 * @link https://github.com/weareneopix/certie-fe/blob/1043dd3/src/components/features/header/Header.tsx#L1
 *
 * @interface ```tsx
 * interface IHeader {
 *  title: string;
 *  button?: JSX.Element
 * }
 * ```
 *
 * @params
 * - button - pass either button, or select, or basically any jsx element, but according to the design
 * on the right there will be either button or select (button)
 *
 * @example ```tsx
 * <Header title="Institutions" button={<Button .../>} />
 * ```
 */
const HeaderBlock: FunctionComponent<IHeaderBlock> = ({
  title,
  button,
}): ReactElement => {
  return (
    <div className="header-block">
      <Heading className="header-block__heading">{title}</Heading>
      {button}
    </div>
  );
};

export default HeaderBlock;
