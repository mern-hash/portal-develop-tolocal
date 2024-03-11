import { FunctionComponent, ReactElement, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "@/core/storage";
import { ACCOUNT_TYPES } from "@/core/constants";

const Home: FunctionComponent = (): ReactElement => {
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInuser = getToken()?.scope;

    switch (loggedInuser) {
      case ACCOUNT_TYPES.ADMIN:
        navigate("/admin/institutions");
        break;

      case ACCOUNT_TYPES.INSTITUTION:
        navigate("/institution");
        break;

      default:
        navigate("/auth");
    }
  }, [navigate]);

  return <></>;
};

export default Home;
