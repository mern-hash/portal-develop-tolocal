enum Icons {
  add,
  arrow,
}

enum Types {
  button,
  submit,
}

enum Kinds {
  primary,
  secondary,
  tertiary,
}

interface IButton {
  label: string;
  type: keyof typeof Types;

  clickFn?: (e) => void;
  full?: boolean;
  icon?: keyof typeof Icons;
  kind?: keyof typeof Kinds;
  aria_label?: string;
  size?: string;
}

export default IButton;
