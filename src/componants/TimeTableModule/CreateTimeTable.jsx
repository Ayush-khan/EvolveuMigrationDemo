import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { useMemo, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { RxCross1 } from "react-icons/rx";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
// import styles from "./CreateTimeTable.module.css";

const CreateTimeTable = () => {
  const API_URL = import.meta.env.VITE_API_URL; // Ensure this is correctly defined in your .env
  const [classesforForm, setClassesforForm] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [classError, setClassError] = useState("");
  const navigate = useNavigate();
  const [divisionforForm, setDivisionForForm] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [loadingDivision, setLoadingDivision] = useState(false);
  const [divisionError, setDivisionError] = useState("");
  const [selectedMonFri, setSelectedMonFri] = useState(null);
  const [selectedSat, setSelectedSat] = useState(null);
  const [monFriLectures, setMonFriLectures] = useState([]);
  const [satLectures, setSatLectures] = useState([]);
  const [loadingForSearch, setLoadingForSearch] = useState(false);
  const [classIdForSearch, setClassIdForSearch] = useState(null);
  const [sectionIdForSearch, setSectionIdForSearch] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const [lectureCount, setLectureCount] = useState(8); // Default value for Mon-Fri
  const [satLectureCount, setSatLectureCount] = useState(5); // Default for Sat
  const [showTimeTable, setShowTimeTable] = useState(false);
  const [openDropdown, setOpenDropdown] = useState({});

  //Fetch Subjects Data
  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Authorization token is missing. Please log in again.");
        return;
      }

      // Ensure classId and sectionId are selected
      if (!classIdForSearch || !sectionIdForSearch) {
        toast.warning("Please select a class and section first.");
        return;
      }

      // Updated API URL with dynamic class_id and section_id
      const response = await axios.get(
        `${API_URL}/api/get_subjectfortimetable?class_id=${classIdForSearch}&section_id=${sectionIdForSearch}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Subjects Response:", response.data); // Debug log

      if (response.data && response.data.data) {
        setSubjects(response.data.data); // Set subjects from API response
      } else {
        setSubjects([]); // Empty array if no subjects are returned
        toast.warning("No subjects available.");
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to fetch subjects. Please try again later.");
    } finally {
      setLoadingSubjects(false); // Ensure the loader state is updated
    }
  };

  useEffect(() => {
    fetchClasses();

    if (classIdForSearch && sectionIdForSearch) {
      fetchSubjects(); // No need to pass parameters, it uses state variables
    }
  }, [classIdForSearch, sectionIdForSearch]); // Runs when classIdForSearch OR sectionIdForSearch changes

  // Fetch Classes Data
  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/getClassList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data)) {
        setClassesforForm(response.data);
      } else {
        toast.error("Unexpected Data Format");
      }
    } catch (error) {
      toast.error("Error fetching classes");
      console.error("Error fetching classes", error);
    } finally {
      setLoadingClasses(false);
    }
  };

  // Fetch Divisions Data
  const fetchDivisions = async (classId) => {
    try {
      setLoadingDivision(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/get_divisions/${classId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Divisions API Response:", response.data); // Debug log

      // Check if the 'divisions' key exists and contains an array
      if (Array.isArray(response.data.divisions)) {
        setDivisionForForm(response.data.divisions); // Set divisions if valid
      } else {
        toast.error("Unexpected Data Format.");
        setDivisionForForm([]); // Fallback to empty array
      }
    } catch (error) {
      toast.error("Error fetching divisions");
      console.error("Error fetching divisions", error);
    } finally {
      setLoadingDivision(false);
    }
  };

  const handleClassSelect = (selectedOption) => {
    setSelectedClass(selectedOption);
    setClassError("");
    setSelectedDivision(null); // Reset division dropdown
    setDivisionForForm([]); // Clear division options
    setClassIdForSearch(selectedOption?.value);

    if (selectedOption) {
      fetchDivisions(selectedOption.value); // Fetch divisions for the selected class
    }
  };

  const handleDivisionSelect = (selectedOption) => {
    setSelectedDivision(selectedOption); // Ensure correct value is set
    setSectionIdForSearch(selectedOption?.value);
  };

  const classOptions = useMemo(
    () =>
      classesforForm.map((cls) => ({
        value: cls.class_id,
        label: cls.name,
      })),
    [classesforForm]
  );

  const divisionOptions = useMemo(() => {
    if (!Array.isArray(divisionforForm)) return [];
    return divisionforForm.map((div) => ({
      value: div.section_id, // Using 'section_id' as the value
      label: div.name, // Using 'name' as the label
    }));
  }, [divisionforForm]);

  // Generate Lectures Options
  const generateLectureOptions = (count) => {
    let options = [];
    for (let i = 1; i <= count; i++) {
      options.push({ value: `Lecture ${i}`, label: `Lecture ${i}` });
    }
    return options;
  };

  // generate for mon-fri lectures
  const handleMonFriSelect = (selectedOption) => {
    setSelectedMonFri(selectedOption);
    const numLectures = parseInt(selectedOption.value, 10);
    setMonFriLectures(
      Array.from({ length: numLectures }, (_, index) => index + 1)
    );
  };

  // generate for sat lectures
  const handleSatSelect = (selectedOption) => {
    setSelectedSat(selectedOption);
    const numLectures = parseInt(selectedOption.value, 10);
    setSatLectures(
      Array.from({ length: numLectures }, (_, index) => index + 1)
    );
  };

  const generateTimeSlots = (startHour = 8, endHour = 14, interval = 5) => {
    const slots = [];
    const startTime = startHour * 60;
    const endTime = endHour * 60;

    for (let time = startTime; time <= endTime; time += interval) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHour = hours > 12 ? hours - 12 : hours;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      slots.push(`${formattedHour}:${formattedMinutes} ${ampm}`);
    }

    return slots;
  };

  const getFilteredEndTimeOptions = (rowIndex) => {
    const startTime = timetable[rowIndex]?.startTime;
    if (startTime) {
      const startMinutes = convertToMinutes(startTime);
      return timeOptions.filter(
        (time) => convertToMinutes(time) > startMinutes
      );
    }
    return timeOptions;
  };

  const getFilteredSatEndTimeOptions = (rowIndex) => {
    const startTime = timetable[rowIndex]?.satStartTime;
    if (startTime) {
      const startMinutes = convertToMinutes(startTime);
      return satTimeOptions.filter(
        (time) => convertToMinutes(time) > startMinutes
      );
    }
    return satTimeOptions;
  };

  const timeOptions = generateTimeSlots();
  const satTimeOptions = generateTimeSlots(8, 11.5);

  const handleStartSelect = (dayIndex, lectureIndex, selectedTime) => {
    setTimetable((prevTimetable) => {
      // const updatedTimetable = [...prevTimetable];

      // updatedTimetable[dayIndex].lectures[lectureIndex]["Time In"] =
      //   selectedTime;
      const updatedTimetable = prevTimetable.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              lectures: day.lectures.map((lec, j) =>
                j === lectureIndex ? { ...lec, "Time In": selectedTime } : lec
              ),
            }
          : day
      );
      // return updatedTimetable;

      console.log("updatedTimeTable start select", updatedTimetable);

      return updatedTimetable;
    });
  };

  const handleEndSelect = (dayIndex, lectureIndex, selectedTime) => {
    setTimetable((prevTimetable) => {
      const updatedTimetable = [...prevTimetable];

      // Update the "Time Out" value for the selected day and lecture
      updatedTimetable[dayIndex].lectures[lectureIndex]["Time Out"] =
        selectedTime;

      console.log("updated time end select", updatedTimetable);

      return updatedTimetable;
    });
  };

  const handleSatStartSelect = (dayIndex, lectureIndex, selectedTime) => {
    setTimetable((prevTimetable) => {
      const updatedTimetable = [...prevTimetable];

      // Update the "Sat Time In" value for the selected Saturday lecture
      updatedTimetable[dayIndex].lectures[lectureIndex]["Sat Time In"] =
        selectedTime;

      console.log("updatedTimeTable sat start select", updatedTimetable);

      return updatedTimetable;
    });
  };

  const handleSatEndSelect = (dayIndex, lectureIndex, selectedTime) => {
    setTimetable((prevTimetable) => {
      const updatedTimetable = [...prevTimetable];

      // Update the "Sat Time Out" value for the selected Saturday lecture
      updatedTimetable[dayIndex].lectures[lectureIndex]["Sat Time Out"] =
        selectedTime;

      console.log("updatedTimeTable sat end select", updatedTimetable);

      return updatedTimetable;
    });
  };

  const toggleDropdown = (dayIndex, lectureIndex) => {
    setOpenDropdown((prev) => {
      // Check if the same dropdown is already open
      if (prev[dayIndex]?.[lectureIndex]) {
        return {}; // Close the dropdown if clicked again
      }
      // Open the new dropdown and close the previous one
      return { [dayIndex]: { [lectureIndex]: true } };
    });
  };

  const handleSubjectSelect = (dayIndex, lectureIndex, subject, isChecked) => {
    setSelectedSubjects((prev) => {
      const updated = { ...prev };
      if (!updated[dayIndex]) updated[dayIndex] = { lectures: [] };
      if (!updated[dayIndex].lectures[lectureIndex])
        updated[dayIndex].lectures[lectureIndex] = { subject: [] };

      console.log("selectted subject", updated);

      if (isChecked) {
        updated[dayIndex].lectures[lectureIndex].subject.push(subject);
      } else {
        updated[dayIndex].lectures[lectureIndex].subject = updated[
          dayIndex
        ].lectures[lectureIndex].subject.filter(
          (s) => s.sm_id !== subject.sm_id
        );
      }

      return { ...updated };
    });
  };

  const handleAddTimetable = async () => {
    if (!selectedClass) {
      toast.error("Please select Class");
      return;
    }
    if (!selectedDivision) {
      toast.error("Please select Division");
      return;
    }
    if (!selectedMonFri || !selectedSat) {
      toast.error("Please select both Mon-Fri and Sat lecture counts.");
      return;
    }

    const monFriLectureCount =
      parseInt(selectedMonFri.value.split(" ")[1]) || 0;
    const satLectureCount = parseInt(selectedSat.value.split(" ")[1]) || 0;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Authorization token is missing. Please log in again.");
        return;
      }

      const params = {
        lectures_per_week: monFriLectureCount,
        saturday_lectures: satLectureCount,
        class_id: selectedClass.value,
        section_id: selectedDivision.value,
      };

      console.log("Sending API request with params:", params);

      const response = await axios.get(
        `${API_URL}/api/get_fieldsfortimetable`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      console.log("API Response--->:", response.data.data);

      const timetableData = response.data.data || {}; // ✅ Prevent `undefined/null`

      if (response.data.success && timetableData) {
        setShowTimeTable(true);
        const formattedTimetable = Object.entries(timetableData || {}).map(
          ([day, lectures]) => ({
            day,
            lectures: Array.isArray(lectures) ? lectures : [],
          })
        );
        setTimetable(formattedTimetable);
        console.log("Final Timetable:", formattedTimetable);
        console.log("setTimeTable is--->", timetable);
        // ✅ Check if there are subjects
        const hasSubjects = formattedTimetable.some((entry) =>
          entry.lectures.some(
            (lecture) =>
              Array.isArray(lecture.subject) && lecture.subject.length > 0
          )
        );
        console.log("HasSubject--->", hasSubjects);
        if (!hasSubjects) {
          toast.warning("No subjects found. Please fill in the timetable.");
        } else {
          toast.success("Timetable loaded successfully!");
        }
      } else {
        setTimetable([]); // ✅ Ensure it's always an array
        toast.error("Invalid timetable data from API.");
      }
    } catch (error) {
      console.error("Error fetching timetable fields:", error);
      toast.error("Failed to fetch timetable fields. Please try again later.");
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Authorization token is missing. Please login again");
      return;
    }
    let timeIn;
    let timeOut;
    let satTimeIn;
    let satTimeOut;

    try {
      if (!selectedClass) {
        toast.error("Please select a class before submitting.");
        return;
      }

      console.log("Timetable Data:", JSON.stringify(timetable, null, 2));

      const monFriLectureCount =
        parseInt(selectedMonFri?.value?.split(" ")[1]) || 0;

      let timetableData = {
        class_id: selectedClass.value,
        section_id: selectedDivision.value,
        num_lec: monFriLectureCount,
      };
      console.log("TimeTable before Submit...", timetableData);
    timetable.forEach((day, dayIndex) => {
        day.lectures.forEach((lecture, index) => {
          let i = index + 1;

          console.log(
            `Checking before lecture structure for ${day.day}, Lecture ${i}:`,
            lecture
          );

          // Extract time values with a default fallback
          timeIn = lecture?.["Time In"];
          timeOut = lecture?.["Time Out"];
          satTimeIn = lecture?.["Sat Time In"];
          satTimeOut = lecture?.["Sat Time Out"];

          console.log("Lecture Data:", lecture);
          console.log(
            "Extracted Times - timeIn:",
            timeIn,
            "| timeOut:",
            timeOut,
            "| satTimeIn:",
            satTimeIn,
            "| satTimeOut:",
            satTimeOut
          );

          // Fetch subject name safely
          let subjectNames =
            selectedSubjects[dayIndex]?.lectures[index]?.subject
              ?.map((s) => s.name)
              .join(", ") || "";

          // Assign data based on the day
          switch (day.day) {
            case "Monday":
              timetableData[`mon${i}`] = subjectNames;
              timetableData[`time_in${i}`] = timeIn;
              timetableData[`time_out${i}`] = timeOut;
              break;
            case "Tuesday":
              timetableData[`tue${i}`] = subjectNames;
              break;
            case "Wednesday":
              timetableData[`wed${i}`] = subjectNames;
              break;
            case "Thursday":
              timetableData[`thu${i}`] = subjectNames;
              break;
            case "Friday":
              timetableData[`fri${i}`] = subjectNames;
              break;
            case "Saturday":
              timetableData[`sat${i}`] = subjectNames;
              timetableData[`sat_in${i}`] = satTimeIn;
              timetableData[`sat_out${i}`] = satTimeOut;
              break;
          }
        });
      });

      // Final debug check
      console.log("Final Timetable Data:", timetableData);

      console.log(
        "Final Timetable Data before submission:",
        JSON.stringify(timetableData, null, 2)
      );
      console.log(
        "Final Result is:",
        "Extracted Times - timeIn:",
        timeIn,
        "| timeOut:",
        timeOut,
        "| satTimeIn:",
        satTimeIn,
        "| satTimeOut:",
        satTimeOut
      );
      const response = await axios.post(
        `${API_URL}/api/save_classtimetable`,
        timetableData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);

      if (response.status === 200) {
        toast.success("Timetable saved successfully!");
      } else {
        toast.error(response.data.message || "Failed to save timetable.");
      }
    } catch (error) {
      console.error(
        "Error saving timetable:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "An error occurred while saving the timetable."
      );
    }
  };

  useEffect(() => {
    console.log("Updated timetable:", timetable);
  }, [timetable]);

  return (
    <>
      <ToastContainer />
      <div className="w-full mx-auto md:mt-4">
        {/* Outer Box */}
        <div className="bg-white shadow-xl rounded-lg border border-pink-500 p-4 lg:w-5/6 mb-0 mx-auto">
          {/* Header */}
          <div className="p-2 px-3 bg-gray-100 flex justify-between items-center rounded-t-lg">
            <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl">
              Create Time Table
            </h3>
            <RxCross1
              className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
              onClick={() => {
                // setErrors({});
                navigate("/timeTable");
              }}
            />
          </div>
          {/* Divider */}
          <div
            className="relative w-full h-1 mb-3 mx-auto"
            style={{ backgroundColor: "#C03078" }}
          ></div>
          {/* Form Box */}
          <div className="w-full mx-auto pt-3 pb-3">
            <div className="w-[95%] mx-auto">
              {/* Form Group Box */}
              <div className="border border-pink-500 p-3 rounded-lg shadow-md">
                {/* Class and Division Row */}
                <div className="flex items-center">
                  <div className="w-[25%] p-3">
                    <label
                      htmlFor="classSelect"
                      className="block text-gray-700"
                    >
                      Class <span className="text-red-500">*</span>
                    </label>
                    <Select
                      id="classSelect"
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      value={selectedClass}
                      onChange={handleClassSelect}
                      options={classOptions}
                      placeholder={
                        loadingClasses ? "Loading classes..." : "Select"
                      }
                      isSearchable
                      isClearable
                      isDisabled={loadingClasses}
                      className="text-sm"
                    />
                    {classError && (
                      <div className="text-danger text-xs mt-1">
                        {classError}
                      </div>
                    )}
                  </div>
                  <div className="w-[25%] p-3">
                    <label
                      htmlFor="divisionSelect"
                      className="block text-gray-700"
                    >
                      Division <span className="text-red-500">*</span>
                    </label>
                    <Select
                      id="divisionSelect"
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      value={selectedDivision}
                      onChange={handleDivisionSelect}
                      options={divisionOptions}
                      placeholder={
                        loadingDivision ? "Loading divisions..." : "Select"
                      }
                      isSearchable
                      isClearable
                      isDisabled={loadingDivision}
                      className="text-sm"
                    />
                    {divisionError && (
                      <div className="text-red-500 text-xs mt-1">
                        {divisionError}
                      </div>
                    )}
                  </div>

                  <div className="w-[25%] p-3">
                    <label
                      htmlFor="monFriSelect"
                      className="block text-gray-700"
                    >
                      Mon-Fri <span className="text-red-500">*</span>
                    </label>
                    <Select
                      id="monFriSelect"
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      value={selectedMonFri}
                      onChange={handleMonFriSelect}
                      options={generateLectureOptions(lectureCount)} // Use the function here
                      placeholder="Select Lecture"
                      isSearchable
                      isClearable
                      className="text-sm"
                    />
                  </div>
                  {/* Sat Dropdown */}
                  <div className="w-[25%] p-3">
                    <label htmlFor="satSelect" className="block text-gray-700">
                      Sat <span className="text-red-500">*</span>
                    </label>
                    <Select
                      id="satSelect"
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      value={selectedSat}
                      onChange={handleSatSelect}
                      options={generateLectureOptions(satLectureCount)} // Use the function here
                      placeholder="Select Lecture"
                      isSearchable
                      isClearable
                      className="text-sm"
                    />
                  </div>
                  {/* </div> */}
                  {/* Submit Button */}
                  {/* <div className="flex justify-end mt-4"> */}
                  <button
                    type="search"
                    onClick={handleAddTimetable}
                    style={{ backgroundColor: "#2196F3" }}
                    className={`mt-4 my-1 md:my-4 btn h-10 w-18 md:w-auto btn-primary text-white font-bold py-1 border-1 border-blue-500 px-4 rounded ${
                      loadingForSearch ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loadingForSearch}
                  >
                    {loadingForSearch ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin h-4 w-4 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                        Loading...
                      </span>
                    ) : (
                      "Add"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTimeTable && (
        <div className="relative w-[95%] bg-white shadow-xl rounded-lg border border-pink-500 mx-auto mt-3">
          <div className="overflow-x-auto p-4">
            <div className="p-2 px-3 bg-gray-100 flex justify-between items-center rounded-t-lg">
              <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl">
                Create Time Table for {selectedClass.label}
              </h3>
              <RxCross1
                className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                onClick={() => {
                  // setErrors({});
                  navigate("/timeTable");
                }}
              />
            </div>
            <div
              className="relative w-full h-1 mb-3 mx-auto"
              style={{ backgroundColor: "#C03078" }}
            ></div>
            <table className="table-auto border-collapse border border-gray-300 w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2 font-semibold text-center">
                    Sr No.
                  </th>
                  {timetable.map((day, index) => (
                    <th
                      key={index}
                      className="border p-2 font-semibold text-center"
                    >
                      {day.day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-gray-50">
                {timetable.length > 0 &&
                  [
                    ...Array(
                      Math.max(...timetable.map((day) => day.lectures.length))
                    ),
                  ].map((_, lectureIndex) => (
                    <tr key={lectureIndex}>
                      <td className="border p-1 text-center">
                        {lectureIndex + 1}
                      </td>

                      {timetable.map((day, dayIndex) => (
                        <td
                          key={dayIndex}
                          className="border border-gray-300 p-2"
                        >
                          {day.lectures[lectureIndex] ? (
                            <>
                              {(day.lectures[lectureIndex]?.["Time In"] ===
                                "" ||
                                day.lectures[lectureIndex]?.["Time In"]) && (
                                <select
                                  className="w-full px-1 py-1 border border-gray-300"
                                  value={
                                    day.lectures[lectureIndex]?.["Time In"] ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleStartSelect(
                                      dayIndex,
                                      lectureIndex,
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">Select</option>
                                  {timeOptions.map((time, i) => (
                                    <option key={i} value={time}>
                                      {time}
                                    </option>
                                  ))}
                                </select>
                              )}

                              {/* Show Time-Out dropdown only if it's empty  or if time is selected */}
                              {(day.lectures[lectureIndex]?.["Time Out"] ===
                                "" ||
                                day.lectures[lectureIndex]?.["Time Out"]) && (
                                <select
                                  className="w-full px-1 py-1 border border-gray-300 mt-1"
                                  value={
                                    day.lectures[lectureIndex]?.["Time Out"] ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleEndSelect(
                                      dayIndex,
                                      lectureIndex,
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">Select</option>
                                  {getFilteredEndTimeOptions(
                                    dayIndex,
                                    lectureIndex
                                  ).map((time, i) => (
                                    <option key={i} value={time}>
                                      {time}
                                    </option>
                                  ))}
                                </select>
                              )}

                              {/* Saturday Time-In dropdown */}
                              {dayIndex === 5 &&
                                day.lectures[lectureIndex]?.["Sat Time In"] ===
                                  "" && (
                                  <select
                                    className="w-full px-1 py-1 border border-gray-300"
                                    value={
                                      day.lectures[lectureIndex]?.[
                                        "Sat Time In"
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      handleSatStartSelect(
                                        dayIndex,
                                        lectureIndex,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">Select Sat </option>
                                    {satTimeOptions.map((time, i) => (
                                      <option key={i} value={time}>
                                        {time}
                                      </option>
                                    ))}
                                  </select>
                                )}

                              {/* Saturday Time-Out dropdown */}
                              {dayIndex === 5 &&
                                day.lectures[lectureIndex]?.["Sat Time Out"] ===
                                  "" && (
                                  <select
                                    className="w-full px-1 py-1 border border-gray-300 mt-1"
                                    value={
                                      day.lectures[lectureIndex]?.[
                                        "Sat Time Out"
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      handleSatEndSelect(
                                        dayIndex,
                                        lectureIndex,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">
                                      Select Sat Time-Out
                                    </option>
                                    {getFilteredSatEndTimeOptions(
                                      dayIndex,
                                      lectureIndex
                                    ).map((time, i) => (
                                      <option key={i} value={time}>
                                        {time}
                                      </option>
                                    ))}
                                  </select>
                                )}

                              {/* Subject Dropdown */}
                              {day.lectures[lectureIndex]?.subject && (
                                <div className="relative">
                                  {/* Dropdown Trigger */}
                                  <div
                                    className="w-full border border-gray-300 p-1 bg-white cursor-pointer inline-block truncate text-sm  items-center justify-between"
                                    onClick={() =>
                                      toggleDropdown(dayIndex, lectureIndex)
                                    }
                                  >
                                    <span className="truncate">
                                      {selectedSubjects[dayIndex]?.lectures[
                                        lectureIndex
                                      ]?.subject?.length > 0
                                        ? selectedSubjects[dayIndex].lectures[
                                            lectureIndex
                                          ].subject
                                            .map((s) => s.name)
                                            .join(", ")
                                        : "Select"}
                                    </span>
                                    <span className="ml-1 text-gray-500 ">
                                      ▾
                                    </span>{" "}
                                    {/* Small Down Arrow */}
                                  </div>

                                  {/* Dropdown Menu */}
                                  {openDropdown[dayIndex]?.[lectureIndex] && (
                                    <div className="absolute bg-white border border-gray-300 w-48 mt-1 z-10 max-h-48 overflow-y-auto">
                                      {subjects.map((subject) => (
                                        <label
                                          key={subject.sm_id}
                                          className="flex items-center gap-2 px-2 py-1 whitespace-nowrap"
                                        >
                                          <input
                                            type="checkbox"
                                            value={subject.sm_id}
                                            checked={
                                              selectedSubjects[
                                                dayIndex
                                              ]?.lectures[
                                                lectureIndex
                                              ]?.subject?.some(
                                                (s) => s.sm_id === subject.sm_id
                                              ) || false
                                            }
                                            onChange={(e) =>
                                              handleSubjectSelect(
                                                dayIndex,
                                                lectureIndex,
                                                subject,
                                                e.target.checked
                                              )
                                            }
                                            className="w-4 h-4"
                                          />
                                          <span className="text-sm">
                                            {subject.name}
                                          </span>
                                        </label>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          ) : (
                            ""
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="flex justify-end p-2 relative">
              <button className="btn btn-primary btn-xs" onClick={handleSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateTimeTable;
