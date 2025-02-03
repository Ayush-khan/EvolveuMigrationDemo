// // //this is responsive
import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";
import styles from "../CSS/LoginParent.module.css";
import Notification from "./Notification";
import { IoArrowUndoCircle } from "react-icons/io5";

const LandingPage = () => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const showNotificationPage = () => {
    navigate("/notification");
  };

  return (
    <div className={styles.loginContainer}>
      <div
        className={`${styles.loginContainerChild} bg-none lg:h-5/6 lg:flex lg:justify-start`}
      >
        <LoginForm />
        {isMobileView && (
          <button
            className={`${styles.notificationButton}  flex justify-between`}
            onClick={showNotificationPage}
          >
            <span>
              <IoArrowUndoCircle fontSize={"1.5em"} />
            </span>{" "}
            Gerneral Instruction
          </button>
        )}
      </div>
      {!isMobileView && (
        <div
          className={`${styles.notificationContainer}  flex lg:justify-end lg:w-full lg:h-5/6`}
        >
          <Notification />
        </div>
      )}
    </div>
  );
};

export default LandingPage;
