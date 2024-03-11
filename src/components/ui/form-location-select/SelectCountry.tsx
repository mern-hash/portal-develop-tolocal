import { FunctionComponent, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UseFormRegister } from "react-hook-form";
import { getCountries } from "@/api";
import { Select, SelectItem } from "carbon-components-react";
import { LocationContext } from "@/shared/context/LocationContext";

const SelectCountry: FunctionComponent<{
  id: string;
  register: UseFormRegister<any>;
  errors: { message: string; ref: JSX.Element; type: string } | undefined;
  watch?: any;
}> = ({ id, register, errors, watch }) => {
  const { locationData, setLocationData } = useContext(LocationContext);

  const { country } = watch;

  const [selectedValue, setSelectedValue] = useState<string>("");

  const allCountries = useQuery(["allCountries"], getCountries, {
    enabled: !locationData.countries?.length,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    country && setSelectedValue(country);
  }, [country]);

  useEffect(() => {
    if (!locationData.countries?.length) {
      setLocationData({
        ...locationData,
        countries: allCountries.data,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCountries.data]);

  return (
    <Select
      id={id}
      value={selectedValue}
      labelText={`Select ${id}`}
      {...register(id, {
        required: "Required field",
      })}
      {...errors}
    >
      <SelectItem disabled hidden value="" text="Select country" />
      {locationData.countries?.map((c, i) => (
        <SelectItem key={i} value={c.isoCode} text={c.name} />
      ))}
    </Select>
  );
};

export default SelectCountry;
