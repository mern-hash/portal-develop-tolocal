import { FunctionComponent, ReactElement } from "react";
import { Loading } from "carbon-components-react";
import { CREDENTIAL_QR_STATUS } from "@/core/constants";

const CredentialQR: FunctionComponent<{
  qrCode?: {
    img: string;
    pin: string;
  };
  status?: string;
}> = ({ qrCode, status }): ReactElement => {
  return (
    <div className="credential__qr">
      <div
        className={`credential__qr__code${
          status === CREDENTIAL_QR_STATUS.IN_PROGRESS
            ? " credential__qr__code--pending"
            : ""
        }`}
      >
        <img className="credential__qr__img" alt="qr" src={qrCode?.img} />
        {status === CREDENTIAL_QR_STATUS.IN_PROGRESS && (
          <Loading className="credential__qr__loading" withOverlay={false} />
        )}
      </div>
      <br />
      <span className="credential__qr__pin">PIN Code: {qrCode?.pin}</span>
    </div>
  );
};

export default CredentialQR;
