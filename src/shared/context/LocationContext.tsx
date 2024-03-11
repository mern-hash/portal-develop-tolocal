import { createContext, useState } from "react";

export const LocationContext = createContext<{
  locationData;
  setLocationData: (val: any) => void;
}>({
  locationData: {},
  setLocationData: () => "",
});

const LocationContextProvider = ({ children }) => {
  const [locationData, setLocationData] = useState({
    countries: [],
    cities: {},
  });

  return (
    <LocationContext.Provider value={{ locationData, setLocationData }}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContextProvider;
