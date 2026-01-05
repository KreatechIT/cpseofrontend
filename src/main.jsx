import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Provider } from "react-redux";
import store, { persistor } from "@/store";
import { PersistGate } from "redux-persist/integration/react";

import App from "@/App.jsx";
import "@/index.css";

const container = document.getElementById("root");

if (container) {
  createRoot(container).render(
    <StrictMode>
      {/* Provide Redux store to the entire app */}
      <Provider store={store}>
        {/* Delay rendering until persisted state has been retrieved and rehydrated */}
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </StrictMode>
  );
} else {
  throw new Error("Root element with ID 'root' was not found in the document.");
}
