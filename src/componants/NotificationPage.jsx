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
        className={`${styles.closeButton}  float-right fixed top-4 right-2 z-10  `}
        onClick={closeNotificationPage}
      >
        <MdCancel fontSize={"1.9em"} fill="white" />
      </button>
    </div>
  );
};

export default NotificationPage;
