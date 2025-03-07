import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import EmployeePage from "./components/employees/EmployeePage";
import EmployeeProfile from "./components/employees/EmployeeProfile";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employees" element={<EmployeePage />} />
          <Route path="/employees/:id" element={<EmployeeProfile />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
