// import Header from "../components/layout/Header.jsx";

import DashboardContent from "./DashboardContent.jsx";

// import Style from '../Styles/AdminDashboard.module.css';
// AdminDashbord
const AdminDashboard = () => {
  return (
    <div
      className=" w-screen overflow-x-hidden h-screen"
      //   style={{ background: "rgb(252,252,252)" }}
      style={{
        background: "   linear-gradient(to bottom, #E91E63, #2196F3)",

        // background: "linear-gradient(to bottom, #C12A4D,#6C87BE, #5C99D2",

        // background:
        //   "rgb(31,136,246) linear-gradient(0deg, rgba(31,136,246,1) 0%, rgba(245,6,6,1) 91%)",
        // background:
        //   " rgb(81,199,204) linear-gradient(360deg, rgba(81,199,204,8) 0%, rgba(228,80,130,1) 53%)",
      }}
    >
      {/* <div className='bg-slate-500'> */}
      {/* <Header /> */}
      {/* <NavBar /> */}
      <DashboardContent />
    </div>
  );
};
// DashboardContent.js
export default AdminDashboard;
