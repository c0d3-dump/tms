import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Dashboard from "./components/local/dashboard";
import Patients from "./components/local/patients";
import Doctors from "./components/local/doctors";
import Disease from "./components/local/disease";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/toaster";

function App() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const router = createBrowserRouter([
    {
      path: "/",
      Component: Dashboard,
    },
    {
      path: "/patients",
      Component: Patients,
    },
    {
      path: "/doctors",
      Component: Doctors,
    },
    {
      path: "/disease",
      Component: Disease,
    },
  ]);

  return (
    <>
      {!isAuthenticated ? (
        <Button variant="link" onClick={() => loginWithRedirect()}>
          Login
        </Button>
      ) : (
        <>
          <div className="container">
            <RouterProvider router={router}></RouterProvider>
          </div>
          <Toaster></Toaster>
        </>
      )}
    </>
  );
}

export default App;
