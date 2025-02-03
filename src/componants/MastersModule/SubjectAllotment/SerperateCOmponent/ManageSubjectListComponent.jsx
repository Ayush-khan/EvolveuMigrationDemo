// import React, { useState } from "react";
// import AllotSubjectTab from "../AllotSubjectTab.jsx";
// import AllotTeachersForClassTab from "./AllotTeachersForClassTab.jsx";
// import AllotTeachersTab from "../AllotTeachersTab.jsx";
// import EditModal from "./EditModal.jsx";

// const MainComponent = () => {
//   const [activeTab, setActiveTab] = useState("AllotSubjectTab");

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "AllotSubjectTab":
//         return <AllotSubjectTab /* Pass props as needed */ />;
//       case "AllotTeachersForClassTab":
//         return <AllotTeachersForClassTab />;
//       case "AllotTeachersTab":
//         return <AllotTeachersTab />;
//       default:
//         return <AllotSubjectTab />;
//     }
//   };

//   return (
//     <div>
//       <ul className="nav nav-tabs">
//         <li className="nav-item">
//           <button
//             className={`nav-link ${
//               activeTab === "AllotSubjectTab" && "active"
//             }`}
//             onClick={() => setActiveTab("AllotSubjectTab")}
//           >
//             Allot Subject
//           </button>
//         </li>
//         <li className="nav-item">
//           <button
//             className={`nav-link ${
//               activeTab === "AllotTeachersForClassTab" && "active"
//             }`}
//             onClick={() => setActiveTab("AllotTeachersForClassTab")}
//           >
//             Allot Teachers for Class
//           </button>
//         </li>
//         <li className="nav-item">
//           <button
//             className={`nav-link ${
//               activeTab === "AllotTeachersTab" && "active"
//             }`}
//             onClick={() => setActiveTab("AllotTeachersTab")}
//           >
//             Allot Teachers
//           </button>
//         </li>
//       </ul>
//       <div className="tab-content">{renderTabContent()}</div>
//       <EditModal /* Pass props as needed */ />
//     </div>
//   );
// };

// export default MainComponent;
