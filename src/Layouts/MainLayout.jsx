// src/Layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
// import NavBar from "./NavBar";
// This is a function of the mainLayout components where all routes render here:

function MainLayout() {
  return (
    <div>
      <NavBar />
      <div
        className=" content w-screen overflow-x-hidden h-screen  pb-4 mt-[10%] pt-[16%] md:pt-1 md:mt-[7%] "
        style={{
          background: "   linear-gradient(to bottom, #E91E63, #2196F3)",
        }}
      >
        <Outlet className=" " />
      </div>{" "}
      <div className="">
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
