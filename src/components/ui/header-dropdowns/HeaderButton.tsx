import { FunctionComponent, ReactElement } from "react";
import "./header-dropdowns.scss";
import { Add } from "@carbon/icons-react";
import { Dropdown } from "carbon-components-react";

enum iconType {
  add,
}

const HeaderButton: FunctionComponent<{
  id: string;
  buttonText: string;
  items: {
    text: string;
    onClick: () => void;
  }[];
  iconType?: keyof typeof iconType;
}> = ({ id, buttonText, items, iconType }): ReactElement => {
  const configButtonIcon = () => {
    switch (iconType) {
      case "add":
        return <Add className="header-button__icon" />;
      default:
        return null;
    }
  };

  return (
    <Dropdown
      id={id}
      className="header-button"
      items={items}
      label={
        <>
          {buttonText} {configButtonIcon()}
        </>
      }
      itemToString={(item) => (item ? item.text : "")}
      onChange={({ selectedItem }) => selectedItem.onClick()}
    />
  );
};

export default HeaderButton;
