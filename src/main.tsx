import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { CompanyProvider } from "./context/CompanyContext.tsx";
import { DateRangeProvider } from "./context/DateRangeContext.tsx";

// Import the dev tools and initialize them
import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CompanyProvider>
        <DateRangeProvider>
          <App />
        </DateRangeProvider>
      </CompanyProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
