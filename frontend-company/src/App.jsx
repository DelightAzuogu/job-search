import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import routing from "./routes";
import Navbar from "./navbar";

function App() {
  const { pathname } = useLocation();

  const routes = routing();

  const showRoute = routes.filter((r) => r.show === true);

  return (
    <>
      {!(pathname == "/sign-in" || pathname == "/sign-up") && (
        <div className="container absolute left-2/4 z-10 mx-auto -translate-x-2/4 p-4">
          <Navbar routes={showRoute} />
        </div>
      )}
      <Routes>
        {routes.map(
          ({ path, element }, key) =>
            element && <Route key={key} exact path={path} element={element} />
        )}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

export default App;
