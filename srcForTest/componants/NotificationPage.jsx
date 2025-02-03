// // // reesponsvie paeg
// import { useNavigate } from "react-router-dom";
// import { Notification } from "./Notification";
// import styles from "../CSS/Notification.module.css";

// const NotificationPage = () => {
//   const navigate = useNavigate();

//   const closeNotificationPage = () => {
//     navigate("/");
//   };

//   return (
//     <div className={styles.notificationPage}>
//       <Notification />
//       <button className={styles.closeButton} onClick={closeNotificationPage}>
//         Close
//       </button>
//     </div>
//   );
// };

// export default NotificationPage;

// this is
// import React, { useState, useEffect } from "react";
// import LoginForm from "./LoginForm";
// import styles from "../CSS/LoginParent.module.css";
// import { useNavigate } from "react-router-dom";
// import Notification from "./Notification";
// const LandingPage = () => {
//   const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobileView(window.innerWidth <= 768);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   const showNotificationPage = () => {
//     navigate("/notification");
//   };

//   return (
//     <div className={styles.loginContainer}>
//       <div className={styles.loginContainerChild}>
//         <LoginForm />
//         {isMobileView && (
//           <button
//             className={styles.notificationButton}
//             onClick={showNotificationPage}
//           >
//             Notification
//           </button>
//         )}
//       </div>
//       {!isMobileView && (
//         <div className={styles.notificationContainer}>
//           <Notification />
//         </div>
//       )}
//     </div>
//   );
// };

// export default LandingPage;

import React from "react";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";
import styles from "../CSS/LoginParent.module.css";
import { MdCancel } from "react-icons/md";
const NotificationPage = () => {
  const navigate = useNavigate();

  const closeNotificationPage = () => {
    navigate("/");
  };

  return (
    <div className={`${styles.notificationPage} flex bg-slate-50   `}>
      <Notification />
      <button
        className={`${styles.closeButton} fixed top-4 left-80 z-10  `}
        onClick={closeNotificationPage}
      >
        <MdCancel fontSize={"1.9em"} fill="white" />
      </button>
    </div>
  );
};

export default NotificationPage;
