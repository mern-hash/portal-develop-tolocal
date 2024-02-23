import { Info } from "@/assets/icons";
import { FunctionComponent, ReactElement } from "react";

const CredentialToast: FunctionComponent = (): ReactElement => {
  return (
    <div
      className="credential__notification cds--toast-notification cds--toast-notification--warning"
      title="Wrong personal information?"
    >
      <Info className="cds--toast-notification__icon" />
      <div className="cds--toast-notification__details">
        <div className="cds--toast-notification__title">
          Wrong personal information?
        </div>
        <div className="cds--toast-notification__subtitle">
          Please contact support here:{" "}
          <a
            className="credential__block__link"
            href="mailto:support@certie.io"
          >
            support@certie.io
          </a>
        </div>
      </div>
    </div>
  );
};

export default CredentialToast;
