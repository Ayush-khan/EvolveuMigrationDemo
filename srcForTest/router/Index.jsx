// // All Routes protected code is here

// import { Route, Router, Routes } from "react-router-dom";
// import CreateStudent from "../componants/CreateStudent";
// import StudentList from "../componants/StudentList";
// import DemoTable from "../componants/DemoTable";
// import StudentEdit from "../componants/StudentEdit";
// import Login from "../componants/LoginForm";
// import NavBar from "../Layouts/NavBar";
// import UserProfile from "../componants/UserProfile";
// import LandingPage from "../componants/LandingPage";
// import AdminDashboard from "../componants/Dashbord/AdminDashboard";
// import EventCard from "../componants/Dashbord/EventCard";
// import NoticeBord from "../componants/Dashbord/NoticeBord";
// import StudentsChart from "../componants/Dashbord/Charts/StudentsChart";
// import PrivateRoute from "../utils/PrivateRoute";
// import ClassList from "../componants/TableComponentsNikhilbhai/ClassList";
// import Sections from "../componants/TableComponentsNikhilbhai/Sections";
// import NotificationPage from "../componants/NotificationPage";
// import StaffBirthdayTabList from "../componants/AllTableList/StaffBirthdayTabList";
// import TickitingCountList from "../componants/AllTableList/TickitingCountList";
// import FeePendingList from "../componants/AllTableList/FeePendingList.jsx";
// import ChangePassword from "../componants/ChangePassword.jsx";
// import PageNotFounde from "./PageNotFound.jsx";
// function Index() {
//   return (
//     <Routes>
//       <Route
//         path="/student-create"
//         element={<PrivateRoute element={CreateStudent} />}
//       />
//       <Route
//         path="/student-list"
//         element={<PrivateRoute element={StudentList} />}
//       />
//       <Route
//         path="/student/:id/edit"
//         element={<PrivateRoute element={StudentEdit} />}
//       />
//       <Route
//         path="/student-demo-table"
//         element={<PrivateRoute element={DemoTable} />}
//       />
//       <Route path="/eventcard" element={<PrivateRoute element={EventCard} />} />
//       <Route
//         path="/dashboard"
//         element={<PrivateRoute element={AdminDashboard} />}
//       />

//       <Route path="/navbar" element={<PrivateRoute element={NavBar} />} />
//       <Route
//         path="/myprofile"
//         element={<PrivateRoute element={UserProfile} />}
//       />

//       {/* Nikhil bhai pages */}
//       <Route path="/classlist" element={<PrivateRoute element={ClassList} />} />
//       <Route path="/sections" element={<PrivateRoute element={Sections} />} />
//       <Route path="/" element={<LandingPage />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/notification" element={<NotificationPage />} />
//       {/* <Route path="/notification" element={<NotificationPage />} /> */}
//       {/* ALlTableList EndPoints */}
//       {/* <StaffBirthdayTabList /> */}
//       {/* <TickitingCountList /> */}
//       {/* Routes for the listing cards */}
//       {/* changepassword route */}
//       <Route path="/changepassword" element={<ChangePassword />} />
//       <Route
//         path="/ticktinglist"
//         element={<PrivateRoute element={TickitingCountList} />}
//       />
//       <Route
//         path="/feependinglist"
//         element={<PrivateRoute element={FeePendingList} />}
//       />
//       <Route
//         path="/staffbirthlist"
//         element={<PrivateRoute element={StaffBirthdayTabList} />}
//       />
//       {/* Page Not FOund Routes */}
//       <Route path="*" element={<PrivateRoute element={PageNotFounde} />} />
//     </Routes>
//   );
// }

// export default Index;

// // second outlet used try

import { Route, Router, Routes } from "react-router-dom";
import CreateStudent from "../componants/CreateStudent";
import StudentList from "../componants/StudentList";
import DemoTable from "../componants/DemoTable";
import StudentEdit from "../componants/StudentEdit";
import Login from "../componants/LoginForm";
import NavBar from "../Layouts/NavBar";
import UserProfile from "../componants/UserProfile";
import LandingPage from "../componants/LandingPage";
import AdminDashboard from "../componants/Dashbord/AdminDashboard";
import EventCard from "../componants/Dashbord/EventCard";
import NoticeBord from "../componants/Dashbord/NoticeBord";

import StudentsChart from "../componants/Dashbord/Charts/StudentsChart";
import PrivateRoute from "../utils/PrivateRoute";
import ClassList from "../componants/TableComponentsNikhilbhai/ClassList";
import Sections from "../componants/TableComponentsNikhilbhai/Sections";
import NotificationPage from "../componants/NotificationPage";
import StaffBirthdayTabList from "../componants/AllTableList/StaffBirthdayTabList";
import TickitingCountList from "../componants/AllTableList/TickitingCountList";
import FeePendingList from "../componants/AllTableList/FeePendingList.jsx";
import ChangePassword from "../componants/ChangePassword.jsx";
import MainLayout from "../Layouts/MainLayout";
import PageNotFounde from "./PageNotFound.jsx";
import StaffList from "../componants/StaffComponents/StaffList.jsx";
import CreateStaff from "../componants/StaffComponents/CreateStaff.jsx";
function Index() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<MainLayout />}>
        <Route
          path="/student-create"
          element={<PrivateRoute element={CreateStudent} />}
        />
        <Route
          path="/student-list"
          element={<PrivateRoute element={StudentList} />}
        />
        <Route
          path="/student/:id/edit"
          element={<PrivateRoute element={StudentEdit} />}
        />
        <Route
          path="/student-demo-table"
          element={<PrivateRoute element={DemoTable} />}
        />
        {/* Staff endPoints */}
        <Route
          path="/StaffList"
          element={<PrivateRoute element={StaffList} />}
        />
        <Route
          path="/CreateStaff"
          element={<PrivateRoute element={CreateStaff} />}
        />

        <Route
          path="/eventcard"
          element={<PrivateRoute element={EventCard} />}
        />
        <Route
          path="/dashboard"
          element={<PrivateRoute element={AdminDashboard} />}
        />
        <Route
          path="/myprofile"
          element={<PrivateRoute element={UserProfile} />}
        />
        <Route
          path="/classlist"
          element={<PrivateRoute element={ClassList} />}
        />
        <Route path="/sections" element={<PrivateRoute element={Sections} />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route
          path="/ticktinglist"
          element={<PrivateRoute element={TickitingCountList} />}
        />
        <Route
          path="/feependinglist"
          element={<PrivateRoute element={FeePendingList} />}
        />
        <Route
          path="/staffbirthlist"
          element={<PrivateRoute element={StaffBirthdayTabList} />}
        />
      </Route>
      {/* Page Not FOund Routes */}
      <Route path="*" element={<PrivateRoute element={PageNotFounde} />} />
    </Routes>
  );
}

export default Index;
