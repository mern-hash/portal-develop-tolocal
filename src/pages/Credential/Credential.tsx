import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import "./credential.scss";
import { useOutletContext, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
//ANCHOR - API
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCredential, getQrCode } from "@/api";
import QRCode from "qrcode";
//ANCHOR - Components
import { EmptyPage } from "@/components/features";
import CredentialBlock from "./components/CredentialBlock";
import CredentialList from "./components/CredentialList";
//ANCHOR - Util
import { ContextData, ContextTypes } from "@/shared/types/ContextTypes";
import { claimCredentialHLC } from "@/shared/outlet-context/outletContext";
import { Sponge } from "@/assets/icons";
import { CREDENTIAL_DATA_STATUS, CREDENTIAL_QR_STATUS } from "@/core/constants";
import CredentialQR from "./components/CredentialQR";
import CredentialToast from "./components/CredentialToast";
import NotFound from "../NotFound";

const Credential: FunctionComponent = (): ReactElement => {
  const [collectingStatus, setCollectingStatus] = useState<{
    status?: string;
    qr?: {
      img: string;
      pin: string;
    };
  }>();

  const { updateContext } = useOutletContext<{
    updateContext: (state: string, data: ContextData) => void;
  }>();

  const { token } = useParams();

  const { EXPIRED, COLLECTED, UNCOLLECTED } = CREDENTIAL_DATA_STATUS;
  const { PENDING, IN_PROGRESS, SUCCESS, ERROR } = CREDENTIAL_QR_STATUS;

  useEffect(() => {
    updateContext(ContextTypes.HLC, claimCredentialHLC);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //ANCHOR - Get credential data
  const credential = useQuery(["credential_data", { token }], getCredential, {
    refetchOnWindowFocus: false,
  });

  //ANCHOR - get QR data
  const getQr = useMutation(
    (data: { token: string | undefined; isNew?: boolean }) => getQrCode(data),
    {
      onSuccess: (data) => {
        if (data.status === SUCCESS || data.status === ERROR) {
          setCollectingStatus({
            status: data.status,
          });
        }

        QRCode.toDataURL(data.collectRequest.url).then((resp) => {
          setCollectingStatus({
            status: data.status,
            qr: {
              img: resp,
              pin: data.collectRequest.pin,
            },
          });
        });
      },
      onError: ({ response }) => {
        response.status === 403 && window.location.reload();
      },
    }
  );

  //ANCHOR - check getQR
  // If user started collecting the credential - clicked on button - the status
  // changes from "uncollected" to "collecting" and the getQrCode is invoked.
  // However, refreshing the page resets the state of the component, so we check
  // the status and if it isn't "uncollected" but "collecting" we automatically
  // call getQr to display Qr code
  useEffect(() => {
    if (credential.data?.status === CREDENTIAL_DATA_STATUS.COLLECTING) {
      // Mutating also updates the state which is usefull in next useEffect
      getQr.mutate({ token });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credential.data]);

  //ANCHOR - settimeout
  // If qr status is "pending" (QR visible) or "in_progress" (loading over QR)
  // keep pinging the QR endpoint to track status and wait for success or error
  useEffect(() => {
    if (
      getQr.data?.status &&
      [CREDENTIAL_QR_STATUS.PENDING, CREDENTIAL_QR_STATUS.IN_PROGRESS].includes(
        getQr.data?.status
      )
    ) {
      // Update the time if 10s turns out to be too much
      setTimeout(() => getQr.mutate({ token }), 5 * 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getQr.data]);

  const renderPage = (status) => {
    switch (status) {
      case EXPIRED:
        return (
          <EmptyPage
            icon={<Sponge />}
            heading="The link has expired"
            desc="The current link has expired, please request a new one"
          />
        );

      case COLLECTED:
        return <CredentialBlock collected />;

      case UNCOLLECTED:
        return (
          // Upon error, flag "isNew: true" will request new Qr code, resetting the
          // state of the request back to "pending", instead of displaying error
          // (used for submitting invalid pin code, to allow user to scan again)
          <CredentialBlock getQr={() => getQr.mutate({ token, isNew: true })} />
        );

      case PENDING:
        return (
          <CredentialQR
            qrCode={collectingStatus?.qr}
            status={collectingStatus?.status}
          />
        );

      case ERROR:
        return <CredentialBlock error />;

      default:
        return <NotFound />;
    }
  };

  return (
    <div className="credential">
      <Helmet>
        <title>Collect credential</title>
      </Helmet>

      {/* Expired credential */}
      {credential.data?.status === EXPIRED && renderPage(EXPIRED)}

      {/* Already collected credential or QR claim successful */}
      {(credential.data?.status === COLLECTED ||
        collectingStatus?.status === SUCCESS) &&
        renderPage(COLLECTED)}

      {/* Uncollected credential - getCredential status is "uncollected" and there isn't collectingStatus
      a.k.a the button hasn't been clicked either */}
      {credential.data?.status === UNCOLLECTED &&
        !collectingStatus?.status &&
        renderPage(UNCOLLECTED)}

      {/* QR Pending - collectingStatus is pending or in_progress - button has been clicked and code
      is either scanned in process of validation, or not scanned at all */}
      {[PENDING, IN_PROGRESS].includes(collectingStatus?.status!) &&
        renderPage(PENDING)}

      {/* QR claim error */}
      {collectingStatus?.status === ERROR && renderPage(ERROR)}

      {/* If credential is collected or expired the page is basically empty.
      In every other case display list and toast footer */}
      {credential?.data?.status &&
        ![COLLECTED, EXPIRED].includes(credential?.data?.status) && (
          <>
            {/* <CredentialList credentialData={credential.data} /> */}
            <CredentialList
              credential={credential.data}
              fields={credential.data?.fields}
              institution={{
                label: "Institution",
                value: credential.data?.institution.name,
              }}
            />
            <CredentialToast />
          </>
        )}

      {}
    </div>
  );
};

export default Credential;
