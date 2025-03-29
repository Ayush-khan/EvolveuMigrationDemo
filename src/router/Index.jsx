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
//         element={<PrivateRoute element={<CreateStudent/>} />}
//       />
//       <Route
//         path="/student-list"
//         element={<PrivateRoute element={<StudentList/>} />}
//       />
//       <Route
//         path="/student/:id/edit"
//         element={<PrivateRoute element={<StudentEdit/>} />}
//       />
//       <Route
//         path="/student-demo-table"
//         element={<PrivateRoute element={<DemoTable/>} />}
//       />
//       <Route path="/eventcard" element={<PrivateRoute element={<EventCard/>} />} />
//       <Route
//         path="/dashboard"
//         element={<PrivateRoute element={<AdminDashboard/>} />}
//       />

//       <Route path="/navbar" element={<PrivateRoute element={<NavBar/>} />} />
//       <Route
//         path="/myprofile"
//         element={<PrivateRoute element={<UserProfile/>} />}
//       />

//       {/* Nikhil bhai pages */}
//       <Route path="/classlist" element={<PrivateRoute element={<ClassList/>} />} />
//       <Route path="/sections" element={<PrivateRoute element={<Sections/>} />} />
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
//         element={<PrivateRoute element={<TickitingCountList/>} />}
//       />
//       <Route
//         path="/feependinglist"
//         element={<PrivateRoute element={<FeePendingList/>} />}
//       />
//       <Route
//         path="/staffbirthlist"
//         element={<PrivateRoute element={<StaffBirthdayTabList/>} />}
//       />
//       {/* Page Not FOund Routes */}
//       <Route path="*" element={<PrivateRoute element={<PageNotFounde/>} />} />
//     </Routes>
//   );
// }

// export default Index;

// // second outlet used try

import { Route, Router, Routes } from "react-router-dom";
import CreateStudent from "../componants/StudentModel/CreateStudent.jsx";
import StudentList from "../componants/StudentList";
import DemoTable from "../componants/DemoTable";
import StudentEdit from "../componants/StudentEdit.jsx";
import Login from "../componants/LoginForm";
import NavBar from "../Layouts/NavBar";
import UserProfile from "../componants/UserProfile";
import LandingPage from "../componants/LandingPage";
import AdminDashboard from "../componants/Dashbord/AdminDashboard";
import EventCard from "../componants/Dashbord/EventCard";
import NoticeBord from "../componants/Dashbord/NoticeBord";

import StudentsChart from "../componants/Dashbord/Charts/StudentsChart";
import PrivateRoute from "../utils/PrivateRoute";
import ClassList from "../componants/MastersModule/ClassList/ClassList.jsx";
import Sections from "../componants/MastersModule/Section/Sections.jsx";
import NotificationPage from "../componants/NotificationPage";
import StaffBirthdayTabList from "../componants/AllTableList/StaffBirthdayTabList";
import TickitingCountList from "../componants/AllTableList/TickitingCountList";
import FeePendingList from "../componants/AllTableList/FeePendingList.jsx";
import ChangePassword from "../componants/ChangePassword.jsx";
import MainLayout from "../Layouts/MainLayout";
import PageNotFounde from "./PageNotFound.jsx";
import StaffList from "../componants/StaffComponents/StaffList.jsx";
import CreateStaff from "../componants/StaffComponents/CreateStaff.jsx";
import EditStaff from "../componants/StaffComponents/EditStaff.jsx";
import ViewStaff from "../componants/StaffComponents/ViewStaff.jsx";
import ShowRolesWithMenu from "../componants/RoleMangement/ShowRolesWithMenu.jsx";
import Roles from "../componants/RoleMangement/Roles.jsx";
import ManageRoleAccess from "../componants/RoleMangement/ManageRoleAccess.jsx";
import Menus from "../componants/RoleMangement/Menus.jsx";
import DivisionList from "../componants/MastersModule/Division/DivisionLIst.jsx";
import SubjectList from "../componants/MastersModule/Subject/SubjectList.jsx";
import ManageSubjectList from "../componants/MastersModule/SubjectAllotment/ManageSubjectList.jsx";
import ManageStudent from "../componants/StudentModel/ManageStudent.jsx";
import ViewStudent from "../componants/StudentModel/ViewStudent.jsx";
import SubjectAllotmentForReportCard from "../componants/SubjectAllotmentForReportCard.jsx/SubjectAllotmentForReportCard.jsx";
import SubjectForRc from "../componants/SubjectForRCard/SubjectForRc.jsx";
import NewStudentList from "../componants/StudentModel/NewStudentList.jsx";
import EditOfNewStudentList from "../componants/StudentModel/EditOfNewStudentList.jsx";
import AllotClassTeacher from "../componants/AllotClassTeacher/AllotClassTeacher.jsx";
import Exam from "../componants/Exam/Exam.jsx";
import Grade from "../componants/Grade/Grade.jsx";
import MarksHeading from "../componants/MarksHeading/MarksHeading.jsx";
import AllotMarksHeading from "../componants/AllotMarkHeading/AllotMaekHeading.jsx";
import CareTacker from "../componants/CareTacker/CareTacker.jsx";
import CreateCareTacker from "../componants/CareTacker/CreateCareTacker.jsx";
import EditCareTacker from "../componants/CareTacker/EditCareTacker.jsx";
import ViewCareTacker from "../componants/CareTacker/ViewCareTacker.jsx";
import BonafiedCertificates from "../componants/Certificates/BonafiedCertificate/BonafiedCertificates.jsx";
import SImpleBonafied from "../componants/Certificates/SimpleBonafied/SImpleBonafied.jsx";
import CastCertificate from "../componants/Certificates/CastCertificate/CastCertificate.jsx";
import CharacterCertificate from "../componants/Certificates/CharaterCertificates/CharacterCertificate.jsx";
import PercentageCertificate from "../componants/Certificates/PercentageCertificate/PercentageCertificate.jsx";
// import LeavingCertificate from "../componants/LeavingCertificate/LeavingCertificate.jsx";
import ManageLC from "../componants/LeavingCertificate/ManageLC.jsx";
import EditLeavingCertificate from "../componants/LeavingCertificate/EditLeavingCertificate.jsx";
import EditBonafied from "../componants/Certificates/BonafiedCertificate/EditBonafied.jsx";
import EditCastCertificate from "../componants/Certificates/CastCertificate/EditCastCertificate.jsx";
import EditCharacter from "../componants/Certificates/CharaterCertificates/EditCharacter.jsx";
import EditSimpleBonafied from "../componants/Certificates/SimpleBonafied/EditSimpleBonafied.jsx";
import EditPercentage from "../componants/Certificates/PercentageCertificate/EditPercentage.jsx";
import ManageLCStudent from "../componants/LCStudent/ManageLCStudent.jsx";
import ViewStudentLC from "../componants/LCStudent/ViewStudentLC.jsx";
import DeleteStudent from "../componants/DeleteStudent/DeleteStudent.jsx";
import ViewDeletedStudent from "../componants/DeleteStudent/ViewDeletedStudent.jsx";
import EditLCforDeleteStudent from "../componants/DeleteStudent/EditLCforDeleteStudent.jsx";
import LeavingCertificate from "../componants/LeavingCertificate/LeavingCertificate.jsx";
import NoticeAndSms from "../componants/NoticeAndSms/NoticeAndSms.jsx";
import ExamTImeTable from "../componants/MastersModule/ExamTimeTable/ExamTImeTable.jsx";
import CreateExamTimeTable from "../componants/MastersModule/ExamTimeTable/CreateExamTimeTable.jsx";
import EditExamTimeTable from "../componants/MastersModule/ExamTimeTable/EditExamTimeTable.jsx";
import ViewExamTimeTable from "../componants/MastersModule/ExamTimeTable/ViewExamTimeTable.jsx";
import SubstituteTeacher from "../componants/SubstituteTeacher/SubstituteTeacher.jsx";
import EditSubstituteTeacher from "../componants/SubstituteTeacher/EditSubstituteTeacher.jsx";
import SetLateTime from "../componants/SetLateTime/SetLateTime.jsx";
import PromotedStudent from "../componants/StudentModel/PromotedStudent/PromotedStudent.jsx";
import SendUserIdToParent from "../componants/SendUserIdToParent/SendUserIdToParent.jsx";
import LeaveAllocation from "../componants/Leave/LeaveAllocation.jsx";
import LeaveApplication from "../componants/LeaveApplications/LeaveApplication.jsx";
import CreateLeaveApplication from "../componants/LeaveApplications/CreateLeaveApplication.jsx";
import EditLeaveApplication from "../componants/LeaveApplications/EditLeaveApplication.jsx";
import ViewLeaveApplication from "../componants/LeaveApplications/ViewLeaveApplication.jsx";
import LeaveAllocationtoAllStaff from "../componants/LeaveApplications/LeaveAllocationtoAllStaff.jsx";
import SiblingMapping from "../componants/SiblingMapping/SiblingMapping.jsx";
import SubjectAllotmentHSC from "../componants/MastersModule/SubjectAllotmentForHSC/SubjectAllotmentHSC.jsx";
import LeaveType from "../componants/LeaveType/LeaveType.jsx";
import CategoryReligion from "../componants/CategoryReligion/CategoryReligion.jsx";
import AllotGRNumbers from "../componants/AllotGRNumber/AllotGRNumbers.jsx";
import UpdateStudentID from "../componants/UpdateStudentID/UpdateStudentID.jsx";
import StudentSearchUsingGRN from "../componants/StudentSearchUsingGRN/StudentSearchUsingGRN.jsx";
import HolidayList from "../componants/HolidayList/HolidayList.jsx";
import StudentIdCard from "../componants/IDCards/StudentIdCard.jsx";
import TeacherIdCard from "../componants/IDCards/TeacherIdCard.jsx";
import TimeTable from "../componants/TimeTableModule/TimeTable.jsx";
import CreateTimeTable from "../componants/TimeTableModule/CreateTimeTable.jsx";
import IDCardDetails from "../componants/IDCards/IDCardDetails.jsx";
import ListAdmFrmRep from "../componants/Reports/ListAdmFrmRep.jsx";
import Balanceleave from "../componants/Reports/Balanceleave.jsx";
import ConsolidatedLeave from "../componants/Reports/ConsolidatedLeave.jsx";
import StudentReport from "../componants/Reports/StudentReport.jsx";
import StudentContactDetailsReport from "../componants/Reports/StudentContactDetailsReport.jsx";
import PendingStudentId from "../componants/IDCards/PendingStudentId.jsx";
import CatWiseStudRepo from "../componants/Reports/CatWiseStudRepo.jsx";
import RelgWiseStudRepo from "../componants/Reports/RelgWiseStudRepo.jsx";
import GendrWiseStudRepo from "../componants/Reports/GendrWiseStudRepo.jsx";
import StudentRemarkReport from "../componants/Reports/StudentRemarkReport.jsx";
import GenWiseCatRepo from "../componants/Reports/GenWiseCatRepo.jsx";
import GenWiseRelignRepo from "../componants/Reports/GenWiseRelignRepo.jsx";
import NewStudentsRepo from "../componants/Reports/NewStudentsRepo.jsx";
import LeftStudentsRepo from "../componants/Reports/LeftStudentsRepo.jsx";
import FeesPaymentReport from "../componants/Reports/FeesPaymentReport.jsx";
import StaffReport from "../componants/Reports/StaffReport.jsx";
import HSCStudentsSubjectsReport from "../componants/Reports/HSCStudentsSubjectsReport.jsx";
import WorldlineFeePaymentReport from "../componants/Reports/WorldlineFeePaymentReport.jsx";
import RazorpayFeePaymentReport from "../componants/Reports/RazorpayFeePaymentReport.jsx";
import SubstituteTeacherMonthlyReport from "../componants/Reports/SubstituteTeacherMonthlyReport.jsx";
import SubstitutionWeeklyHoursReport from "../componants/Reports/SubstitutionWeeklyHoursReport.jsx";
import LeavingCertificateReport from "../componants/Reports/LeavingCertificateReport.jsx";
import PendingStudentIdCardReport from "../componants/Reports/PendingStudentIdCardReport.jsx";
// import Menus from "../c";
function Index() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/notification" element={<NotificationPage />} />
      <Route path="/" element={<MainLayout />}>
        {/* Role Management */}
        <Route path="/menus" element={<PrivateRoute element={<Menus />} />} />
        <Route path="/roles" element={<PrivateRoute element={<Roles />} />} />
        <Route
          path="/show_roles"
          element={<PrivateRoute element={<ShowRolesWithMenu />} />}
        />
        <Route
          path="//manage-role-access/:roleId"
          element={<PrivateRoute element={<ManageRoleAccess />} />}
        />
        {/* <Route
          path="/TestForAllfunctionlity"
          // path="#"
          element={<PrivateRoute element={<TestForAllfunctionlity/>} />}
        /> */}
        <Route
          path="/student-create"
          element={<PrivateRoute element={<CreateStudent />} />}
        />
        <Route
          path="/student-list"
          element={<PrivateRoute element={<StudentList />} />}
        />
        <Route
          path="/student/:id/edit"
          element={<PrivateRoute element={<StudentEdit />} />}
        />
        <Route
          path="/student-demo-table"
          element={<PrivateRoute element={<DemoTable />} />}
        />
        {/* All Certificates  */}
        <Route
          path="/bonafiedCertificates"
          // path="#"
          element={<PrivateRoute element={<BonafiedCertificates />} />}
        />
        <Route
          path="/bonafied/edit/:id"
          // path="#"
          element={<PrivateRoute element={<EditBonafied />} />}
        />
        {/* Cast certificate fsd */}
        <Route
          path="/castCertificate"
          // path="#"
          element={<PrivateRoute element={<CastCertificate />} />}
        />
        <Route
          path="/studentCast/edit/:id"
          // path="#"
          element={<PrivateRoute element={<EditCastCertificate />} />}
        />
        <Route
          path="/percentageCertificate"
          // path="#"
          element={<PrivateRoute element={<PercentageCertificate />} />}
        />
        <Route
          path="/stud_Percent/edit/:id"
          // path="#"
          element={<PrivateRoute element={<EditPercentage />} />}
        />
        {/* CharacterCertifiacte */}
        <Route
          path="/characterCertificate"
          // path="#"
          element={<PrivateRoute element={<CharacterCertificate />} />}
        />
        <Route
          path="/stud_Char/edit/:id"
          // path="#"
          element={<PrivateRoute element={<EditCharacter />} />}
        />
        {/* Simple Bonafied */}
        <Route
          path="/simpleBonafied"
          // path="#"
          element={<PrivateRoute element={<SImpleBonafied />} />}
        />
        <Route
          path="/sm_Bonafied/edit/:id"
          // path="#"
          element={<PrivateRoute element={<EditSimpleBonafied />} />}
        />
        {/* LC Student */}
        <Route
          path="/leavingCertificate"
          // path="#"
          element={<PrivateRoute element={<ManageLC />} />}
        />
        <Route
          path="/studentLC/view/:id"
          // path="#"
          element={<PrivateRoute element={<ViewStudentLC />} />}
        />
        {/* Deleted Student Module */}
        {/* LC Student */}
        <Route
          path="/manageStudentLC"
          // path="#"
          element={<PrivateRoute element={<ManageLCStudent />} />}
        />
        {/* leaving_certificate */}
        <Route
          path="/deleteStudent"
          // path="#"
          element={<PrivateRoute element={<DeleteStudent />} />}
        />
        <Route
          path="/deletedStudent/view/:id"
          // path="#"
          element={<PrivateRoute element={<ViewDeletedStudent />} />}
        />
        <Route
          path="/deletedStudent/edit/:id"
          // path="#"
          element={<PrivateRoute element={<EditLCforDeleteStudent />} />}
        />
        {/* <Route
          path="/student/edit/:id"
          element={<PrivateRoute element={<CreateStudent/>} />}
        /> */}
        <Route
          path="/studentLC/edit/:id"
          // path="#"
          element={<PrivateRoute element={<EditLeavingCertificate />} />}
        />
        {/* Promote Student Module */}
        <Route
          path="/PromoteStudent"
          // path="#"
          element={<PrivateRoute element={<PromotedStudent />} />}
        />
        {/* SendUserIdToParent Module */}
        <Route
          path="/SendUserIdToParent"
          // path="#"

          element={<PrivateRoute element={<SendUserIdToParent />} />}
        />
        {/* Sibling Mapping Module */}
        <Route
          path="/SiblingMapping"
          element={<PrivateRoute element={<SiblingMapping />} />}
        />
        {/* Staff endPoints */}
        <Route
          path="/StaffList"
          element={<PrivateRoute element={<StaffList />} />}
        />
        <Route
          path="/CreateStaff"
          element={<PrivateRoute element={<CreateStaff />} />}
        />
        <Route
          path="/staff/edit/:id"
          element={<PrivateRoute element={<EditStaff />} />}
        />
        <Route
          path="/staff/view/:id"
          element={<PrivateRoute element={<ViewStaff />} />}
        />
        {/* Leave Type */}
        <Route
          path="/leavetype"
          element={<PrivateRoute element={<LeaveType />} />}
        />
        {/* LeaveAllocation */}
        <Route
          path="/LeaveAllocation"
          element={<PrivateRoute element={<LeaveAllocation />} />}
        />
        {/* Leave applications */}
        <Route
          path="/LeaveApplication"
          element={<PrivateRoute element={<LeaveApplication />} />}
        />
        <Route
          path="/createLeaveApplication"
          element={<PrivateRoute element={<CreateLeaveApplication />} />}
        />
        <Route
          path="/leaveApplication/edit/:id"
          element={<PrivateRoute element={<EditLeaveApplication />} />}
        />
        <Route
          path="/leaveApplication/view/:id"
          element={<PrivateRoute element={<ViewLeaveApplication />} />}
        />
        <Route
          path="/leaveAllocationtoAllStaff"
          element={<PrivateRoute element={<LeaveAllocationtoAllStaff />} />}
        />
        {/* Substitute Teacher */}
        <Route
          path="/SubstituteTeacher"
          element={<PrivateRoute element={<SubstituteTeacher />} />}
        />
        <Route
          path="/substitute/edit/:id"
          element={<PrivateRoute element={<EditSubstituteTeacher />} />}
        />
        {/*  Notice And Sms Module */}
        <Route
          path="/noticeAndSms"
          element={<PrivateRoute element={<NoticeAndSms />} />}
        />
        {/* Holiday List module */}
        <Route
          path="/holidayList"
          element={<PrivateRoute element={<HolidayList />} />}
        />
        {/* CareTacker */}
        <Route
          path="/careTacker"
          element={<PrivateRoute element={<CareTacker />} />}
        />
        <Route
          path="/CreateCareTacker"
          element={<PrivateRoute element={<CreateCareTacker />} />}
        />
        <Route
          path="/CareTacker/edit/:id"
          element={<PrivateRoute element={<EditCareTacker />} />}
        />
        <Route
          path="/CareTacker/view/:id"
          element={<PrivateRoute element={<ViewCareTacker />} />}
        />
        {/* Set Late Time module */}
        <Route
          path="/SetLateTime"
          element={<PrivateRoute element={<SetLateTime />} />}
        />
        <Route
          path="/eventcard"
          element={<PrivateRoute element={<EventCard />} />}
        />
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<AdminDashboard />} />}
        />
        <Route
          path="/myprofile"
          element={<PrivateRoute element={<UserProfile />} />}
        />
        <Route
          path="/classes"
          element={<PrivateRoute element={<ClassList />} />}
        />
        {/* Division module */}
        <Route
          path="/division"
          element={<PrivateRoute element={<DivisionList />} />}
        />
        {/* Division module */}
        <Route
          path="/subjects"
          element={<PrivateRoute element={<SubjectList />} />}
        />
        {/* SubjectAllotment module */}
        <Route
          path="/subject_allotment"
          element={<PrivateRoute element={<ManageSubjectList />} />}
        />
        {/* Subject Allotment for HSC */}
        <Route
          path="/SubjectAllotmentHSC"
          element={<PrivateRoute element={<SubjectAllotmentHSC />} />}
        />
        {/* SubjectForReportCard module */}
        <Route
          path="/subjectforReportcard"
          element={<PrivateRoute element={<SubjectForRc />} />}
        />
        {/* SubjectAllotmentForReportCard module */}
        <Route
          path="/managesubjectforreportcard"
          element={<PrivateRoute element={<SubjectAllotmentForReportCard />} />}
        />
        {/* Student module */}
        <Route
          path="/manageStudent"
          element={<PrivateRoute element={<ManageStudent />} />}
        />
        <Route
          path="/newStudentList"
          element={<PrivateRoute element={<NewStudentList />} />}
        />
        {/* <Route
          path="/student-create"
          element={<PrivateRoute element={<CreateStudent/>} />}
        /> */}
        <Route
          path="/student/edit/:id"
          element={<PrivateRoute element={<CreateStudent />} />}
        />
        <Route
          path="/student/view/:id"
          element={<PrivateRoute element={<ViewStudent />} />}
        />
        <Route
          path="/newStudetEdit/edit/:id"
          element={<PrivateRoute element={<EditOfNewStudentList />} />}
        />
        {/* AllotClassTeacher */}
        <Route
          path="/allotClassTeacher"
          element={<PrivateRoute element={<AllotClassTeacher />} />}
        />
        {/* Allot GR Number Module */}
        <Route
          path="/allotGRNumber"
          element={<PrivateRoute element={<AllotGRNumbers />} />}
        />
        {/* StudentSearchUsingGRN in the navbar */}
        <Route
          path="/StudentSearchUsingGRN"
          element={<PrivateRoute element={<StudentSearchUsingGRN />} />}
        />
        {/* UpdateStudentID Module */}
        <Route
          path="/updateStudentID"
          element={<PrivateRoute element={<UpdateStudentID />} />}
        />
        {/* TimeTable Module */}
        <Route
          path="/timeTable"
          element={<PrivateRoute element={<TimeTable />} />}
        />
        {/* Create TimeTable Module */}
        <Route
          path="/createTimeTable"
          element={<PrivateRoute element={<CreateTimeTable />} />}
        />
        {/*Update CategoryReligion Module */}
        <Route
          path="/categoryReligion"
          element={<PrivateRoute element={<CategoryReligion />} />}
        />
        {/* ExamMdule */}
        <Route path="/exams" element={<PrivateRoute element={<Exam />} />} />
        {/* Grade Module */}
        <Route path="/grades" element={<PrivateRoute element={<Grade />} />} />
        {/* MarksHeading Moudle */}
        <Route
          path="/marksHeading"
          element={<PrivateRoute element={<MarksHeading />} />}
        />
        {/* AllotMarksHeading module */}
        <Route
          path="/allot_Marks_Heading"
          element={<PrivateRoute element={<AllotMarksHeading />} />}
        />
        {/* Exam Time Table */}
        <Route
          path="/exam_TImeTable"
          element={<PrivateRoute element={<ExamTImeTable />} />}
        />
        <Route
          path="/creaExamTimeTable"
          element={<PrivateRoute element={<CreateExamTimeTable />} />}
        />
        <Route
          path="/examTimeTable/edit/:id"
          element={<PrivateRoute element={<EditExamTimeTable />} />}
        />
        <Route
          path="/examTimeTable/view/:id"
          element={<PrivateRoute element={<ViewExamTimeTable />} />}
        />
        <Route
          path="/sections"
          element={<PrivateRoute element={<Sections />} />}
        />
        {/* Id Cards Module */}
        {/* Student Id Card Module */}
        <Route
          path="/studentIdCard"
          element={<PrivateRoute element={<StudentIdCard />} />}
        />
        {/* Teacher ID Card Module */}
        <Route
          path="/teacherIdCard"
          element={<PrivateRoute element={<TeacherIdCard />} />}
        />
        {/* Pending StudentID Card Module */}
        <Route
          path="/pendingStudentId"
          element={<PrivateRoute element={<PendingStudentId />} />}
        />
        {/* Id Card Details */}

        <Route
          path="/iDCardDetails/:id"
          element={<PrivateRoute element={<IDCardDetails />} />}
        />
        {/* List Of Admission Form Reports */}
        <Route
          path="/listAdmFrmRep"
          element={<PrivateRoute element={<ListAdmFrmRep />} />}
        />
        {/* Balance Leave Module */}
        <Route
          path="/balanceleave"
          element={<PrivateRoute element={<Balanceleave />} />}
        />
        {/* Consolidated Leave Report Module */}
        <Route
          path="/consolidatedLeave"
          element={<PrivateRoute element={<ConsolidatedLeave />} />}
        />
        {/* Student Report Module */}
        <Route
          path="/studentReport"
          element={<PrivateRoute element={<StudentReport />} />}
        />
        {/* Student Report Module */}
        <Route
          path="/studentContactDetailsReport"
          element={<PrivateRoute element={<StudentContactDetailsReport />} />}
        />
        {/* Student Categorywise  Report Module */}
        <Route
          path="/catWiseStudRepo"
          element={<PrivateRoute element={<CatWiseStudRepo />} />}
        />
        {/* Student Religion Wise  Report Module */}
        <Route
          path="/relgWiseStudRepo"
          element={<PrivateRoute element={<RelgWiseStudRepo />} />}
        />
        {/* Student GenWiseRelignRepo Report Module */}
        <Route
          path="/genWiseRelignRepo"
          element={<PrivateRoute element={<GenWiseRelignRepo />} />}
        />
        {/* Student Gender Wise  Report Module */}
        <Route
          path="/gendrWiseStudRepo"
          element={<PrivateRoute element={<GendrWiseStudRepo />} />}
        />
        {/* Student StudentRemarkReport  Module */}
        <Route
          path="/studentRemarkReport"
          element={<PrivateRoute element={<StudentRemarkReport />} />}
        />
        {/* Student Gender Wise  Report Module */}
        <Route
          path="/genWiseCatRepo"
          element={<PrivateRoute element={<GenWiseCatRepo />} />}
        />
        {/* Student Gender Wise  Report Module */}
        <Route
          path="/newStudentsRepo"
          element={<PrivateRoute element={<NewStudentsRepo />} />}
        />
        {/* Student Gender Wise  Report Module */}
        <Route
          path="/leftStudentsRepo"
          element={<PrivateRoute element={<LeftStudentsRepo />} />}
        />
        {/* Staff Report Module */}
        <Route
          path="/staffReport"
          element={<PrivateRoute element={<StaffReport />} />}
        />
        {/* Student Gender Wise  Report Module */}
        <Route
          path="/hSCStudSubjectsRepo"
          element={<PrivateRoute element={<HSCStudentsSubjectsReport />} />}
        />

        {/* Fee payment report module */}
        <Route
          path="/feePaymentRepo"
          element={<PrivateRoute element={<FeesPaymentReport />} />}
        />
        {/* Worldline Fee Payment Report  module */}
        <Route
          path="/worldlinfeePayRepo"
          element={<PrivateRoute element={<WorldlineFeePaymentReport />} />}
        />
        {/* Razorpay Fee Payment Reportmodule */}
        <Route
          path="/rozorpayfeePayRepo"
          element={<PrivateRoute element={<RazorpayFeePaymentReport />} />}
        />
        {/* Substitute Teacher Monthly Report Reportmodule */}
        <Route
          path="/SubsTeaMonthlyRepo"
          element={
            <PrivateRoute element={<SubstituteTeacherMonthlyReport />} />
          }
        />
        {/* Substitution Weekly Hours Report Report Reportmodule */}
        <Route
          path="/SubsWklyHrsRepo"
          element={<PrivateRoute element={<SubstitutionWeeklyHoursReport />} />}
        />
        {/* Leaving certificate Report Report Reportmodule */}
        <Route
          path="/LeavCertifRepo"
          element={<PrivateRoute element={<LeavingCertificateReport />} />}
        />
        {/* PendingStudentIdcard Report Reportmodule */}
        <Route
          path="/PndingStudIdCrdRepo"
          element={<PrivateRoute element={<PendingStudentIdCardReport />} />}
        />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route
          path="/ticktinglist"
          element={<PrivateRoute element={<TickitingCountList />} />}
        />
        <Route
          path="/feependinglist"
          element={<PrivateRoute element={<FeePendingList />} />}
        />
        <Route
          path="/staffbirthlist"
          element={<PrivateRoute element={<StaffBirthdayTabList />} />}
        />
      </Route>
      {/* Page Not FOund Routes */}
      <Route path="*" element={<PrivateRoute element={<PageNotFounde />} />} />
    </Routes>
  );
}

export default Index;
