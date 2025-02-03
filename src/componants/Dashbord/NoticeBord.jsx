import React, { useState, useEffect } from "react";
import axios from "axios";
import Styles from "../../CSS/DashbordCss/NoticeBord.module.css";

function NoticeBord() {
  const API_URL = import.meta.env.VITE_API_URL; // url for host
  const [activeTab, setActiveTab] = useState("noticeForParents");
  const [parentNotices, setParentNotices] = useState([]);
  const [staffNotices, setStaffNotices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const academicYr = localStorage.getItem("academicYear");
        if (!token) {
          throw new Error("No authentication token  found");
        }

        // Fetch parent notices
        const parentResponse = await axios.get(
          `${API_URL}/api/parent-notices`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Academic-Year": academicYr,
            },
          }
        );
        setParentNotices(parentResponse.data.parent_notices);

        // Fetch staff notices
        const staffResponse = await axios.get(`${API_URL}/api/staff-notices`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Academic-Year": "2023-2024",
          },
        });
        setStaffNotices(staffResponse.data.notices);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching notices:", error);
      }
    };

    fetchNotices();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div
      className={`${Styles.container} bg-slate-100 px-2 rounded-lg shadow-md `}
    >
      <div
        className={` flex justify-between sm:mb-2  w-full  sm:flex flex-row mb-2`}
      >
        <button
          // style={{ width: "100%", height: "3em", fontSize: ".8em" }}
          className={`${Styles.tab} w-full h-1/4 text-sm font-bold  ${
            activeTab === "noticeForParents" ? Styles.active : ""
          } sm:mr-1 mx-0 sm:mb-0  p-2  text-sm sm:w-1/2`}
          onClick={() => handleTabChange("noticeForParents")}
        >
          Notice for Parents
        </button>
        <button
          // style={{ width: "100%", height: "3em", fontSize: ".8em" }}
          className={`${Styles.tab} w-full h-1/4 text-sm font-bold  ${
            activeTab === "noticeForStaff" ? Styles.active : ""
          } sm:mr-1 mx-0 sm:mb-0  p-2 text-sm sm:w-1/2`}
          onClick={() => handleTabChange("noticeForStaff")}
        >
          Notice for Staff
        </button>
      </div>

      <div className="overflow-y-auto max-h-64 ">
        {activeTab === "noticeForParents" && (
          <div className={`${Styles.noticeBoard} grid gap-2`}>
            {parentNotices.map((notice, index) => (
              <div
                key={index}
                className={`${Styles.notice}  sm:border-1 border-gray sm:px-3 sm:py-1 sm:leading-3 mb-0 sm:h-fit bg-white  box-border  rounded shadow-md `}
              >
                <div className={`${Styles.date}  text-xs mb-2 sm:mb-1`}>
                  {notice.notice_date}
                  <span className={`${Styles.time} float-right font-bold`}>
                    {notice.notice_type}
                  </span>
                </div>
                <div className={`${Styles.author} text-sm mb-2 sm:mb-1`}>
                  {notice.subject}
                  <span
                    className={`${Styles.time} ml-2 text-xs sm:mb-1`}
                  >{`( classes-${notice.class_name} )`}</span>
                </div>
                <div
                  className={`${Styles.message} text-sm leading-4 sm:leading-3 sm:mt-0`}
                >
                  {notice.notice_desc}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "noticeForStaff" && (
          <div className={`${Styles.noticeBoard} grid gap-2`}>
            {staffNotices.map((notice, index) => (
              <div
                key={index}
                className={`${Styles.notice} sm:p-4 rounded shadow-md`}
              >
                <div className={`${Styles.date} text-xs mb-2`}>
                  {notice.notice_date}
                  <span className={`${Styles.time} float-right font-bold`}>
                    {notice.notice_type}
                  </span>
                </div>
                <div className={`${Styles.author} text-sm mb-2`}>
                  {notice.subject}
                  <span
                    className={`${Styles.time} ml-2 text-xs`}
                  >{`( ${notice.staff_name} )`}</span>
                </div>
                <div className={`${Styles.message} text-sm leading-6`}>
                  {notice.notice_desc}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NoticeBord;
