import { FunctionComponent, ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getToken } from "@/core/storage";
import { ACCOUNT_TYPES, ACCOUNT_PATH_TYPES } from "@/core/constants";

enum types {
  authorized,
  unauthorized,
}

/**
 * @description Protect route based on token (to prevent user accessing an app if not logged in
 * or to prevent user spamming auth if he is logged in). Used in router.tsx
 * @link https://github.com/weareneopix/certie-fe/blob/2e6ea2a/src/config/ProtectedRoute.tsx
 *
 * @params types
 * - authorized - getToken()
 * - unauthorized - !getToken()
 *
 * @example ```tsx
 * <ProtectedRoute type="authorized" element={<Home />} />
 * <ProtectedRoute type="unauthorized" element={<Auth />} />
 * ```
 */
const ProtectedRoute: FunctionComponent<{
  element: ReactNode;
  type: keyof typeof types;
}> = ({ element, type }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentLocation = location.pathname.split("/")[1];
    const loggedInuser = getToken()?.scope;

    if (type === "unauthorized" && loggedInuser) {
      navigate("/");
    } else if (type === "authorized") {
      switch (currentLocation) {
        case ACCOUNT_PATH_TYPES.ADMIN:
          loggedInuser !== ACCOUNT_TYPES.ADMIN && navigate("/");
          break;

        case ACCOUNT_TYPES.INSTITUTION:
          loggedInuser !== ACCOUNT_TYPES.INSTITUTION && navigate("/");
          break;

        default:
          return;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return <>{element}</>;
};

export default ProtectedRoute;
