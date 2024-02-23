import Providers from "./config/providers";
import Router from "./config/router";

import "./App.scss";

function App() {
  return (
    <Providers>
      <Router />
    </Providers>
  );
}

export default App;
