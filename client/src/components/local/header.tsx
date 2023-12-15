import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const onNavigationClicked = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

  return (
    <div className="mb-6 mt-2 flex justify-between">
      <div>
        <Button
          variant={location.pathname === "/" ? "secondary" : "link"}
          onClick={() => onNavigationClicked("/")}
        >
          Dashboard
        </Button>
        <Button
          variant={location.pathname === "/patients" ? "secondary" : "link"}
          onClick={() => onNavigationClicked("/patients")}
        >
          Patients
        </Button>
        <Button
          variant={location.pathname === "/doctors" ? "secondary" : "link"}
          onClick={() => onNavigationClicked("/doctors")}
        >
          Doctors
        </Button>
        <Button
          variant={location.pathname === "/disease" ? "secondary" : "link"}
          onClick={() => onNavigationClicked("/disease")}
        >
          Disease
        </Button>
      </div>

      <Button
        variant="destructive"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
          window.location.reload();
        }}
      >
        Log Out
      </Button>
    </div>
  );
}
