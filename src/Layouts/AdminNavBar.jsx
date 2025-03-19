// import React from "react";
// import { NavDropdown, Nav } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import { IoIosHelpCircleOutline } from "react-icons/io";
// // import "./styles.css";
// import "./AdminNavBar.css"; // Attach the CSS file

// const AdminNavBar = () => {
//   return (
//     <>
//       {/* Role Dropdown */}
//       <NavDropdown
//         title={
//           <span className="nav-dropdown-title custom-dropdown ">Role</span>
//         }
//         // title="Role"
//         style={{ color: "black", fontWeight: "700" }}
//         className="pr-0 mr-0 w-fit"
//       >
//         <NavDropdown.Item as={Link} to="/roles">
//           Manage Role
//         </NavDropdown.Item>
//         <NavDropdown.Item as={Link} to="/menus">
//           Manage Menu
//         </NavDropdown.Item>
//         <NavDropdown.Item as={Link} to="/show_roles">
//           Manage Access
//         </NavDropdown.Item>
//       </NavDropdown>

//       {/* My Actions Dropdown */}
//       <NavDropdown
//         title={<span className="nav-dropdown-title">My Actions</span>}
//         // title="My Actions"
//         style={{ color: "black", fontWeight: "700" }}
//         className="pr-0 mr-0 w-fit"
//       >
//         {/* Students Sub-dropdown */}
//         <NavDropdown
//           className="dropend"
//           id="students-dropdown"
//           title={<span className="nav-dropdown-title">Students</span>}
//           // title="Students"
//           style={{
//             color: "gray",
//             fontWeight: "400",
//             display: "block",
//           }}
//         >
//           <NavDropdown.Item
//             as={Link}
//             to="/newStudentList"
//             className="text-sm font-bold hover:text-black"
//           >
//             New Student List
//           </NavDropdown.Item>
//           <NavDropdown.Item
//             className="text-sm font-bold hover:text-black"
//             as={Link}
//             to="/manageStudent"
//           >
//             Manage Students
//           </NavDropdown.Item>
//           <NavDropdown.Item
//             className="text-sm font-bold hover:text-black"
//             as={Link}
//             to="/manageStudentLC"
//           >
//             LC Students
//           </NavDropdown.Item>
//           <NavDropdown.Item
//             className="text-sm font-bold hover:text-black"
//             as={Link}
//             to="/deleteStudent"
//           >
//             Deleted Students Lists
//           </NavDropdown.Item>
//           <NavDropdown.Item
//             className="text-sm font-bold hover:text-black"
//             as={Link}
//             to="#"
//           >
//             Promote Students
//           </NavDropdown.Item>
//           <NavDropdown.Item
//             className="text-sm font-bold hover:text-black"
//             as={Link}
//             to="#"
//           >
//             Send User Id to Parents
//           </NavDropdown.Item>
//           <NavDropdown.Item
//             className="text-sm font-bold hover:text-black"
//             as={Link}
//             to="#"
//           >
//             Sibling Mapping
//           </NavDropdown.Item>
//           <NavDropdown.Item>Edit Student</NavDropdown.Item>
//           <NavDropdown.Item>Delete Student</NavDropdown.Item>
//           <NavDropdown.Item
//             as={Link}
//             to="/myprofile"
//             className="text-sm font-bold hover:text-black"
//           >
//             User Profile
//           </NavDropdown.Item>
//         </NavDropdown>

//         {/* Certificate Sub-dropdown */}
//         <NavDropdown
//           className="dropend pr-0 mr-0"
//           id="certificate-dropdown"
//           // title="Certificate"
//           title={<span className="nav-dropdown-title">Certificate</span>}
//           style={{
//             color: "gray",
//             fontWeight: "400",
//             display: "block",
//           }}
//         >
//           <NavDropdown.Item
//             as={Link}
//             to="/bonafiedCertificates"
//             // to="#"
//             className="text-sm font-bold"
//           >
//             Bonafide Certificate
//           </NavDropdown.Item>
//           <NavDropdown.Item
//             as={Link}
//             // to="#"
//             to="/castCertificate"
//             className="text-sm font-bold hover:text-black"
//           >
//             Caste Certificate
//           </NavDropdown.Item>
//           <NavDropdown.Item
//             as={Link}
//             to="/characterCertificate"
//             className="text-sm font-bold hover:text-black"
//           >
//             Character Certificate
//           </NavDropdown.Item>
//           <NavDropdown.Item
//             as={Link}
//             to="/percentageCertificate"
//             className="text-sm font-bold hover:text-black"
//           >
//             Percentage Certificate
//           </NavDropdown.Item>
//           <NavDropdown.Item
//             as={Link}
//             to="/simpleBonafied"
//             className="text-sm font-bold hover:text-black"
//           >
//             Simple Bonafide Certificate
//           </NavDropdown.Item>
//         </NavDropdown>

//         {/* Staff Sub-dropdown */}
//         <NavDropdown
//           className="dropend pr-0 mr-0"
//           id="staff-dropdown"
//           title={<span className="nav-dropdown-title">Staff</span>}
//           // title=""
//           style={{
//             color: "gray",
//             fontWeight: "400",
//             display: "block",
//           }}
//         >
//           <NavDropdown.Item
//             as={Link}
//             to="/StaffList"
//             className="text-sm font-bold"
//           >
//             Manage Staff
//           </NavDropdown.Item>
//           <NavDropdown.Item
//             as={Link}
//             to="/careTacker"
//             // to="#"
//             className="text-sm font-bold hover:text-black"
//           >
//             Manage Caretaker
//           </NavDropdown.Item>
//           <NavDropdown.Item
//             as={Link}
//             to="/SubstituteTeacher"
//             className="text-sm font-bold hover:text-black"
//           >
//             Substitute Teacher
//           </NavDropdown.Item>
//         </NavDropdown>

//         {/* Leaving Certificate Sub-dropdown */}
//         <NavDropdown.Item
//           as={Link}
//           to="/leavingCertificate"
//           className="text-sm font-bold hover:text-black"
//         >
//           Leaving Certificate
//         </NavDropdown.Item>
//         {/* Leave Sub-dropdown */}
//         <NavDropdown
//           className="dropend pr-0 mr-0"
//           id="leave-dropdown"
//           title={<span className="nav-dropdown-title">Leave</span>}
//           // title=""
//           style={{
//             color: "gray",
//             fontWeight: "400",
//             display: "block",
//           }}
//         >
//           <NavDropdown.Item as={Link} to="#" className="text-sm font-bold">
//             Leave Allocation
//           </NavDropdown.Item>
//           <NavDropdown.Item
//             as={Link}
//             to="#"
//             className="text-sm font-bold hover:text-black"
//           >
//             Leave Allocation to All Staff
//           </NavDropdown.Item>
//           <NavDropdown.Item
//             as={Link}
//             to="#"
//             className="text-sm font-bold hover:text-black"
//           >
//             Leave Application
//           </NavDropdown.Item>
//         </NavDropdown>

//         {/* Other Items */}
//         <NavDropdown.Item
//           as={Link}
//           to="/noticeAndSms"
//           className="text-sm font-bold hover:text-black"
//         >
//           Notice/SMS
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="#"
//           className="text-sm font-bold hover:text-black"
//         >
//           Event
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="#"
//           className="text-sm font-bold hover:text-black"
//         >
//           Holiday List
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="/allotClassTeacher"
//           className="text-sm font-bold hover:text-black"
//         >
//           Allot Class Teachers
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="#"
//           className="text-sm font-bold hover:text-black"
//         >
//           Allot Department Coordinator
//         </NavDropdown.Item>
//       </NavDropdown>

//       {/* ID Card Dropdown */}
//       <NavDropdown
//         title={<span className="nav-dropdown-title">ID Card</span>}
//         // title=""
//         style={{ color: "black", fontWeight: "700" }}
//       >
//         <NavDropdown.Item
//           as={Link}
//           to="#"
//           className="text-sm font-bold hover:text-black"
//         >
//           Student ID Card
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="#"
//           className="text-sm font-bold hover:text-black"
//         >
//           Teacher ID Card
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="#"
//           className="text-sm font-bold hover:text-black"
//         >
//           Pending Student ID Card
//         </NavDropdown.Item>
//       </NavDropdown>

//       {/* View Dropdown */}

//       <NavDropdown
//         // title=""
//         title={<span className="nav-dropdown-title">View</span>}
//         style={{ color: "black", fontWeight: "700" }}
//       >
//         <NavDropdown.Item
//           as={Link}
//           to="#"
//           className="text-sm font-bold hover:text-black"
//         >
//           Leaving Certificate
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="#"
//           className="text-sm font-bold hover:text-black"
//         >
//           Notices/SMS for Staff
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="#"
//           className="text-sm font-bold hover:text-black"
//         >
//           Book Availability
//         </NavDropdown.Item>
//       </NavDropdown>

//       {/* Reports Dropdown */}
//       <NavDropdown
//         // title=""
//         title={<span className="nav-dropdown-title">Reports</span>}
//         style={{ color: "black", fontWeight: "700" }}
//       >
//         <NavDropdown.Item
//           as={Link}
//           to="#"
//           className="text-sm font-bold hover:text-black"
//         >
//           Balance Leave
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="#"
//           className="text-sm font-bold hover:text-black"
//         >
//           Consolidated Leave
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="#"
//           className="text-sm font-bold hover:text-black"
//         >
//           Student Report
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="#"
//           className="text-sm font-bold hover:text-black"
//         >
//           Student Contact Details Report
//         </NavDropdown.Item>
//       </NavDropdown>

//       {/* Ticket Dropdown */}
//       <NavDropdown
//         // title=""
//         title={<span className="nav-dropdown-title">Ticket</span>}
//         style={{ color: "black", fontWeight: "700" }}
//       >
//         <NavDropdown.Item
//           as={Link}
//           to="#"
//           className="text-sm font-bold hover:text-black"
//         >
//           T1
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="#"
//           className="text-sm font-bold hover:text-black"
//         >
//           T2
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="#"
//           className="text-sm font-bold hover:text-black"
//         >
//           T3
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="#"
//           className="text-sm font-bold hover:text-black"
//         >
//           T4
//         </NavDropdown.Item>
//       </NavDropdown>

//       {/* Masters Dropdown */}
//       <NavDropdown
//         // title=""
//         title={<span className="nav-dropdown-title">Masters</span>}
//         style={{ color: "black", fontWeight: "700" }}
//       >
//         <NavDropdown.Item
//           as={Link}
//           to="/sections"
//           className="text-sm font-bold hover:text-black"
//         >
//           Section
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="/classlist"
//           className="text-sm font-bold hover:text-black"
//         >
//           Class
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="/divisionlist"
//           className="text-sm font-bold hover:text-black"
//         >
//           Division
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="/subjectlist"
//           className="text-sm font-bold hover:text-black"
//         >
//           Subjects
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="/managesubject"
//           className="text-sm font-bold hover:text-black"
//         >
//           Subjects Allotment
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="#"
//           className="text-sm font-bold hover:text-black"
//         >
//           StudentWise Subject Allotment for HSC
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="/subjectforReportcard"
//           className="text-sm font-bold hover:text-black"
//         >
//           Subject for Report Card
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="/managesubjectforreportcard"
//           className="text-sm font-bold hover:text-black"
//         >
//           Subject allotment for report card
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="/Exams"
//           className="text-sm font-bold hover:text-black"
//         >
//           Exams
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="/grades"
//           // to="#"
//           className="text-sm font-bold hover:text-black"
//         >
//           Grades
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           // to="/grades"
//           to="/marksHeading"
//           className="text-sm font-bold hover:text-black"
//         >
//           Marks heading
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="/allotMarksHeading"
//           // to="/allotMarksHeading"
//           className="text-sm font-bold hover:text-black"
//         >
//           Allot Marks heading
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="/examTimeTable"
//           // to="/allotMarksHeading"
//           className="text-sm font-bold hover:text-black"
//         >
//           Exam Timetable{" "}
//         </NavDropdown.Item>
//       </NavDropdown>

//       {/* Help */}
//       <div
//         onClick={() => {
//           /* navigate(""); */
//         }}
//         style={{ fontWeight: "700", fontSize: "1rem", color: "black" }}
//         className="my-auto text-gray-600 cursor-pointer hover:text-gray-900 md:relative left-2"
//       >
//         <IoIosHelpCircleOutline className="inline mr-1 relative bottom-0.5 hover:text-black " />
//         Help
//       </div>
//     </>
//   );
// };

// export default AdminNavBar;

// working  hover and onclick on navbar

import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./AdminNavBar.css"; // Attach the CSS file
import { IoIosHelpCircleOutline } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import { Nav } from "react-bootstrap";

const AdminNavBar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [clickedDropdown, setClickedDropdown] = useState(null);
  const menuRef = useRef(null);

  // 🔹 Toggle Dropdown on Click
  const toggleDropdown = (dropdownName) => {
    if (clickedDropdown === dropdownName) {
      setOpenDropdown(null);
      setClickedDropdown(null);
    } else {
      setOpenDropdown(dropdownName);
      setClickedDropdown(dropdownName);
    }
  };

  // 🔹 Handle Hover
  const handleMouseEnter = (dropdownName) => {
    if (!clickedDropdown || clickedDropdown !== dropdownName) {
      setOpenDropdown(dropdownName);
      setClickedDropdown(null); // Reset clicked dropdown when another is hovered
    }
  };

  // 🔹 Close Dropdown on Mouse Leave
  const handleMouseLeave = () => {
    if (!clickedDropdown) {
      setOpenDropdown(null);
    }
  };

  // 🔹 Detect Outside Click & Reset State
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setClickedDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Nav ref={menuRef}>
        {/* Role Dropdown */}
        <NavDropdown
          title={<span className="nav-dropdown-title">Role</span>}
          className="custom-nav-dropdown"
        >
          <NavDropdown.Item as={Link} to="/roles">
            Manage Role
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/menus">
            Manage Menu
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/show_roles">
            Manage Access
          </NavDropdown.Item>
        </NavDropdown>

        {/* My Actions Dropdown */}
        <NavDropdown
          title={<span className="nav-dropdown-title">My Actions</span>}
          className="custom-nav-dropdown"
        >
          {/* Students Sub-dropdown */}
          <NavDropdown
            title={
              <span
                className="nav-dropdown-titleSubUnder"
                onClick={() => toggleDropdown("students")}
                onMouseEnter={() => handleMouseEnter("students")}
              >
                Students
              </span>
            }
            className="dropend custom-submenu"
            show={openDropdown === "students"}
            onMouseLeave={handleMouseLeave}
          >
            <NavDropdown.Item as={Link} to="/newStudentList">
              New Student List
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/manageStudent">
              Manage Students
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/manageStudentLC">
              LC Students
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/deleteStudent">
              Deleted Students Lists
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/PromoteStudent">
              Promote Students
            </NavDropdown.Item>

            <NavDropdown.Item as={Link} to="/SendUserIdToParent">
              Send User Id to Parents
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/SiblingMapping">
              Sibling Mapping
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/myprofile">
              User Profile
            </NavDropdown.Item>
          </NavDropdown>

          {/* Certificate Sub-dropdown */}
          <NavDropdown
            title={
              <span
                className="nav-dropdown-titleSubUnder"
                onClick={() => toggleDropdown("certificate")}
                onMouseEnter={() => handleMouseEnter("certificate")}
              >
                Certificate
              </span>
            }
            show={openDropdown === "certificate"}
            onMouseLeave={handleMouseLeave}
            className="dropend custom-submenu"
          >
            <NavDropdown.Item as={Link} to="/bonafiedCertificates">
              Bonafide Certificate
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/castCertificate">
              Caste Certificate
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/characterCertificate">
              Character Certificate
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/percentageCertificate">
              Percentage Certificate
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/simpleBonafied">
              Simple Bonafide Certificate
            </NavDropdown.Item>
          </NavDropdown>

          {/* Staff Sub-dropdown */}
          <NavDropdown
            title={
              <span
                className="nav-dropdown-titleSubUnder"
                onClick={() => toggleDropdown("staff")}
                onMouseEnter={() => handleMouseEnter("staff")}
              >
                Staff
              </span>
            }
            className="dropend custom-submenu"
            show={openDropdown === "staff"}
            onMouseLeave={handleMouseLeave}
          >
            <NavDropdown.Item as={Link} to="/StaffList">
              Manage Staff
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/careTacker">
              Manage Caretaker
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/SubstituteTeacher">
              Substitute Teacher
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/SetLateTime">
              Set Late Time
            </NavDropdown.Item>
          </NavDropdown>

          {/* Leave Sub-dropdown */}
          <NavDropdown
            title={
              <span
                className="nav-dropdown-titleSubUnder"
                onClick={() => toggleDropdown("leave")}
                onMouseEnter={() => handleMouseEnter("leave")}
              >
                Leave
              </span>
            }
            className="dropend custom-submenu"
            show={openDropdown === "leave"}
            onMouseLeave={handleMouseLeave}
          >
            <NavDropdown.Item as={Link} to="/LeaveAllocation">
              Leave Allocation
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/leaveAllocationtoAllStaff">
              Leave Allocation to All Staff
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/LeaveApplication">
              Leave Application
            </NavDropdown.Item>
          </NavDropdown>

          {/* Other Items */}
          <NavDropdown.Item as={Link} to="/leavingCertificate">
            Leaving Certificate
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/noticeAndSms">
            Notice/SMS
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="#">
            Event
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/holidayList">
            Holiday List
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/allotClassTeacher">
            Allot Class Teachers
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="#">
            Allot Department Coordinator
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/allotGRNumber">
            Allot GR Number
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/categoryReligion">
            Update Category and Religion
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/updateStudentID">
            Update Student ID Other Details
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/timeTable">
            Time Table
          </NavDropdown.Item>
        </NavDropdown>

        {/* ID Card Dropdown */}
        <NavDropdown
          title={<span className="nav-dropdown-title">ID Card</span>}
          // title=""
          className="custom-nav-dropdown"
          style={{ color: "black", fontWeight: "700" }}
        >
          <NavDropdown.Item
            as={Link}
            to="/studentIdCard"
            className="text-sm font-bold hover:text-black"
          >
            Student ID Card
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/teacherIdCard"
            className="text-sm font-bold hover:text-black"
          >
            Teacher ID Card
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/pendingStudentId"
            className="text-sm font-bold hover:text-black"
          >
            Pending Student ID Card
          </NavDropdown.Item>
        </NavDropdown>

        {/* View Dropdown */}

        <NavDropdown
          // title=""
          title={<span className="nav-dropdown-title">View</span>}
          className="custom-nav-dropdown"
          style={{ color: "black", fontWeight: "700" }}
        >
          <NavDropdown.Item
            as={Link}
            to="#"
            className="text-sm font-bold hover:text-black"
          >
            Notices/SMS for Staff
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="#"
            className="text-sm font-bold hover:text-black"
          >
            Book Availability
          </NavDropdown.Item>
        </NavDropdown>

        {/* Reports Dropdown */}
        <NavDropdown
          // title=""
          title={<span className="nav-dropdown-title">Reports</span>}
          className="custom-nav-dropdown"
          style={{ color: "black", fontWeight: "700" }}
        >
          <NavDropdown.Item
            as={Link}
            to="/listAdmFrmRep"
            className="text-sm font-bold hover:text-black"
          >
            List of Admission Forms Report
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/balanceleave"
            className="text-sm font-bold hover:text-black"
          >
            Balance Leave
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/consolidatedLeave"
            className="text-sm font-bold hover:text-black"
          >
            Consolidated Leave
          </NavDropdown.Item>
          {/* <NavDropdown.Item
            as={Link}
            // to="/studentReport"
            to="#"
            className="text-sm font-bold hover:text-black"
          >
            Student Report
          </NavDropdown.Item> */}
          <NavDropdown.Item
            as={Link}
            to="/studentContactDetailsReport"
            className="text-sm font-bold hover:text-black"
          >
            Student Contact Details Report
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/StudentRemarkReport"
            className="text-sm font-bold hover:text-black"
          >
            Student Remarks Report
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/catWiseStudRepo"
            className="text-sm font-bold hover:text-black"
          >
            Student - Category wise Report
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/relgWiseStudRepo"
            className="text-sm font-bold hover:text-black"
          >
            Student - Religion wise Report
          </NavDropdown.Item>
          {/* <NavDropdown.Item
            as={Link}
            // to="/gendrWiseStudRepo"
            to="#"
            className="text-sm font-bold hover:text-black"
          >
            Student - Gender wise Report
          </NavDropdown.Item> */}
          <NavDropdown.Item
            as={Link}
            to="/GenWiseCatRepo"
            className="text-sm font-bold hover:text-black"
          >
            Student - Genderwise Categorywise Report
          </NavDropdown.Item>
        </NavDropdown>

        {/* Ticket Dropdown */}
        <NavDropdown
          // title=""
          title={<span className="nav-dropdown-title">Ticket</span>}
          className="custom-nav-dropdown"
          style={{ color: "black", fontWeight: "700" }}
        >
          <NavDropdown.Item
            as={Link}
            to="#"
            className="text-sm font-bold hover:text-black"
          >
            T1
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="#"
            className="text-sm font-bold hover:text-black"
          >
            T2
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="#"
            className="text-sm font-bold hover:text-black"
          >
            T3
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="#"
            className="text-sm font-bold hover:text-black"
          >
            T4
          </NavDropdown.Item>
        </NavDropdown>

        {/* Masters Dropdown */}
        <NavDropdown
          // title=""
          title={<span className="nav-dropdown-title">Masters</span>}
          className="custom-nav-dropdown"
          style={{ color: "black", fontWeight: "700" }}
        >
          <NavDropdown.Item
            as={Link}
            to="/sections"
            className="text-sm font-bold hover:text-black"
          >
            Section
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/classes"
            className="text-sm font-bold hover:text-black"
          >
            Class
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/division"
            className="text-sm font-bold hover:text-black"
          >
            Division
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/subjects"
            className="text-sm font-bold hover:text-black"
          >
            Subjects
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/subject_allotment"
            className="text-sm font-bold hover:text-black"
          >
            Subjects Allotment
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/SubjectAllotmentHSC"
            className="text-sm font-bold hover:text-black"
          >
            StudentWise Subject Allotment for HSC
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/subjectforReportcard"
            className="text-sm font-bold hover:text-black"
          >
            Subject for Report Card
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/managesubjectforreportcard"
            className="text-sm font-bold hover:text-black"
          >
            Subject allotment for report card
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/leavetype"
            className="text-sm font-bold hover:text-black"
          >
            Leave Type
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/Exams"
            className="text-sm font-bold hover:text-black"
          >
            Exams
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/grades"
            // to="#"
            className="text-sm font-bold hover:text-black"
          >
            Grades
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            // to="/grades"
            to="/marksHeading"
            className="text-sm font-bold hover:text-black"
          >
            Marks heading
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/allot_Marks_Heading"
            // to="/allotMarksHeading"
            className="text-sm font-bold hover:text-black"
          >
            Allot Marks heading
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/exam_TimeTable"
            // to="/allotMarksHeading"
            className="text-sm font-bold hover:text-black"
          >
            Exam Timetable{" "}
          </NavDropdown.Item>
        </NavDropdown>

        {/* Help */}
        <div
          onClick={() => {
            /* navigate(""); */
          }}
          style={{ fontWeight: "700", fontSize: "1rem", color: "black" }}
          className="my-auto text-gray-600 cursor-pointer hover:text-gray-900 md:relative left-2"
        >
          <IoIosHelpCircleOutline className="inline mr-1 relative bottom-0.5 hover:text-black " />
          Help
        </div>
      </Nav>
    </>
  );
};

export default AdminNavBar;

// import React from "react";
// import { NavDropdown, Nav } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import { IoIosHelpCircleOutline } from "react-icons/io";
// import "./styles.css";

// const AdminNavBar = () => {
//   return (
//     <>
//       {/* Role Dropdown */}
//       <NavDropdown
//         title={<span className="nav-dropdown-title">Role</span>}
//         style={{ color: "black", fontWeight: "700" }}
//         className="pr-0 mr-0 w-fit custom-dropdown"
//       >
//         <NavDropdown.Item as={Link} to="/roles" className="text-sm custom-link">
//           Manage Role
//         </NavDropdown.Item>
//         <NavDropdown.Item as={Link} to="/menus" className="text-sm custom-link">
//           Manage Menu
//         </NavDropdown.Item>
//         <NavDropdown.Item
//           as={Link}
//           to="/show_roles"
//           className="text-sm custom-link"
//         >
//           Manage Access
//         </NavDropdown.Item>
//       </NavDropdown>

//       {/* My Actions Dropdown */}
//       <NavDropdown
//         title={<span className="nav-dropdown-title">My Actions</span>}
//         style={{ color: "black", fontWeight: "700" }}
//         className="pr-0 mr-0 w-fit custom-dropdown"
//       >
//         {/* Students Sub-dropdown */}
//         <NavDropdown
//           className="dropend custom-sub-dropdown"
//           id="students-dropdown"
//           title={<span className="nav-dropdown-title">Students</span>}
//           style={{ color: "black", fontWeight: "700" }}
//         >
//           <NavDropdown.Item
//             as={Link}
//             to="/student-create"
//             className="text-sm custom-link"
//           >
//             Add Student
//           </NavDropdown.Item>
//           <NavDropdown.Item
//             as={Link}
//             to="/newStudentList"
//             className="text-sm custom-link"
//           >
//             New Student List
//           </NavDropdown.Item>
//           <NavDropdown.Item
//             as={Link}
//             to="/manageStudent"
//             className="text-sm custom-link"
//           >
//             Manage Students
//           </NavDropdown.Item>
//           <NavDropdown.Item as={Link} to="#" className="text-sm custom-link">
//             LC Students
//           </NavDropdown.Item>
//           <NavDropdown.Item as={Link} to="#" className="text-sm custom-link">
//             Deleted Student Lists
//           </NavDropdown.Item>
//           <NavDropdown.Item as={Link} to="#" className="text-sm custom-link">
//             Promote Students
//           </NavDropdown.Item>
//           <NavDropdown.Item as={Link} to="#" className="text-sm custom-link">
//             Send User Id to Parents
//           </NavDropdown.Item>
//           <NavDropdown.Item as={Link} to="#" className="text-sm custom-link">
//             Sibling Mapping
//           </NavDropdown.Item>
//           <NavDropdown.Item className="text-sm custom-link">
//             Edit Student
//           </NavDropdown.Item>
//           <NavDropdown.Item className="text-sm custom-link">
//             Delete Student
//           </NavDropdown.Item>
//           <NavDropdown.Item
//             as={Link}
//             to="/myprofile"
//             className="text-sm custom-link"
//           >
//             User Profile
//           </NavDropdown.Item>
//         </NavDropdown>

//         {/* Certificate Sub-dropdown */}
//         <NavDropdown
//           className="dropend pr-0 mr-0 custom-sub-dropdown"
//           id="certificate-dropdown"
//           title={<span className="nav-dropdown-title">Certificate</span>}
//           style={{ color: "black", fontWeight: "700" }}
//         >
//           <NavDropdown.Item as={Link} to="#" className="text-sm custom-link">
//             Bonafide Certificate
//           </NavDropdown.Item>
//           <NavDropdown.Item as={Link} to="#" className="text-sm custom-link">
//             Caste Certificate
//           </NavDropdown.Item>
//           <NavDropdown.Item as={Link} to="#" className="text-sm custom-link">
//             Character Certificate
//           </NavDropdown.Item>
//           <NavDropdown.Item as={Link} to="#" className="text-sm custom-link">
//             Percentage Certificate
//           </NavDropdown.Item>
//           <NavDropdown.Item as={Link} to="#" className="text-sm custom-link">
//             Simple Bonafide Certificate
//           </NavDropdown.Item>
//         </NavDropdown>

//         {/* Staff Sub-dropdown */}
//         <NavDropdown
//           className="dropend pr-0 mr-0 custom-sub-dropdown"
//           id="staff-dropdown"
//           title={<span className="nav-dropdown-title">Staff</span>}
//           style={{ color: "black", fontWeight: "700" }}
//         >
//           <NavDropdown.Item
//             as={Link}
//             to="/StaffList"
//             className="text-sm custom-link"
//           >
//             Staff List
//           </NavDropdown.Item>
//           <NavDropdown.Item as={Link} to="#" className="text-sm custom-link">
//             Manage Caretaker
//           </NavDropdown.Item>
//           <NavDropdown.Item as={Link} to="#" className="text-sm custom-link">
//             Substitute Teacher
//           </NavDropdown.Item>
//         </NavDropdown>

//         {/* Other dropdowns */}
//         {/* Add similar sub-dropdown styles for other NavDropdowns as needed */}
//       </NavDropdown>
//     </>
//   );
// };

// export default AdminNavBar;
