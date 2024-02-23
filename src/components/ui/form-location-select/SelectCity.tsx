import { FunctionComponent, useContext, useEffect, useState } from "react";
import { Select, SelectItem } from "carbon-components-react";

import { useQuery } from "@tanstack/react-query";
import { getCities } from "@/api";
import { UseFormRegister } from "react-hook-form";
import { LocationContext } from "@/shared/context/LocationContext";

const SelectCity: FunctionComponent<{
  id: string;
  register: UseFormRegister<any>;
  errors: { message: string; ref: JSX.Element; type: string } | undefined;
  watch: any;
}> = ({ id, register, errors, watch }) => {
  const { locationData, setLocationData } = useContext(LocationContext);

  const { city, country } = watch;

  const [selectedValue, setSelectedValue] = useState<string>();
  const [editSetup, setEditSetup] = useState<boolean>(false);

  const allCities = useQuery(["allCities", { country }], getCities, {
    enabled: !!country && !locationData.cities?.[country],
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!locationData.cities?.[city] && allCities.data) {
      setLocationData({
        ...locationData,
        cities: {
          ...locationData.cities,
          [country]: allCities.data,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCities.data]);

  useEffect(() => {
    city && setSelectedValue(city);
  }, [city, country]);

  useEffect(() => {
    if (country) {
      !editSetup ? setEditSetup(true) : setSelectedValue("");
    } else {
      setSelectedValue("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  return (
    <Select
      id={id}
      value={selectedValue}
      labelText="Select city"
      {...register(id, {
        required: "Required field",
      })}
      {...errors}
    >
      {/* Carbon way of setting up placeholder */}
      <SelectItem disabled hidden value="" text="Select city" />
      {locationData.cities?.[country]?.map((c, i) => (
        <SelectItem key={i} value={c.name} text={c.nameWithState || c.name} />
      ))}
    </Select>
  );
};

export default SelectCity;
