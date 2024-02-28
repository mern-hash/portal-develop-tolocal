import { Loading, ContainedListItem } from "carbon-components-react";

const ListItems = ({ name, details }) => {
  return (
    <ContainedListItem>
      <span>{name}</span>
      <span>{details}</span>
    </ContainedListItem>
  );
};

export default ListItems;
