import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import "react-datepicker/dist/react-datepicker.css";
import EditCommonTimeTable from "./EditCommonTimeTable";
import LoaderStyle from "../../common/LoaderFinal/LoaderStyle";

const EditTimetablePlanner = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [selectedStudent, setSelectedStudent] = useState(null);
  //   const [fromDate, setFromDate] = useState(null);
  const [studentNameWithClassId, setStudentNameWithClassId] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [loadingForSearch, setLoadingForSearch] = useState(false);

  const navigate = useNavigate();
  const [loadingExams, setLoadingExams] = useState(false);
  const [timeTableDataError, setTimeTableDataError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [timetable, setTimetable] = useState([]);

  const pageSize = 10;
  const [pageCount, setPageCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  //   const [timetableData, setTimetableData] = useState([]);
  const [timetableData, setTimetableData] = useState({
    periods: [],
    subjects: [],
    rowCounts: { mon_fri: 0, sat: 0 }, // Initialize rowCounts state
  }); // To hold transformed data
  const [classSection, setClassSection] = useState([]);

  const [loadingForTabSwitch, setLoadingForTabSwitch] = useState(false); // Loading state
  const [weekRange, setWeekRange] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const [allocatedPeriods, setAllocatedPeriods] = useState(null); // Store allocated periods
  const [usedPeriods, setUsedPeriods] = useState(null); // Store used periods
  const [checkUsedPeriods, setCheckUsedPeriods] = useState("");
  const [occupiedPeriods, setOccupiedPeriods] = useState(0); // Store occupied periods
  const [activeTab, setActiveTab] = useState("");
  const location = useLocation();
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);

  const { staff } = location.state || {};
  console.log("TeacherData is: ", staff);
  useEffect(() => {
    fetchExams();
    fetchClassSection();
  }, []);
  const fetchClassSection = async () => {
    try {
      setLoadingExams(true);
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${API_URL}/api/get_sectionwithclassname`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("ClassSection", response.data);
      setClassSection(response?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching class and section name");
      console.error("Error fetching class and section name:", error);
    } finally {
      setLoadingExams(false);
    }
  };

  useEffect(() => {
    const waitForStaff = async () => {
      while (!staff?.teacher_id) {
        console.log("Waiting for staff...");
        await new Promise((res) => setTimeout(res, 300));
      }
      handleSearch();
    };

    waitForStaff();
  }, []);

  const fetchExams = async () => {
    try {
      setLoadingExams(true);
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${API_URL}/api/get_teacherslistbyperiod`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Teachers", response.data);
      setStudentNameWithClassId(response?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching Teachers");
      console.error("Error fetching Teachers:", error);
    } finally {
      setLoadingExams(false);
    }
  };

  const handleSearch = async () => {
    setLoadingForSearch(false);
    setShowNoDataMessage(false); // Hide error on load

    // setSelectedStudent("");
    // setSelectedStudentId("");

    setSearchTerm("");
    setActiveTab("");
    setTimetableData({
      periods: [],
      subjects: [],
      rowCounts: { mon_fri: 0, sat: 0 },
    });
    setTabs([]);
    setSelectedSubjects({});
    setAllocatedPeriods(null); // Reset periods
    setUsedPeriods(null); // Reset used periods
    setCheckUsedPeriods("");
    setOccupiedPeriods(0); // Reset occupied periods
    try {
      const formattedWeek = weekRange.replace(/\s/g, "").replace(/%20/g, ""); // Ensure no extra spaces or encoded symbols
      console.log("Formatted Week is: --->", formattedWeek);

      setLoadingForSearch(true); // Start loading
      setTimetable([]);
      setTimeTableDataError("");
      if (!staff?.teacher_id) {
        console.log(
          "Teacher ID is missing. Please select a teacher.",
          staff.teacher_id
        );
        toast.error("Teacher ID is missing. Please select a teacher.");
        return;
      }
      console.log(
        "Outside Teacher ID is missing. Please select a teacher.",
        staff.teacher_id
      );
      const token = localStorage.getItem("authToken");
      const periodResponse = await axios.get(
        `${API_URL}/api/get_teacherperioddata?teacher_id=${staff.teacher_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (periodResponse?.data?.success) {
        setAllocatedPeriods(periodResponse?.data?.data[0]?.periods_allocated);
        setUsedPeriods(periodResponse?.data?.data[0]?.periods_used);
        setCheckUsedPeriods(periodResponse?.data?.data[0]?.periods_used);
      } else {
        toast.error("Failed to fetch teacher period data.");
      }
      const params = {
        teacher_id: staff?.teacher_id,
      };

      const response = await axios.get(
        `${API_URL}/api/get_teacherclasstimetable`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      if (!response?.data?.data || response?.data?.data?.length === 0) {
        // toast.error("Time Table Planner for selected teacher not found.");
        setTimeTableDataError(
          "Time Table Planner for selected teacher not found."
        );
        setShowNoDataMessage(true); // ✅ Show error message

        setTimetable([]);
      } else {
        setTimeTableDataError("");
        setShowNoDataMessage(false); // Hide error on load
        setTimetable(response?.data?.data);
        setPageCount(Math.ceil(response?.data?.data?.length / pageSize));
      }
      const formattedTabs = response.data.data.map((item) => ({
        id: `${item.classname}-${item.sectionname}`,
        classname: item.classname,
        sectionname: item.sectionname,
        teachername: item.teachername,
        class_id: item.class_id, // Store class_id
        section_id: item.section_id, // Store section_id
      }));

      // Now you have class_id and section_id stored for each tab

      // Sort tabs by class in ascending order
      const sortedTabs = formattedTabs.sort((a, b) => {
        const classA = parseInt(a.classname, 10);
        const classB = parseInt(b.classname, 10);
        return classA - classB;
      });

      setTabs(sortedTabs);
      // Set the initial active tab to the first tab
      if (sortedTabs.length > 0) {
        setActiveTab(sortedTabs[0].id);
      }
      //   setActiveTab(sortedTabs[0]?.id || ""); // Set default active tab
    } catch (error) {
      console.error(
        "Error fetching Time Table Planner for selected teacher :",
        error
      );
      toast.error(
        "Error fetching Time Table Planner for selected teacher. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      setLoadingForSearch(false);
    }
  };

  console.log("row", timetable);

  const fetchTimetableData = async (teacher_id, class_id, section_id) => {
    setLoadingForTabSwitch(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `${API_URL}/api/get_edittimetablebyclasssection/${class_id}/${section_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check for the specific error response
      if (response.data?.success === false && response.data?.message) {
        toast.error(response.data.message); // Show toast error message
        setTimetableData({
          periods: [],
          subjects: [],
          rowCounts: { mon_fri: 0, sat: 0 },
        }); // Clear any existing data
        return; // Do not proceed to show the table if the response indicates an error
      }

      if (response.data && response.data.data) {
        const transformedData = transformTimetableData(response.data.data);
        setTimetableData(transformedData); // Store the transformed data
      } else {
        setTimetableData({
          periods: [],
          subjects: [],
          rowCounts: { mon_fri: 0, sat: 0 },
        });
      }

      const subjectsResponse = await axios.get(
        `${API_URL}/api/get_teachersubjectbyclass?teacher_id=${staff?.teacher_id}&class_id=${class_id}&section_id=${section_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (subjectsResponse.data && subjectsResponse.data.data) {
        setSubjects(subjectsResponse.data.data); // Store the subjects data
      } else {
        setSubjects([]); // Handle error fetching subjects data
      }
    } catch (error) {
      console.error("Error fetching timetable data:", error);
      setTimetableData({
        periods: [],
        subjects: [],
        rowCounts: { mon_fri: 0, sat: 0 },
      }); // Clear any existing data
      setSubjects([]); // Handle error fetching subjects data
      toast.error("Error fetching timetable data. Please try again.");
    } finally {
      setLoadingForTabSwitch(false);
    }
  };

  // Ensure to check before rendering the `CommonTable`

  const handleTableData = (
    classId,
    sectionId,
    day,
    period_no,
    selectedSubject
  ) => {
    const key = `${classId}-${sectionId}`;

    setSelectedSubjects((prevSubjects) => ({
      ...prevSubjects,
      [key]: {
        ...prevSubjects[key], // Preserve previous data for the same class-section
        [day]: {
          ...(prevSubjects[key]?.[day] || {}), // Preserve previous day's data
          [period_no]: selectedSubject, // Update selected subject for this period
        },
      },
    }));
    console.log("setSelectedSubjects[]----->", selectedSubjects);
  };
  // console.log("")

  const transformTimetableData = (data) => {
    const periods = [];
    const subjects = [];

    const rowCounts = {
      mon_fri: data.mon_fri, // Number of periods for Monday to Friday
      sat: data.sat, // Number of periods for Saturday
    };

    // Iterate through each day and extract the periods
    Object.keys(data).forEach((day) => {
      if (day !== "mon_fri" && day !== "sat") {
        const dayData = data[day];
        dayData.forEach((period) => {
          // Extract teacher names, handling empty teacher arrays
          const teachers =
            period.teacher &&
            Array.isArray(period.teacher) &&
            period.teacher.length > 0
              ? period.teacher.map((t) => t.t_name).join(", ")
              : " "; // If no teachers, return "N/A"

          // Add the period to the periods array, with subject and teacher names
          periods.push({
            period_no: period.period_no,
            time_in: period.time_in,
            time_out: period.time_out,
            subject_id: period.subject_id, // Subject ID
            subject: period.subject,
            teachers: teachers, // Teacher(s) name(s)
            day: day, // Add the day to link periods to days
          });

          // Add the subject and teacher details for the subject table
          subjects.push({
            day,
            period_no: period.period_no,
            subject_id: period.subject, // Subject ID
            teachers: teachers, // Teacher(s) name(s)
          });
        });
      }
    });

    return { periods, subjects, rowCounts };
  };

  useEffect(() => {
    // Find the active tab based on `activeTab`
    let activeTabData = tabs.find((tab) => tab.id === activeTab);
    //  const activeTabData = tabs.find((tab) => tab.id === activeTab);
    // Call fetchTimetableData with class_id and section_id
    if (activeTabData) {
      setLoadingForTabSwitch(true);
      fetchTimetableData(
        selectedStudentId,
        activeTabData.class_id,
        activeTabData.section_id
      );
    }
  }, [activeTab, selectedStudentId, tabs]); // Fetch data whenever activeTab changes
  const handleSubmit = async () => {
    // Assuming checkUsedPeriods is the expected number of periods to be selected
    if (usedPeriods == checkUsedPeriods) {
      toast.error("Please select at least one subject.");
      return; // Prevent submission if the condition is met
    }
    try {
      setIsSubmitting(true);
      // Prepare data to submit
      const submitData = Object.keys(selectedSubjects).map((key) => {
        const [classId, sectionId] = key.split("-"); // Extract class_id and section_id from key
        const classSectionData = selectedSubjects[key];

        const subjectsForClassSection = Object.keys(classSectionData).map(
          (day) => {
            const periodsForDay = classSectionData[day];

            return {
              day,
              periods: Object.keys(periodsForDay).map((period_no) => ({
                period_no,
                subject: periodsForDay[period_no],
              })),
            };
          }
        );

        return {
          class_id: classId,
          section_id: sectionId,
          subjects: subjectsForClassSection,
        };
      });

      // Include teacher_id in the data to be submitted
      const teacherId = staff?.teacher_id; // Assuming selectedStudentId is the teacher's ID

      const dataToSubmit = {
        teacher_id: teacherId, // Add teacher_id to the data being sent
        period_used: usedPeriods,
        timetable_data: submitData,
      };

      // Send the data to the server
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${API_URL}/api/save_timetableallotment`,
        dataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.success) {
        toast.success("Timetable successfully submitted!");
        setTimeout(() => {
          setActiveTab(""); // Reset active tab
          setTimetableData({
            periods: [],
            subjects: [],
            rowCounts: { mon_fri: 0, sat: 0 },
          });
          setTabs([]); // Clear tabs
          setSelectedSubjects({}); // Reset selected subjects
          setAllocatedPeriods(null); // Reset allocated periods
          setUsedPeriods(null); // Reset used periods
          setCheckUsedPeriods(""); // Reset used periods check
          setOccupiedPeriods(0); // Reset occupied periods
          setTimetable([]);
          navigate("/timetablePlanner");
        }, 1000); // Delay for 2 seconds (2000ms)
      } else {
        toast.error("Failed to submit timetable.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the timetable.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="w-full md:w-[99%] mx-auto p-4 ">
        {/* <ToastContainer /> */}
        <div className="card p-4 rounded-md ">
          <div className=" card-header mb-4 flex justify-between items-center ">
            <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
              Edit Time Table Planner
            </h5>
            <RxCross1
              className=" relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
              onClick={() => {
                navigate("/timetablePlanner");
              }}
            />
          </div>
          <div
            className=" relative w-full   -top-6 h-1  mx-auto bg-red-700"
            style={{
              backgroundColor: "#C03078",
            }}
          ></div>

          <>
            {loadingForSearch ? (
              <>
                {" "}
                <div className="flex flex-col justify-center items-center p-10 space-y-5">
                  {/* Spinner */}
                  <div className="w-14 h-14 border-[5px] border-indigo-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>

                  {/* Glowing Animated Text */}
                  <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-pulse">
                    Please wait while Loading timetable...
                  </div>

                  {/* Optional Subtitle */}
                </div>
              </>
            ) : timetable.length > 0 ? (
              <>
                <div className="card mx-auto lg:w-full shadow-lg mt-3">
                  <div className="card-body bg-gray-100 border-none w-full border-3 border-black flex">
                    {/* Left Sidebar - Tabs */}
                    <div
                      className="w-[15%] border-r h-[440px] overflow-y-auto p-3 bg-white rounded-xl shadow-lg"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#6366F1 #E5E7EB", // Custom scrollbar colors
                      }}
                    >
                      <h3 className="text-lg font-semibold text-blue-600 mb-3 text-center">
                        Select Class
                      </h3>

                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          className={`block w-full text-center p-3 my-2 text-lg font-medium rounded-lg transition-all duration-300
        ${
          activeTab === tab.id
            ? "bg-indigo-600 text-white shadow-md transform scale-105"
            : "bg-gray-100 text-gray-700 hover:bg-indigo-200 hover:shadow-md"
        }`}
                          onClick={() => {
                            setActiveTab(tab.id); // Set active tab
                            // fetchTimetableData(tab.class_id, tab.section_id); // Pass class_id and section_id to fetch data
                          }}
                        >
                          {tab.id}
                        </button>
                      ))}
                    </div>
                    {/* Right Table Section */}
                    <div className="w-[85%] overflow-hidden bg-white rounded-lg shadow-md">
                      {/* Header */}
                      <div className="w-[97%] mx-auto overflow-hidden  flex flex-row justify-between items-center  border-b-2 border-pink-600">
                        {allocatedPeriods !== null && (
                          <span className="text-pink-500 text-xl font-medium">
                            Allocated Periods: {allocatedPeriods}
                          </span>
                        )}
                        <h2 className="text-xl   text-blue-500 font-bold mb-2 text-center">
                          Class {activeTab}
                        </h2>
                        {usedPeriods !== null && (
                          <span className="text-pink-500 text-xl font-medium">
                            Occupied Periods: {usedPeriods}
                          </span>
                        )}
                      </div>
                      {/* Scrollable Table Container */}
                      <div
                        className="overflow-y-auto h-[400px] border rounded-md p-2"
                        style={{
                          scrollbarWidth: "thin", // For Firefox
                          scrollbarColor: "#4F46E5 #E5E7EB", // Track and thumb color in Firefox
                        }}
                      >
                        <EditCommonTimeTable
                          activeTab={activeTab}
                          tabs={tabs}
                          periods={timetableData.periods || []} // Pass periods to CommonTable
                          subjects={subjects || []} // Pass subjects to CommonTable
                          loading={loadingForTabSwitch} // Show loading state if fetching data
                          selectedSubjects={selectedSubjects}
                          handleTableData={handleTableData}
                          rowCounts={timetableData.rowCounts} // Pass row counts (mon_fri and sat) to CommonTable
                          allocatedPeriods={allocatedPeriods}
                          usedPeriods={usedPeriods}
                          setUsedPeriods={setUsedPeriods} // Pass setUsedPeriods function to child
                          showToast={
                            (message, type) =>
                              console.log(`${type}: ${message}`) // Example toast handler
                          }
                          classSectionNames={classSection}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end px-3 py-1 relative -top-2">
                    <button
                      type="button"
                      className="btn btn-primary px-3 "
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submiting..." : "Submit"}
                    </button>
                  </div>
                </div>
              </>
            ) : showNoDataMessage ? (
              <div className=" w-[100%]  text-center flex justify-center items-center mt-4">
                <div className="p-5 text-center font-semibold text-xl text-red-600 ">
                  Oops! Time Table Planner for selected teacher not found..
                </div>
              </div>
            ) : null}
          </>
        </div>
      </div>
    </>
  );
};

export default EditTimetablePlanner;
