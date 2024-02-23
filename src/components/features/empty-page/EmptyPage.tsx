import { FunctionComponent, ReactElement } from "react";
import "./empty-page.scss";
import { Heading } from "carbon-components-react";

interface IEmptyPage {
  icon?: JSX.Element;
  heading?: string;
  desc?: string;
  button?: JSX.Element;
}
/**
 * @Description Display for pages that don't have data to display
 *
 * @interface ```tsx
 * interface IEmptyPage {
 *  icon?: JSX.Element;
 *  heading?: string;
 *  desc?: string;
 *  button?: JSX.Element
 * }
 * ```
 * @example ```tsx
 * <EmptyPage
 *  icon={<Sponge />}
 *  heading="Heading text here"
 *  desc="Desc text here"
 *  button={
 *   <Button ...buttonProps />
 *  }
 * />
 * ```
 */
const EmptyPage: FunctionComponent<IEmptyPage> = ({
  icon,
  heading,
  desc,
  button,
}): ReactElement => {
  return (
    <section className="empty-page">
      {icon}
      {heading ? (
        <Heading className="empty-page__heading">{heading}</Heading>
      ) : undefined}
      {desc ? <p className="empty-page__desc">{desc}</p> : undefined}
      {button}
    </section>
  );
};

export default EmptyPage;
