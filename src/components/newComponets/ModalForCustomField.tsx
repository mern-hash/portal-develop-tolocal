import { fetchFields } from "@/api/fields/fields";
import { useQuery } from "@tanstack/react-query";
import { ContainedList, Modal, Search } from "carbon-components-react";
import { useEffect, useState } from "react";
import FormLabel from "../ui/FormLabel/FormLabel";
import "./CustomFieldModal.scss";
import ListItems from "./ListItems";

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
  const [search, setSearch] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showDropdownNew, setShowDropdownNew] = useState<boolean>(false);
  const [selected, setSelected] = useState<any>(null);
  const [listData, setListData] = useState<any>([]);

  useQuery(["fields", { term: search }], fetchFields, {
    enabled: showDropdownNew && search?.length > 0,
    onSuccess: (data) => {
      setListData(data?.data || []);
    },
  });

  const onBlur = () => {
    setShowDropdownNew(false);
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  const onFocus = () => {
    setShowDropdownNew(true);
    setShowDropdown(true);
  };

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setSearch(value);
    }, 500);
    return () => clearTimeout(delayInputTimeoutId);
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
      className="Modal__wrapper"
    >
      <FormLabel label={""} description={"Select custom field"} />
      <Search
        labelText={"Institute"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={"Search for custom field"}
        onBlur={onBlur}
        onFocus={onFocus}
      />

      <ContainedList
        className={`search-list-wrapper ${!showDropdown ? "click-hide" : ""}`}
        label=""
      >
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
    </Modal>
  );
};

export default ModalForCustomField;
