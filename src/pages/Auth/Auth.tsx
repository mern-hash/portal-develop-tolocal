// Core
import { FunctionComponent, ReactElement, useEffect } from "react";
import "./auth.scss";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
// Components
import AuthNav from "./auth-nav";
import Login from "./Login";
import Recover from "./Recover";
import Reset from "./Reset";
import { CenteredBlock } from "@/components/features";
import { Section } from "carbon-components-react";
// Util
import { ACCOUNT_PATH_TYPES } from "@/core/constants";
import { CertieLogo } from "@/assets/icons";

const Auth: FunctionComponent<{ type?: string }> = ({ type }): ReactElement => {
  const { id, account_type } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // comment
    // If user is on /login but not trying to log in as
    // admin/institution/student, redirect to auth to prevent
    // sending req to e.g. /random-user
    if (
      id === "login" &&
      !Object.values(ACCOUNT_PATH_TYPES).includes(account_type!)
    ) {
      navigate("/auth");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account_type]);

  const renderPage = () => {
    if (type === "admin-setup") return <Reset />;

    switch (id) {
      case "login":
        return <Login />;

      case "recover":
        return <Recover />;

      default:
        return <AuthNav />;
    }
  };

  return (
    <CenteredBlock>
      <Helmet>
        <title>Login to Certie</title>
      </Helmet>
      <Section className="auth__container">
        <CertieLogo onClick={() => navigate("/auth")} />
        {renderPage()}
      </Section>
    </CenteredBlock>
  );
};

export default Auth;
