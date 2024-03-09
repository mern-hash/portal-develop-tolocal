import { Modal, Search, ContainedList } from "carbon-components-react";
import FormLabel from "../ui/FormLabel/FormLabel";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchFields } from "@/api/fields/fields";
import ListItems from "./ListItems";
import { debounceEvent } from "@/shared/util";

const ModalForCustomField = ({
  open,
  setOpen,
  heading,
  primaryButtonText,
  secondaryButtonText,
  onSubmit,
}: {
  open: boolean;
  setOpen: any;
  heading: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  onSubmit: (item: any) => any;
}) => {
  const [value, setValue] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selected, setSelected] = useState<any>(null);
  const [listData, setListData] = useState<any>([]);
  const onSearchChange = debounceEvent((e) => setValue(e.target.value), 500);

  useQuery(["fields", { term: value }], fetchFields, {
    enabled: value?.length > 0,
    onSuccess: (data) => {
      setListData(data?.[0]?.data || []);
    },
  });

  const onBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  useEffect(() => {
    value && value.length > 0 && setShowDropdown(true);
  }, [value]);

  return (
    <Modal
      open={open}
      modalHeading={heading}
      primaryButtonText={primaryButtonText}
      secondaryButtonText={secondaryButtonText}
      onRequestClose={() => {
        setOpen(false);
      }}
      onRequestSubmit={() => {
        onSubmit(selected);
      }}
    >
      <FormLabel label={""} description={"Select custom field"} />
      <Search
        labelText={"Institute"}
        onChange={onSearchChange}
        placeholder={"Search for custom field"}
        onBlur={onBlur}
      />
      {showDropdown && (
        <ContainedList className="search-list-wrapper" label="">
          {listData.length > 0 ? (
            listData.map((item) => (
              <ListItems
                key={item?.id}
                name={item?.name}
                onClickFunc={(item) => {
                  setSelected(item);
                  setValue(item.name);
                }}
                item={item}
              />
            ))
          ) : (
            <ListItems name={"No data found"} />
          )}
        </ContainedList>
      )}
    </Modal>
  );
};

export default ModalForCustomField;
