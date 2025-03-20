// import React, { useEffect, useState } from "react";
// import { Navbar, Nav, NavDropdown, NavItem } from "react-bootstrap";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaHome, FaUserCircle } from "react-icons/fa";
// import { CiUser, CiLogout } from "react-icons/ci";
// import { LiaEdit } from "react-icons/lia";
// import "./NabarstyleBootstrap.css";
// import authManage from "../utils/PrivateRoute";
// import styles from "../CSS/Navbar.module.css";
// import { LuSchool } from "react-icons/lu";
// import { RxHamburgerMenu } from "react-icons/rx";
// import Sidebar from "./Sidebar";
// import { Translate } from "react-bootstrap-icons";
// import { IoIosHelpCircleOutline } from "react-icons/io";
// import RecursiveDropdown from "./RecursiveDropDown";

// function NavBar() {

//   const API_URL = import.meta.env.VITE_API_URL; //thsis is test url
//   const navigate = useNavigate();
//   const [isSidebar, setIsSidebar] = useState();
//   const [instituteName, setInstituteName] = useState("");
//   const [academicYear, setAcademicYear] = useState([]);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [menuDropdownOpen, setMenuDropdownOpen] = useState({});
//   const [inputValueGR, setInputValueGR] = useState("");
//   const [selectedYear, setSelectedYear] = useState("");
//   // const [sessionData, setsessionData] = useState({});
//   const [sessionData, setSessionData] = useState({});

//   const [navItems, setNavItems] = useState([]);

//   function getCurrentDate() {
//     const months = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ];

//     const today = new Date();
//     const day = String(today.getDate()).padStart(2, "0");
//     const monthIndex = today.getMonth();
//     const year = String(today.getFullYear()).slice();

//     const monthName = months[monthIndex];

//     return `${day} ${monthName} ${year}`;
//   }
//   // const handleSelect = (eventKey) => {
//   //   setSelectedYear(eventKey);
//   //   localStorage.setItem("academicYear", eventKey);
//   //   const academicYear = localStorage.getItem("academicYear");
//   //   console.log("this is selected academicYear", academicYear);
//   // };

//   // const handleSelect = async (eventKey) => {
//   //   setSelectedYear(eventKey);
//   //   localStorage.setItem("academicYear", eventKey);
//   //   const academic_yr = localStorage.getItem("academicYear");

//   //   try {
//   //     const token = localStorage.getItem("authToken");
//   //     if (!token || !academic_yr) {
//   //       throw new Error("No authentication token or academic year found");
//   //     }

//   //     console.log("api claing");
//   //     const response = await axios.put(
//   //       `${API_URL}/api/updateAcademicYear`,
//   //       {
//   //         academic_yr: eventKey,
//   //       },
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //           "Content-Type": "application/json",
//   //         },
//   //       }
//   //     );
//   //     console.log("the response data", response.data.success);
//   //     if (response.data.success) {
//   //       console.log("Academic year updated successfully");
//   //       window.location.reload();
//   //     }
//   //   } catch (error) {
//   //     console.log("error aa rhi hai ");
//   //     console.error("Error updating academic year:", error);
//   //   }
//   // };

//   const handleSelect = async (eventKey) => {
//     setSelectedYear(eventKey);

//     const token = localStorage.getItem("authToken");

//     if (!token) {
//       console.error("No authentication token found");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${API_URL}/api/update_academic_year`,
//         {
//           academic_year: eventKey,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       localStorage.setItem("authToken", response.data.token);
//       // Refresh the page after updating the token
//       window.location.reload();
//     } catch (error) {
//       console.error("Error updating academic year:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("authToken");

//       if (!token) {
//         console.error("No authentication token found");
//         return;
//       }

//       try {
//         // Fetch session data
//         const sessionResponse = await axios.get(`${API_URL}/api/sessionData`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setSessionData(sessionResponse.data);

//         // Fetch academic year data
//         const academicYearResponse = await axios.get(
//           `${API_URL}/api/getAcademicYear`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setAcademicYear(academicYearResponse.data.academic_years);

//         // Fetch navigation items
//         const navResponse = await axios.get(`${API_URL}/api/navmenulist`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setNavItems(navResponse.data);
//         console.log("this is the nablis", navResponse.data);
//         console.log("this is the array", navResponse.data.sub_menus);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);
//   const handleLogout = async () => {
//     try {
//       const token = localStorage.getItem("authToken");

//       // Logout API
//       await axios.post(
//         `${API_URL}/api/logout`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       localStorage.removeItem("authToken");
//       localStorage.removeItem("academicYear");
//       localStorage.removeItem("user");
//       localStorage.removeItem("settings");
//       sessionStorage.removeItem("sessionData");
//       navigate("/");
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };
//   const handleInputChange = (event) => {
//     setInputValueGR(event.target.value);
//   };
//   const toggleMenuDropdown = (menu) => {
//     setMenuDropdownOpen((prev) => ({
//       ...prev,
//       [menu]: !prev[menu],
//     }));
//   };
//   return (
//     <>
//       <div
//         className=""
//         style={{
//           position: "fixed",
//           top: "0px",
//           zIndex: "10",
//           backgroundColor: "#D61D5E",
//         }}
//       >
//         <div
//           className={`${styles.navbar} w-screen flex items-center justify-between px-2  h-12`}
//           style={{
//             // background: "#C12D51"
//             // background: "rgb(200, 35, 69) ",
//             background: "#C03078",
//           }}
//         >
//           <div>
//             <LuSchool className=" text-white " style={{ fontSize: "2em" }} />
//           </div>
//           <div className="flex-grow ">
//             <h1
//               className={`${styles.headingSchool} flex justify-center items-center   lg:text-2xl  font-semibold   sm:font-bold  text-white `}
//             >
//               {/* {localStorage.getItem("instituteName")} {"("}
//               {localStorage.getItem("academicYear")} */}
//               {/* {")"} */}
//               St. Arnolds Central School{" ("}
//               {sessionData.custom_claims?.academic_year}
//               {")"}
//             </h1>
//           </div>
//           <h1 className="text-lg lg:text-sm text-white px-2 hidden lg:block mt-2">
//             {getCurrentDate()}
//           </h1>
//           <div className="flex items-center ">
//             <NavDropdown
//               title={
//                 <FaUserCircle
//                   className="text-white"
//                   style={{
//                     fontSize: "1.5rem",
//                     display: "inline",
//                     marginLeft: "4px",
//                     paddingRight: "4px",
//                   }}
//                 />
//               }
//               className="  w-18 border-2 rounded-full border-white px-2 lg:px-4 ml-2 hover:rounded-lg "
//               menuAlign="left"
//             >
//               <NavDropdown.Item>
//                 <div
//                   className="flex items-center gap-2"
//                   onClick={() => {
//                     navigate("/myprofile");
//                   }}
//                 >
//                   <FaUserCircle style={{ fontSize: "1.5rem" }} />
//                   <span style={{ fontSize: ".8em" }}>
//                     {sessionData.user?.name}
//                   </span>
//                 </div>
//               </NavDropdown.Item>
//               <NavDropdown.Item>
//                 <div
//                   className="flex items-center gap-2"
//                   onClick={() => {
//                     navigate("/changepassword");
//                   }}
//                 >
//                   <LiaEdit style={{ fontSize: "1.5rem" }} />
//                   <span style={{ fontSize: ".8em" }}>Change Password</span>
//                 </div>
//               </NavDropdown.Item>
//               <NavDropdown.Item onClick={handleLogout}>
//                 <div className="flex items-center gap-2">
//                   <CiLogout style={{ fontSize: "1.5rem" }} />
//                   <span style={{ fontSize: ".8em" }}>Logout</span>
//                 </div>
//               </NavDropdown.Item>
//             </NavDropdown>
//           </div>
//         </div>
//         <div style={{ background: "rgb(255, 9, 98)" }}>
//           <div
//             className={` flex justify-between  shadow h-12  mx-2 bg-gray-200`}
//           >
//             <div
//               onClick={() => setIsSidebar(true)}
//               className="  hover:cursor-pointer hidden lg:block"
//             >
//               <RxHamburgerMenu
//                 style={{
//                   fontSize: "1.8em",
//                   textAlign: "center",
//                   display: "inline",
//                   position: "relative",
//                   top: "5px",
//                   left: "10px",
//                   paddingTop: "5px",
//                 }}
//               />
//             </div>
//             {/* nav bar items */}

//             <Navbar
//               expand="lg"
//               className={`${styles.navBarSide} flex justify-between pl-16 w-full custom-navbar `}
//             >
//               {/* kfdospafjkop */}
//               {/* joidsfj

//             */}
//               <div className="container-fluid flex items-center bg-gray-200 sm:w-40 box-border ">
//                 <Navbar.Toggle
//                   aria-controls="basic-navbar-nav"
//                   className="custom-toggler bg-transparent"
//                 />
//                 <Navbar.Collapse
//                   id="basic-navbar-nav"
//                   className="flex-grow-1 text-black "
//                 >
//                   {/* Navbar start here */}
//                   <Nav className="  mr-auto text-xs lg:text-sm ">
//                     <div
//                       onClick={() => {
//                         navigate("/dashboard");
//                       }}
//                       style={{ fontWeight: "700" }}
//                       className={`DashbordText  md:pt-0 my-auto  text-gray-600 cursor-pointer hover:text-gray-900  md:relative right-2  `}
//                     >
//                       <FaHome className="inline mr-1 relative bottom-0.5  hover:text-black" />
//                       Dashboard
//                     </div>

//                     {/* <Nav className="mr-auto text-xs lg:text-sm"> */}

//                     {navItems.map((item) => (
//                       <NavDropdown
//                         key={item.menu_id}
//                         title={item.name}
//                         style={{ color: "black", fontWeight: "700" }}
//                       >
//                         {item.sub_menus && item.sub_menus.length > 0 ? (
//                           item.sub_menus.map((subItem) => (
//                             <NavDropdown
//                               id="sub-view-dropdown"
//                               key={subItem.menu_id}
//                               title={subItem.name}
//                               style={
//                                 {
//                                   // backgroundColor: "black",
//                                   // fontSize: ".2em",
//                                 }
//                               }
//                               className=" text-[.9em] font-bold  dropend"
//                               // className="dropend   "
//                             >
//                               {subItem.sub_menus &&
//                               subItem.sub_menus.length > 0 ? (
//                                 subItem.sub_menus.map((childItem) => (
//                                   <NavDropdown.Item
//                                     style={{
//                                       backgroundColor: "black",
//                                       // fontSize: ".2em",
//                                     }}
//                                     id="sub-view-dropdown"
//                                     key={childItem.menu_id}
//                                     as={Link}
//                                     to={`/${childItem.url || ""}`}
//                                     className="text-[.9em] font-bold hover:text-black"
//                                   >
//                                     {childItem.name}
//                                   </NavDropdown.Item>
//                                 ))
//                               ) : (
//                                 <NavDropdown.Item
//                                   disabled
//                                   className="text-[.7em] font-bold hover:text-black"
//                                   id="sub-view-dropdown"
//                                 >
//                                   No sub-items available
//                                 </NavDropdown.Item>
//                               )}
//                             </NavDropdown>
//                           ))
//                         ) : (
//                           <NavDropdown.Item
//                             as={Link}
//                             to={`/${item.url || ""}`}
//                             disabled={!item.url}
//                             // className="bg-black hidden"
//                           >
//                             {item.name}
//                           </NavDropdown.Item>
//                         )}
//                       </NavDropdown>
//                     ))}

//                     {/* <Nav.Link
//                       // title={name}
//                       className="hover:text-gray-900"
//                       onClick={() => navigate("/help")}
//                     >
//                       <IoIosHelpCircleOutline style={{ fontSize: "1.5em" }} />
//                     </Nav.Link> */}
//                   </Nav>
//                 </Navbar.Collapse>{" "}
//               </div>
//             </Navbar>
//             <div className="flex items-center  ">
//               {/* className="w-12 lg:w-16 outline-none border border-black px-2 rounded-md text-pink-500 mr-2" */}
//               <div>
//                 <input
//                   type="text"
//                   id="search"
//                   name="search"
//                   placeholder="GR NO"
//                   value={inputValueGR}
//                   onChange={(e) => {
//                     setInputValueGR(e.target.value);
//                   }}
//                   style={{
//                     display: "inline",
//                     position: "relative",
//                     zIndex: "2",
//                     // width: "70%",
//                     padding: "3px",
//                     paddingRight: "4px",
//                     // Adjust the input text size if needed
//                   }}
//                   className={` w-12 lg:w-20 mr-4 outline-none border-1 border-gray-400  rounded-md py-0.5 text-xs lg:text-sm`}
//                 />
//               </div>

//               <NavDropdown
//                 // title={selectedYear}
//                 title={selectedYear ? selectedYear : "Academic Year "}
//                 className={`${styles.dropNaveBarAcademic} academic-dropdown outline-none border-1 border-gray-400 px-1 rounded-md py-0.5 text-xs lg:text-sm   `}
//                 style={{
//                   boxSizing: "border-box",
//                   width: "60%",
//                   margin: "auto",
//                   position: "relative",
//                   right: "10px",
//                   textAlign: "center",
//                   fontWeight: "600",
//                 }}
//                 onSelect={handleSelect}
//               >
//                 <div className=" text-start text-sm bg-gray-50 text-gray-300  h-28 overflow-y-scroll">
//                   {/* {academicYear.map((year) => (
//                   <NavDropdown.Item
//                     key={year}
//                     eventKey={year}
//                     value={year}
//                     // onChange={(e) => setChangedAcedemicYear(e.target.value)}
//                   >
//                     {year}
//                   </NavDropdown.Item>
//                 ))} */}
//                   {/* new logic */}
//                   {academicYear &&
//                     academicYear.length > 0 &&
//                     academicYear.map((year) => (
//                       <NavDropdown.Item key={year} eventKey={year}>
//                         {year}
//                       </NavDropdown.Item>
//                     ))}
//                 </div>
//               </NavDropdown>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Sidebar isSidebar={isSidebar} setIsSidebar={setIsSidebar} />
//     </>
//   );
// }

// export default NavBar;
//

// //  Finallly working navbar dynamically
import { useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown, NavItem } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHome, FaUserCircle } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { LiaEdit } from "react-icons/lia";
import "./NabarstyleBootstrap.css";
import authManage from "../utils/PrivateRoute";
import styles from "../CSS/Navbar.module.css";
import { LuSchool } from "react-icons/lu";
import { RxHamburgerMenu } from "react-icons/rx";
import Sidebar from "./Sidebar";
import RecursiveDropdown from "./RecursiveDropdown";

import AdminNavBar from "./AdminNavBar";
import { toast } from "react-toastify";
import "./styles.css";
function NavBar() {
  const API_URL = import.meta.env.VITE_API_URL; //thsis is test url
  const navigate = useNavigate();
  const [isSidebar, setIsSidebar] = useState();
  const [instituteName, setInstituteName] = useState("");
  const [academicYear, setAcademicYear] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState({});
  // const [inputValueGR, setInputValueGR] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  // const [sessionData, setsessionData] = useState({});
  const [sessionData, setSessionData] = useState({});
  const [userProfileName, setuserProfilName] = useState("");
  const [inputValueGR, setInputValueGR] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();
  const [navItems, setNavItems] = useState([]);
  const [roleId, setRoleId] = useState(""); // Add roleId state
  function getCurrentDate() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const monthIndex = today.getMonth();
    const year = String(today.getFullYear()).slice();

    const monthName = months[monthIndex];

    return `${day} ${monthName} ${year}`;
  }
  // const handleSelect = (eventKey) => {
  //   setSelectedYear(eventKey);
  //   localStorage.setItem("academicYear", eventKey);
  //   const academicYear = localStorage.getItem("academicYear");
  //   console.log("this is selected academicYear", academicYear);
  // };

  // const handleSelect = async (eventKey) => {
  //   setSelectedYear(eventKey);
  //   localStorage.setItem("academicYear", eventKey);
  //   const academic_yr = localStorage.getItem("academicYear");

  //   try {
  //     const token = localStorage.getItem("authToken");
  //     if (!token || !academic_yr) {
  //       throw new Error("No authentication token or academic year found");
  //     }

  //     console.log("api claing");
  //     const response = await axios.put(
  //       `${API_URL}/api/updateAcademicYear`,
  //       {
  //         academic_yr: eventKey,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     console.log("the response data", response.data.success);
  //     if (response.data.success) {
  //       console.log("Academic year updated successfully");
  //       window.location.reload();
  //     }
  //   } catch (error) {
  //     console.log("error aa rhi hai ");
  //     console.error("Error updating academic year:", error);
  //   }
  // };

  const handleSelect = async (eventKey) => {
    setSelectedYear(eventKey);

    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/update_academic_year`,
        {
          academic_year: eventKey,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("authToken", response.data.token);
      // Refresh the page after updating the token
      window.location.reload();
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    } catch (error) {
      console.error("Error updating academic year:", error);
    }
  };
  // Take user name so call user prpofile api
  useEffect(() => {
    const fetcUSerProfilehData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token is found");
      }
      // console.log("jfdshfoisafhaios");
      try {
        const response = await axios.get(`${API_URL}/api/editprofile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log("the userporfile__________", response.data);
        const staff = response.data.user?.get_teacher;
        setuserProfilName(staff?.name);
        console.log(
          "the userupdate profile inside the navbar compoenent",
          staff
        );
      } catch (error) {
        toast.error(error.response.data.message);
        console.error(
          "Error fetching profile data inside navbar component:",
          error
        );
      }
    };

    fetcUSerProfilehData();
  }, [API_URL]);

  // for GR number setup
  // Function to handle search based on GR number
  const handleSearch = async () => {
    console.log("GR Number Entered:", inputValueGR); // Debugging

    if (!inputValueGR) {
      toast.error("Please enter a GR number!");
      console.log("Error: Empty GR Number"); // Debugging
      return;
    }

    // Check if inputValueGR contains only digits
    if (!/^\d+$/.test(inputValueGR)) {
      toast.error("Invalid GR number! Please enter a valid numeric value.");
      console.log("Error: Invalid GR Number Format"); // Debugging
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/student_by_reg_no/${inputValueGR}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const studentList = response?.data?.student || [];
      console.log("Student List:", studentList); // Debugging

      if (studentList.length === 0) {
        alert("Not students found with tis gr no");
        toast.error("No student found with this GR number.");
        console.log("Error: No student found"); // Debugging
      } else {
        navigate(`/StudentSearchUsingGRN`, {
          state: { studentData: studentList[0] },
        });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error fetching student details."
      );
      console.log("API Error:", error?.response?.data?.message); // Debugging
    } finally {
      setLoading(false);
    }
  };

  // Function to handle keypress (Enter) in the input field
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Function to handle the view of student details
  const handleView = (student) => {
    navigate(`/student/view/${student.student_id}`, {
      state: { student: student },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No authentication token found");
        return;
      }

      try {
        // Fetch session data
        const sessionResponse = await axios.get(`${API_URL}/api/sessionData`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSessionData(sessionResponse.data);
        setSelectedYear(sessionResponse?.data?.custom_claims?.academic_year);
        setRoleId(sessionResponse.data.user.role_id); // Store role_id
        // setRoleId("A"); // Store role_id
        // Fetch academic year data
        const academicYearResponse = await axios.get(
          `${API_URL}/api/getAcademicYear`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAcademicYear(academicYearResponse.data.academic_years);

        // Fetch navigation items
        const navResponse = await axios.get(`${API_URL}/api/navmenulist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNavItems(navResponse.data);
        console.log("this is the nablis", navResponse.data);
        console.log("this is the array", navResponse.data.sub_menus);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");

      // Logout API
      await axios.post(
        `${API_URL}/api/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem("authToken");
      localStorage.removeItem("academicYear");
      localStorage.removeItem("user");
      localStorage.removeItem("settings");
      sessionStorage.removeItem("sessionData");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const handleInputChange = (event) => {
    setInputValueGR(event.target.value);
  };
  const toggleMenuDropdown = (menu) => {
    setMenuDropdownOpen((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };
  // Static navbar for admin
  const renderStaticMenu = () => {
    // Define your static menu items here
    return <AdminNavBar />;
  };
  //  100% fully working navbar dynamically with css proper
  // const renderDynamicMenu = () => {
  //   const renderDropdownItemsis = (items) => {
  //     return items.map((item) =>
  //       item.sub_menus && item.sub_menus.length > 0 ? (
  //         <NavDropdown
  //           key={item.menu_id}
  //           title={
  //             <span className="nav-dropdown-title bold-navbar-item">
  //               {item.name}
  //             </span>
  //           }
  //           className="custom-dropdown font-bold text-[.9em]"
  //         >
  //           {item.sub_menus.map((subItem) =>
  //             subItem.sub_menus && subItem.sub_menus.length > 0 ? (
  //               <NavDropdown
  //                 key={subItem.menu_id}
  //                 title={
  //                   <span className="nav-dropdown-title light-submenu-item">
  //                     {subItem.name}
  //                   </span>
  //                 }
  //                 className="custom-submenu-dropdown dropend" // Add dropend class here
  //               >
  //                 {subItem.sub_menus.map((childItem) =>
  //                   childItem.sub_menus && childItem.sub_menus.length > 0 ? (
  //                     <NavDropdown
  //                       key={childItem.menu_id}
  //                       title={
  //                         <span className="nav-dropdown-title light-submenu-item">
  //                           {childItem.name}
  //                         </span>
  //                       }
  //                       className="custom-submenu-dropdown dropend" // Add dropend class here
  //                     >
  //                       {childItem.sub_menus.map((grandChildItem) => (
  //                         <NavDropdown.Item
  //                           key={grandChildItem.menu_id}
  //                           onClick={() => navigate(grandChildItem.url)}
  //                           className="light-submenu-item"
  //                         >
  //                           {grandChildItem.name}
  //                         </NavDropdown.Item>
  //                       ))}
  //                     </NavDropdown>
  //                   ) : (
  //                     <NavDropdown.Item
  //                       key={childItem.menu_id}
  //                       onClick={() => navigate(childItem.url)}
  //                       className="light-submenu-item"
  //                     >
  //                       {childItem.name}
  //                     </NavDropdown.Item>
  //                   )
  //                 )}
  //               </NavDropdown>
  //             ) : (
  //               <NavDropdown.Item
  //                 key={subItem.menu_id}
  //                 onClick={() => navigate(subItem.url)}
  //                 className="light-submenu-item"
  //               >
  //                 {subItem.name}
  //               </NavDropdown.Item>
  //             )
  //           )}
  //         </NavDropdown>
  //       ) : (
  //         <Nav.Link
  //           key={item.menu_id}
  //           onClick={() => item.url && navigate(item.url)}
  //           className="custom-nav-link bold-navbar-item"
  //         >
  //           {item.name}
  //         </Nav.Link>
  //       )
  //     );
  //   };
  //   return renderDropdownItemsis(navItems);
  // };
  // Taking time to uncommnet it
  const renderDynamicMenu = () => {
    const renderDropdownItemsis = (items) => {
      return items.map((item) =>
        item.sub_menus && item.sub_menus.length > 0 ? (
          <NavDropdown
            key={item.menu_id}
            title={<span className="nav-dropdown-title">{item.name}</span>}
            // title={item.name}
            className="text-[.9em] font-bold"
          >
            {item.sub_menus.map((subItem) =>
              subItem.sub_menus && subItem.sub_menus.length > 0 ? (
                <NavDropdown
                  key={subItem.menu_id}
                  title={
                    <span className="nav-dropdown-title">{subItem.name}</span>
                  }
                  // title={subItem.name}
                  id="sub-view-dropdown"
                  className=" font-bold dropend"
                >
                  {subItem.sub_menus.map((childItem) =>
                    childItem.sub_menus && childItem.sub_menus.length > 0 ? (
                      <NavDropdown
                        key={childItem.menu_id}
                        id="sub-view-dropdown"
                        title={
                          <span className="nav-dropdown-title">
                            {childItem.name}
                          </span>
                        }
                        // title=
                        className=" font-bold dropend"
                      >
                        {childItem.sub_menus.map((grandChildItem) => (
                          <NavDropdown.Item
                            key={grandChildItem.menu_id}
                            onClick={() => navigate(grandChildItem.url)}
                          >
                            {grandChildItem.name}
                          </NavDropdown.Item>
                        ))}
                      </NavDropdown>
                    ) : (
                      <NavDropdown.Item
                        key={childItem.menu_id}
                        onClick={() => navigate(childItem.url)}
                      >
                        {childItem.name}
                      </NavDropdown.Item>
                    )
                  )}
                </NavDropdown>
              ) : (
                <NavDropdown.Item
                  key={subItem.menu_id}
                  onClick={() => navigate(subItem.url)}
                >
                  {subItem.name}
                </NavDropdown.Item>
              )
            )}
          </NavDropdown>
        ) : (
          <Nav.Link
            key={item.menu_id}
            onClick={() => item.url && navigate(item.url)}
            style={{ fontWeight: "700" }}
          >
            {item.name}
          </Nav.Link>
        )
      );
    };
    return renderDropdownItemsis(navItems);
  };
  return (
    <>
      <div
        className=""
        style={{
          position: "fixed",
          top: "0px",
          zIndex: "10",
          backgroundColor: "#D61D5E",
        }}
      >
        <div
          className={`${styles.navbar} w-screen flex items-center justify-between px-2  h-12`}
          style={{
            // background: "#C12D51"
            // background: "rgb(200, 35, 69) ",
            background: "#C03078",
          }}
        >
          <div>
            <LuSchool className=" text-white " style={{ fontSize: "2em" }} />
          </div>
          <div className="flex-grow ">
            <h1
              className={`${styles.headingSchool} flex justify-center items-center   lg:text-2xl  font-semibold   sm:font-bold  text-white `}
            >
              {/* {localStorage.getItem("instituteName")} {"("}
              {localStorage.getItem("academicYear")} */}
              {/* {")"} */}
              {/* St. Arnolds Central School{" ("} */}
              EvolvU Smart School{" ("}
              {sessionData.custom_claims?.academic_year}
              {")"}
            </h1>
          </div>
          <h1 className="text-lg lg:text-sm text-white px-2 hidden lg:block mt-2">
            {getCurrentDate()}
          </h1>
          <div className="flex items-center ">
            <NavDropdown
              title={
                <span className="nav-dropdown-title">
                  {
                    <FaUserCircle
                      className="text-white"
                      style={{
                        fontSize: "1.5rem",
                        display: "inline",
                        marginLeft: "4px",
                        paddingRight: "4px",
                      }}
                    />
                  }
                </span>
              }
              // title={
              //   <FaUserCircle
              //     className="text-white"
              //     style={{
              //       fontSize: "1.5rem",
              //       display: "inline",
              //       marginLeft: "4px",
              //       paddingRight: "4px",
              //     }}
              //   />
              // }
              className="  w-18 border-2 rounded-full border-white px-2 lg:px-4 ml-2 hover:rounded-lg "
              // menuAlign="left"
            >
              <NavDropdown.Item>
                <div
                  className="flex items-center gap-2"
                  onClick={() => {
                    navigate("/myprofile");
                  }}
                >
                  <FaUserCircle style={{ fontSize: "1.5rem" }} />
                  <span style={{ fontSize: ".8em" }}>
                    {/* {sessionData.user?.name} */}
                    {userProfileName}
                  </span>
                </div>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <div
                  className="flex items-center gap-2"
                  onClick={() => {
                    navigate("/changepassword");
                  }}
                >
                  <LiaEdit style={{ fontSize: "1.5rem" }} />
                  <span style={{ fontSize: ".8em" }}>Change Password</span>
                </div>
              </NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>
                <div className="flex items-center gap-2">
                  <CiLogout style={{ fontSize: "1.5rem" }} />
                  <span style={{ fontSize: ".8em" }}>Logout</span>
                </div>
              </NavDropdown.Item>
            </NavDropdown>
          </div>
        </div>
        <div style={{ background: "rgb(255, 9, 98)" }}>
          <div
            className={` flex justify-between  shadow h-12  mx-2 bg-gray-200`}
          >
            <div
              onClick={() => setIsSidebar(true)}
              className="  hover:cursor-pointer hidden lg:block"
            >
              <RxHamburgerMenu
                style={{
                  fontSize: "1.8em",
                  textAlign: "center",
                  display: "inline",
                  position: "relative",
                  top: "5px",
                  left: "10px",
                  paddingTop: "5px",
                }}
              />
            </div>
            {/* nav bar items */}

            <Navbar
              expand="lg"
              className={`${styles.navBarSide} flex justify-between pl-16 w-full custom-navbar `}
            >
              {/* kfdospafjkop */}
              {/* joidsfj

            */}
              <div className="container-fluid flex items-center bg-gray-200 sm:w-40 box-border ">
                <Navbar.Toggle
                  aria-controls="basic-navbar-nav"
                  className="custom-toggler bg-transparent"
                />
                <Navbar.Collapse
                  id="basic-navbar-nav"
                  className="flex-grow-1 text-black "
                >
                  {/* Navbar start here */}
                  <Nav className="  mr-auto text-xs lg:text-sm ">
                    <div
                      onClick={() => {
                        navigate("/dashboard");
                      }}
                      style={{ fontWeight: "700" }}
                      className={`hover:cursor-pointer   DashbordText text-[1rem] md:pt-0 my-auto  text-black  md:relative right-2  `}
                    >
                      <FaHome className="inline mr-1 relative bottom-0.5  hover:text-black" />
                      Dashboard
                    </div>

                    {console.log("the Role id", roleId)}
                    {roleId === "A" ? renderStaticMenu() : renderDynamicMenu()}
                    {/* {renderDropdownItemsis(navItems)} */}
                    {/* Resysuib function  */}
                    {/* <RecursiveDropdown items={navItems} /> */}
                  </Nav>
                </Navbar.Collapse>{" "}
              </div>
            </Navbar>
            <div className="flex items-center  ">
              {/* className="w-12 lg:w-16 outline-none border border-black px-2 rounded-md text-pink-500 mr-2" */}
              <div className="flex items-center">
                <div>
                  <input
                    type="text"
                    id="search"
                    name="search"
                    placeholder="GR NO"
                    value={inputValueGR}
                    onChange={(e) => {
                      setInputValueGR(e.target.value);
                    }}
                    onKeyPress={handleKeyPress} // Trigger search on Enter key press
                    style={{
                      display: "inline",
                      position: "relative",
                      zIndex: "2",
                      padding: "3px",
                      paddingRight: "4px",
                    }}
                    className={`w-12 lg:w-20 mr-4 outline-none border-1 border-gray-400 rounded-md py-0.5 text-xs lg:text-sm`}
                    disabled={loading}
                  />
                </div>
              </div>{" "}
              {/* {subjects.length > 0 && (
                <div className="mt-4">
                  <h3>Search Results:</h3>
                  <ul>
                    {subjects.map((student) => (
                      <li
                        key={student.student_id}
                        className="cursor-pointer p-2 border-b"
                        onClick={() => handleView(student)}
                      >
                        {student.student_name} (GR: {student.gr_no})
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}
              <NavDropdown
                // title={selectedYear}
                title={
                  <span
                    className="nav-dropdown-title"
                    style={{ fontSize: "1em" }}
                  >
                    {selectedYear ? selectedYear : "Academic Year "}
                  </span>
                }
                // title={selectedYear ? selectedYear : "Academic Year "}
                className={`${styles.dropNaveBarAcademic} academic-dropdown outline-none border-1 border-gray-400 px-1 rounded-md py-0.5 text-xs lg:text-sm   `}
                style={{
                  boxSizing: "border-box",
                  width: "60%",
                  margin: "auto",
                  position: "relative",
                  right: "10px",
                  textAlign: "center",
                  fontWeight: "600",
                }}
                onSelect={handleSelect}
              >
                <div className=" text-start text-sm bg-gray-50 text-gray-300  h-28 overflow-y-scroll">
                  {/* {academicYear.map((year) => (
                  <NavDropdown.Item
                    key={year}
                    eventKey={year}
                    value={year}
                    // onChange={(e) => setChangedAcedemicYear(e.target.value)}
                  >
                    {year}
                  </NavDropdown.Item>
                ))} */}
                  {/* new logic */}
                  {academicYear &&
                    academicYear.length > 0 &&
                    academicYear.map((year) => (
                      <NavDropdown.Item key={year} eventKey={year}>
                        {year}
                      </NavDropdown.Item>
                    ))}
                </div>
              </NavDropdown>
            </div>
          </div>
        </div>
      </div>
      <Sidebar isSidebar={isSidebar} setIsSidebar={setIsSidebar} />
    </>
  );
}

export default NavBar;

// for css and mobile view wihtout bootstrap
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaHome, FaUserCircle } from "react-icons/fa";
// import { CiLogout } from "react-icons/ci";
// import { LiaEdit } from "react-icons/lia";
// import "./Navbar.css"; // Import your custom CSS
// import authManage from "../utils/PrivateRoute";
// import Sidebar from "./Sidebar";
// import AdminNavBar from "./AdminNavBar";
// import { LuSchool } from "react-icons/lu";
// import { RxHamburgerMenu } from "react-icons/rx";

// function NavBar() {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const navigate = useNavigate();
//   const [isSidebar, setIsSidebar] = useState(false);
//   const [sessionData, setSessionData] = useState({});
//   const [academicYear, setAcademicYear] = useState([]);
//   const [selectedYear, setSelectedYear] = useState("");
//   const [navItems, setNavItems] = useState([]);
//   const [roleId, setRoleId] = useState("");
//   const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open
//   const [openSubDropdown, setOpenSubDropdown] = useState({}); // Track which sub-dropdown is open

//   const getCurrentDate = () => {
//     const months = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ];
//     const today = new Date();
//     const day = String(today.getDate()).padStart(2, "0");
//     const monthName = months[today.getMonth()];
//     const year = today.getFullYear();
//     return `${day} ${monthName} ${year}`;
//   };

//   const handleSelect = async (eventKey) => {
//     setSelectedYear(eventKey);
//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       console.error("No authentication token found");
//       return;
//     }
//     try {
//       const response = await axios.post(
//         `${API_URL}/api/update_academic_year`,
//         { academic_year: eventKey },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       localStorage.setItem("authToken", response.data.token);
//       window.location.reload();
//     } catch (error) {
//       console.error("Error updating academic year:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         console.error("No authentication token found");
//         return;
//       }
//       try {
//         const sessionResponse = await axios.get(`${API_URL}/api/sessionData`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSessionData(sessionResponse.data);
//         setRoleId(sessionResponse.data.user.role_id);

//         const academicYearResponse = await axios.get(
//           `${API_URL}/api/getAcademicYear`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setAcademicYear(academicYearResponse.data.academic_years);

//         const navResponse = await axios.get(`${API_URL}/api/navmenulist`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setNavItems(navResponse.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       await axios.post(
//         `${API_URL}/api/logout`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       localStorage.clear();
//       navigate("/");
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   const handleDropdownClick = (menuId) => {
//     setOpenDropdown(openDropdown === menuId ? null : menuId);
//     setOpenSubDropdown({});
//   };

//   const handleSubDropdownClick = (menuId) => {
//     setOpenSubDropdown((prev) => ({
//       ...prev,
//       [menuId]: prev[menuId] ? null : menuId,
//     }));
//   };

//   const renderStaticMenu = () => <AdminNavBar />;

//   const renderDropdownItems = (items) => {
//     return items.map((item) =>
//       item.sub_menus && item.sub_menus.length > 0 ? (
//         <div key={item.menu_id} className="dropdown">
//           <button
//             className="dropdown-toggle"
//             onClick={() => handleDropdownClick(item.menu_id)}
//           >
//             {item.name}
//           </button>
//           <div
//             className={`dropdown-menu ${
//               openDropdown === item.menu_id ? "open" : ""
//             }`}
//           >
//             {item.sub_menus.map((subItem) =>
//               subItem.sub_menus && subItem.sub_menus.length > 0 ? (
//                 <div key={subItem.menu_id} className="dropdown-submenu">
//                   <button
//                     className="dropdown-toggle"
//                     onClick={() => handleSubDropdownClick(subItem.menu_id)}
//                   >
//                     {subItem.name}
//                   </button>
//                   <div
//                     className={`dropdown-menu ${
//                       openSubDropdown[subItem.menu_id] ? "open" : ""
//                     }`}
//                   >
//                     {subItem.sub_menus.map((childItem) =>
//                       childItem.sub_menus && childItem.sub_menus.length > 0 ? (
//                         <div
//                           key={childItem.menu_id}
//                           className="dropdown-submenu"
//                         >
//                           <button
//                             className="dropdown-toggle"
//                             onClick={() =>
//                               handleSubDropdownClick(childItem.menu_id)
//                             }
//                           >
//                             {childItem.name}
//                           </button>
//                           <div
//                             className={`dropdown-menu ${
//                               openSubDropdown[childItem.menu_id] ? "open" : ""
//                             }`}
//                           >
//                             {childItem.sub_menus.map((grandChildItem) => (
//                               <button
//                                 key={grandChildItem.menu_id}
//                                 onClick={() => navigate(grandChildItem.url)}
//                                 className="dropdown-item"
//                               >
//                                 {grandChildItem.name}
//                               </button>
//                             ))}
//                           </div>
//                         </div>
//                       ) : (
//                         <button
//                           key={childItem.menu_id}
//                           onClick={() => navigate(childItem.url)}
//                           className="dropdown-item"
//                         >
//                           {childItem.name}
//                         </button>
//                       )
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <button
//                   key={subItem.menu_id}
//                   onClick={() => navigate(subItem.url)}
//                   className="dropdown-item"
//                 >
//                   {subItem.name}
//                 </button>
//               )
//             )}
//           </div>
//         </div>
//       ) : (
//         <button
//           key={item.menu_id}
//           onClick={() => item.url && navigate(item.url)}
//           className="nav-link"
//         >
//           {item.name}
//         </button>
//       )
//     );
//   };

//   return (
//     <>
//       <div className="navbar-container">
//         <div className="navbar-header">
//           <LuSchool className="school-icon" />
//           <h1 className="school-name">
//             St. Arnolds Central School (
//             {sessionData.custom_claims?.academic_year})
//           </h1>
//           <h1 className="current-date">{getCurrentDate()}</h1>
//           <div className="user-menu">
//             <div className="user-icon">
//               <FaUserCircle className="user-icon" />
//             </div>
//             <div className="dropdown-menu">
//               <button onClick={() => navigate("/myprofile")}>
//                 <FaUserCircle /> {sessionData.user?.name}
//               </button>
//               <button onClick={() => navigate("/changepassword")}>
//                 <LiaEdit /> Change Password
//               </button>
//               <button onClick={handleLogout}>
//                 <CiLogout /> Logout
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="navbar-menu">
//           <RxHamburgerMenu
//             onClick={() => setIsSidebar(true)}
//             className="menu-toggle"
//           />
//           <div className="nav-bar">
//             <Link to="/dashboard" className="dashboard-link">
//               <FaHome /> Dashboard
//             </Link>
//             {roleId === "A"
//               ? renderStaticMenu()
//               : renderDropdownItems(navItems)}
//             {/* <input
//               type="text"
//               placeholder="GR NO"
//               value={inputValueGR}
//               onChange={(e) => setInputValueGR(e.target.value)}
//               className="search-input"
//             /> */}
//             <div className="academic-year-dropdown">
//               <button onClick={() => handleSelect(selectedYear)}>
//                 {selectedYear ? selectedYear : "Academic Year"}
//               </button>
//               <div className="dropdown-menu">
//                 {academicYear.map((year) => (
//                   <button key={year} onClick={() => handleSelect(year)}>
//                     {year}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Sidebar isSidebar={isSidebar} setIsSidebar={setIsSidebar} />
//     </>
//   );
// }

// export default NavBar;
