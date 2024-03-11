// Core
import { FunctionComponent, ReactElement, useState } from "react";
import "./header-nav.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
// Carbon
import {
  HeaderContainer,
  Header,
  SkipToContent,
  HeaderNavigation,
  HeaderGlobalBar,
  OverflowMenu,
  OverflowMenuItem,
  SideNav,
  Button,
} from "carbon-components-react";
import { Close, Menu, User } from "@carbon/icons-react";
// Api
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/api";
// Util
import { getToken, removeToken } from "@/core/storage";
import { ACCOUNT_TYPES } from "@/core/constants";

interface ILink {
  text: string;
  path: string;
}

/**
 * @description Bar with logo and links on top of header
 * @link https://github.com/weareneopix/certie-fe/blob/df76356/src/components/features/HeaderNav/HeaderNav.tsx#L1
 *
 * @interface ```tsx
 * interface ILink {
 *  text: string;
 *  path: string;
 * }
 * ```
 *
 * @params
 * - links - passing array of ILink objects will render them in a list next to logo
 * - logo - passing JSX of an svg will render it
 *
 * @example ```tsx
 * <HeaderNav
 *  links={[{
 *    text: "Institutions",
 *    path: "/institutions",
 *  }]}
 *  logo={<CertieLogoWhite />}
 * />
 * ```
 */
const HeaderNav: FunctionComponent<{
  links: ILink[];
  logoLink?: string;
  logo?: JSX.Element;
  disableMyAccNav?: boolean;
}> = ({ logoLink, links, logo, disableMyAccNav = false }): ReactElement => {
  const [sideNavExpanded, setSideNavExpanded] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  const configAuth = (tok) => {
    switch (tok) {
      case "admin":
        return "admin";
      case "institution-admin":
        return "institution";
      default:
        return "";
    }
  };

  const { mutate } = useMutation(() => logout(configAuth(getToken()?.scope!)), {
    onSuccess: () => {
      removeToken();
    },
    onSettled: () => {
      removeToken();
      navigate("/auth");
    },
  });

  const overflowMenuProps = {
    size: "lg",
    renderIcon: User,
    flipped: true,
    focusTrap: false,
    className: "header-nav__account",
  };

  return (
    <>
      <HeaderContainer
        render={() => (
          <Header aria-label="Certie">
            <SkipToContent />
            {/* Logo */}
            <Link to={logoLink || "/"} className="cds--header__menu-item">
              {logo}
            </Link>
            {/* Hamburger menu toggle icon - visible below 1054px */}
            <Button
              renderIcon={sideNavExpanded ? Close : Menu}
              iconDescription="side nav"
              hasIconOnly
              kind="ghost"
              className="header-nav__sidenav-button"
              onClick={() => setSideNavExpanded(!sideNavExpanded)}
            />
            {/* Navigation bar, visible above 1054px */}
            <HeaderNavigation aria-label="Certie">
              {links.map(({ path, text }: ILink) => (
                <Link
                  key={text}
                  className={`cds--header__menu-item${
                    location.pathname === path
                      ? " header-nav__link--active"
                      : ""
                  }`}
                  to={path}
                >
                  {text}
                </Link>
              ))}
            </HeaderNavigation>
            {/* User navigation menu */}
            {!disableMyAccNav && (
              <HeaderGlobalBar>
                <OverflowMenu {...overflowMenuProps} aria-label="User menu">
                  {getToken()?.scope !== ACCOUNT_TYPES.ADMIN ? (
                    <OverflowMenuItem
                      className="header-nav__link__myacc"
                      itemText="My account"
                      onClick={() => navigate("/institution/account")}
                    />
                  ) : undefined}
                  <OverflowMenuItem
                    className="header-nav__link__logout"
                    itemText="Log Out"
                    onClick={mutate}
                  />
                </OverflowMenu>
              </HeaderGlobalBar>
            )}
          </Header>
        )}
      />
      {/* SideNav, same as HeaderNavigation, visible below 1054px if toggled */}
      <SideNav
        isFixedNav
        expanded={sideNavExpanded}
        aria-label="side navigation"
        className="header-nav__sidenav"
      >
        {links.map(({ path, text }: ILink) => (
          <Link
            key={text}
            className="header-nav__sidenav-item"
            to={path}
            onClick={() => setSideNavExpanded(false)}
          >
            {text}
          </Link>
        ))}
      </SideNav>
    </>
  );
};

export default HeaderNav;
