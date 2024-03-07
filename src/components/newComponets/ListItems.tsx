import { Loading, ContainedListItem } from "carbon-components-react";

const ListItems = ({
  name,
  details,
  onClickFunc,
  item,
}: {
  name: string;
  details?: string;
  onClickFunc?: (item: any) => void;
  item?: any;
}) => {
  return (
    <ContainedListItem
      onClick={() => {
        onClickFunc && onClickFunc(item);
      }}
    >
      <span>{name}</span>
      {details && <span>{details}</span>}
    </ContainedListItem>
  );
};

export default ListItems;
