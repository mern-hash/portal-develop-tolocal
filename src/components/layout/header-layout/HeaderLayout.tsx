// Core
import { FunctionComponent, ReactElement, useState } from "react";
import "./header-layout.scss";
import { Outlet } from "react-router-dom";
// Carbon
import { Theme } from "carbon-components-react";
// Components
import { HeaderBlock, HeaderNav, HeaderTabs, Modal } from "../../features";
import { ToastNotification } from "../../ui";
// Util
import {
  IHeaderLayoutContext,
  IHeaderTabsContext,
  IModal,
  IToastNotification,
} from "@/shared/types";
import { CertieLogoWhite } from "@/assets/icons";
import { ContextTypes } from "@/shared/types/ContextTypes";

/**
 * @description
 * - Layout component that includes Header-related components (HeaderNav, Header, tbd
 * HeaderTabs) and react outlet. It's reusable and used almost throughout entire app.
 * - Settings its params is done using routerContext
 * - It also has implemented logic for pop up modal and toast notification (also via context)
 *
 * @usage
 * - Basically, it isn't used anywhere specifically. Add it to router as root element and then
 * children will inherit the template and context to be used
 *
 * @example ```tsx
 * // in router.tsx
 * {
 *  element: <HeaderLayout />,
 *  children: [{ path: "/somewhere", element: <SomeComponent />}]
 * }
 * ```
 */
const HeaderLayout: FunctionComponent = (): ReactElement => {
  const [{ logoLink, links, title, button, disableMyAccNav }, setHlc] =
    useState<IHeaderLayoutContext>({
      links: [],
      logoLink: "/",
      title: "Certie",
    });
  const [toast, setToast] = useState<IToastNotification | null>(null);
  const [modal, setModal] = useState<IModal>({
    // Default values required for modal to have animation
    open: false,
    type: "danger",
    heading: "Heading",
    text: "Desc",
    primaryButtonText: "Delete",
    secondaryButtonText: "Cancel",
    onSubmit: () => {},
  });
  const [tabsData, setTabsData] = useState<IHeaderTabsContext>({
    tabs: [],
    changeFn: () => {},
  });

  const updateContext = (state: string, data) => {
    switch (state) {
      case ContextTypes.HLC:
        setHlc(data);
        break;

      case ContextTypes.TOAST:
        setToast(data);
        break;

      case ContextTypes.MODAL:
        setModal(data);
        break;

      case ContextTypes.TABS:
        setTabsData(data);
        break;

      default:
        return;
    }
  };

  return (
    <main className="header-layout">
      <HeaderNav
        logoLink={logoLink}
        links={links}
        logo={<CertieLogoWhite />}
        disableMyAccNav={disableMyAccNav}
      />
      <HeaderBlock title={title} button={button} />
      {tabsData.tabs.length ? (
        <HeaderTabs tabs={tabsData.tabs} changeFn={tabsData.changeFn} />
      ) : undefined}
      <Theme theme="g10" className="header-layout__body__wrapper">
        {toast ? (
          <ToastNotification {...toast} onClose={() => setToast(null)} />
        ) : undefined}
        <main className="header-layout__body">
          <section className="header-layout__body__content">
            <Outlet context={{ updateContext }} />
          </section>
        </main>

        <Modal {...modal} onClose={() => setModal({ ...modal, open: false })} />
      </Theme>
    </main>
  );
};

export default HeaderLayout;
