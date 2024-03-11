import { FunctionComponent, ReactElement } from "react";
import "./header-dropdowns.scss";
import { Dropdown, Theme } from "carbon-components-react";

const HeaderSelect: FunctionComponent<{
  id: string;
  items: { value: string; text: string }[];
  onSelect: (val: string) => void;
  label: string;
}> = ({ id, items, onSelect, label }): ReactElement => {
  return (
    <Theme theme="g10" className="header-select">
      <Dropdown
        className="header-select__wrapper"
        id={id}
        items={items}
        label={label}
        itemToString={(item) => (item ? item.text : "")}
        onChange={({ selectedItem }) => onSelect(selectedItem.value)}
      />
    </Theme>
  );
};

export default HeaderSelect;
