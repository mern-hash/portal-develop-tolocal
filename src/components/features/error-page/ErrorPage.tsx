import { FunctionComponent, ReactElement } from "react";
import "./error-page.scss";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const ErrorPage: FunctionComponent<{ title: string }> = ({
  title,
}): ReactElement => {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      Something went wrong. Please try{" "}
      <strong className="error-page__reload" onClick={() => navigate(0)}>
        reloading
      </strong>
      .
    </>
  );
};

export default ErrorPage;
