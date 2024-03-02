import { Loading, ContainedListItem } from "carbon-components-react";

const ListItems = ({ name, details }: { name: string; details?: string }) => {
  return (
    <ContainedListItem>
      <span>{name}</span>
      {details && <span>{details}</span>}
    </ContainedListItem>
  );
};

export default ListItems;
