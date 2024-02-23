enum ModalType {
  danger,
  success,
}

interface IModal {
  heading: string;
  text: string;
  open: boolean;
  onSubmit: () => void;

  onClose?: () => void;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  type?: keyof typeof ModalType;
}

export default IModal;
