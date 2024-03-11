import { FunctionComponent, ReactElement } from "react";
import { Heading } from "carbon-components-react";
import { Button, ToastNotification } from "@/components/ui";
import { TOAST_NOTIFICATION_TITLES } from "@/core/constants";
import { errorMessages } from "@/shared/errorText";

const CredentialBlock: FunctionComponent<{
  getQr?: () => void;
  collected?: boolean;
  error?: boolean;
}> = ({ getQr, collected, error }): ReactElement => {
  return (
    <div className="credential__block">
      <Heading className="credential__block__heading">
        Collect credential
      </Heading>
      {collected ? (
        <p className="credential__block__text">
          If you want to collect your credential again, please contact the
          institution that issued the credential.
        </p>
      ) : (
        <p className="credential__block__text">
          Click the button below to generate a QR code valid for 5 minutes. Use
          your{" "}
          <a
            href="https://www.microsoft.com/en-us/security/mobile-authenticator-app"
            target="_blank"
            rel="noreferrer"
          >
            Microsoft Authenticator
          </a>{" "}
          app to scan the QR.
        </p>
      )}
      {getQr && (
        <Button
          label="Collect credential"
          type="button"
          clickFn={getQr}
          kind="primary"
        />
      )}
      {collected && (
        <ToastNotification
          title={TOAST_NOTIFICATION_TITLES.SUCCESS}
          kind="success"
          type="inline"
          subtitle="Your credential has successfully been collected."
          full
        />
      )}
      {error && (
        <ToastNotification
          title={TOAST_NOTIFICATION_TITLES.ERROR}
          kind="error"
          type="inline"
          subtitle={errorMessages.try_again}
          full
        />
      )}
    </div>
  );
};

export default CredentialBlock;
