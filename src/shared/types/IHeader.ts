export interface IHeaderBlock {
  title: string;
  button?: JSX.Element;
}

export interface IHeaderLayoutContext {
  logoLink?: string;
  links: { text: string; path: string }[];
  title: string;
  button?: JSX.Element;
  disableMyAccNav?: boolean;
}

export interface IHeaderTabsContext {
  tabs: IHeaderTab[];
  changeFn: (val: string) => void;
}

export interface IHeaderTab {
  text: string;
  value: string;
}
