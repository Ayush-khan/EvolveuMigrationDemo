import React from "react";
import { useNavigate } from "react-router-dom";

function PageNotFounde() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("authToken"); // Check if user is logged in

  const handleNavigation = () => {
    if (isLoggedIn) {
      navigate("/dashboard"); // Navigate to dashboard if logged in
    } else {
      navigate("/login"); // Navigate to login page if not logged in
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-8">Page Not Found</h2>
        <p className="text-lg">
          Go to{" "}
          <span
            onClick={handleNavigation}
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            Main Page
          </span>
        </p>
      </div>
    </div>
  );
}

export default PageNotFounde;
