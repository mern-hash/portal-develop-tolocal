enum Types {
  toast,
  inline,
}

export enum Kinds {
  success,
  error,
  info,
}

interface IToastNotification {
  title: string;
  type: keyof typeof Types;
  kind: keyof typeof Kinds;
  subtitle?: string | JSX.Element;
  customClass?: string;
  full?: boolean;
  corner?: boolean;
  onClose?: () => void;
  timeStamp?: boolean;
  timeout?: number;
}

export default IToastNotification;
