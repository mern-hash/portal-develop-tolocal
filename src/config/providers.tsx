import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Helmet, HelmetProvider } from "react-helmet-async";
import LocationContextProvider from "../shared/context/LocationContext";

// TODO: config client once tables are in
const queryClient = new QueryClient({
  defaultOptions: {},
});

/**
 * @description Wraps the entire app with QueryClientProvider which enables react-query
 * @param param0
 * @returns
 */
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <HelmetProvider>
      <Helmet>Certie</Helmet>
      <QueryClientProvider client={queryClient}>
        <LocationContextProvider>{children}</LocationContextProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default Providers;
