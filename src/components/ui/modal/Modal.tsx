import { FunctionComponent, ReactElement } from "react";
import "./modal.scss";
import { Modal as CModal } from "carbon-components-react";
import { IModal } from "@/shared/types";

/**
 * @description Simple confirm/decline modal
 * @link https://github.com/weareneopix/certie-fe/blob/1043dd3/src/components/features/modal/Modal.tsx#L1
 *
 * @interface ```tsx
 * interface IModal {
 *   heading: string;
 *   open: boolean;
 *   onSubmit: () => void;
 *   // not required, as it is used to close the modal and already set up to do that
 *   onClose?: () => void;
 *   primaryButtonText?: string;
 *   secondaryButtonText?: string;
 *   type?: keyof typeof ModalType; (enum: 'danger')
 * }
 * ```
 *
 * @example ```tsx
 *  <Modal
 *    heading="Heading"
 *    open={true}
 *    onSubmit={() => console.log('onSubmit')}
 *    primaryByttonText="Delete"
 *    secondaryButtonText="Cancel"
 *    type="danger"
 *  />
 * ```
 */
const Modal: FunctionComponent<IModal> = ({
  open,
  type,
  heading,
  text,
  primaryButtonText,
  secondaryButtonText,
  onClose,
  onSubmit,
}): ReactElement => {
  const modalProps = {
    className: "popup-modal",
    open,
    modalHeading: heading,
    primaryButtonText: primaryButtonText || "Confirm",
    secondaryButtonText: secondaryButtonText || "Cancel",
    onRequestClose: onClose,
    onRequestSubmit: onSubmit,
  };

  // NOTE: if there is another type add some type check
  if (type === "danger")
    return (
      <CModal danger {...modalProps}>
        {text && <p className="popup-modal__text">{text}</p>}
      </CModal>
    );

  return (
    <CModal {...modalProps}>
      {text && <p className="popup-modal__text">{text}</p>}
    </CModal>
  );
};

export default Modal;
