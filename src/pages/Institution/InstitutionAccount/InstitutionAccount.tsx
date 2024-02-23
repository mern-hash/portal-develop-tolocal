//SECTION - Imports
//ANCHOR - core
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useOutletContext, useLocation } from "react-router-dom";
//ANCHOR - Components
import MyAccount from "./tabs/MyAccount";
import Password from "./tabs/Password";
//ANCHOR - Utils
import {
  myAccountHLC,
  myAccountTabs,
} from "@/shared/outlet-context/outletContext";
import { ContextData, ContextTypes } from "@/shared/types/ContextTypes";
//!SECTION

const InstitutionAccount: FunctionComponent = (): ReactElement => {
  const { updateContext } = useOutletContext<{
    updateContext: (state: string, data: ContextData) => void;
  }>();
  const [tabActive, setTabActive] = useState<string>("account");

  const location = useLocation();

  useEffect(() => {
    updateContext(ContextTypes.HLC, myAccountHLC);
    updateContext(
      ContextTypes.TABS,
      myAccountTabs((val: string) => setTabActive(val))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <>
      <Helmet>
        <title>My account</title>
      </Helmet>
      {tabActive === "account" ? <MyAccount /> : <Password />}
    </>
  );
};

export default InstitutionAccount;
