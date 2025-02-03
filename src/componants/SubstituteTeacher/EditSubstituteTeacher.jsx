import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import Loader from "../common/LoaderFinal/LoaderStyle";
import { FiPrinter } from "react-icons/fi";
import { useLocation } from "react-router-dom";

const EditSubstituteTeacher = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const hasFetched = useRef(false);
  const location = useLocation();
  const { staff } = location.state || {};
  const { teacherId, date } = staff.timetable[0] || {};
  const [day, setDay] = useState("");

  // Log to verify the values
  console.log("Teacher ID:", teacherId);
  console.log("Date:", date);
  console.log("staff", staff);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format as yyyy-MM-dd
  });
  const [studentNameWithClassId, setStudentNameWithClassId] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingForSearch, setLoadingForSearch] = useState(false);
  const navigate = useNavigate();
  // State for loading indicators
  // const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingExams, setLoadingExams] = useState(false);
  const [studentError, setStudentError] = useState("");

  const [timetable, setTimetable] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const [teacherList, setTeacherList] = useState([]);

  useEffect(() => {
    // Fetch both classes and exams when the component mounts
    fetchTimetableData();
    fetchExams();
    fetchTeacherList();
  }, []);

  const fetchTimetableData = async () => {
    try {
      setLoading(true); // Start loading
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/get_substituteteacherdata/${teacherId}/${date}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data?.success && response.data?.data?.length > 0) {
        const substitutionData = response.data.data;

        // Map response data into a usable structure for rendering
        const timetableData = substitutionData.map((item) => ({
          date: item?.date,
          subject: item?.sname,
          classSection: `${item?.c_name}-${item?.s_name}`, // Combine class and section
          periodNo: item?.period,
          teacherName: item?.sub_teacher,
          teacherId: item?.teacher_id,
          subTeacherId: item?.sub_teacher_id,
          substituteTeacher: item.sub_teacher_id, // Prefill dropdown
          classId: item?.class_id,
          sectionId: item?.section_id,
          subjectId: item?.subject_id,
        }));
        setDay(response?.data?.day_week);
        setTimetable(timetableData); // Save mapped data
        // toast.success("Substitution data fetched successfully!");
      } else {
        toast.error(
          "No substitution data available for the selected teacher and date."
        );
        setTimetable([]); // Clear timetable to avoid incorrect rendering
      }
    } catch (error) {
      console.error("Error fetching substitution data:", error);
      toast.error("An error occurred while fetching substitution data.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch substitution teacher list for a specific period and teacher
  const fetchSubstitutionTeachers = async (periodNo, teacherId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/get_substituteteacherclasswise/${periodNo}/${teacherId}/${selectedDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response?.data?.data || [];
    } catch (error) {
      console.error("Error fetching substitution teachers:", error);
      toast.error("Failed to fetch substitute teachers.");
      return [];
    }
  };
  // Fetch substitution teachers for each period

  useEffect(() => {
    const fetchSubstituteOptions = async () => {
      const updatedTimetable = await Promise.all(
        timetable.map(async (row) => {
          const substituteOptions = await fetchSubstitutionTeachers(
            row.periodNo,
            row.teacherId
          );
          return {
            ...row,
            substituteOptions: substituteOptions.map((teacher) => ({
              value: teacher.teacher_id,
              label: teacher.name,
            })),
          };
        })
      );
      setTimetable(updatedTimetable);
    };

    if (timetable.length > 0 && !hasFetched.current) {
      hasFetched.current = true; // Mark as fetched
      fetchSubstituteOptions();
    }
  }, [timetable]); // Only run if the timetable changes

  const fetchExams = async () => {
    try {
      setLoadingExams(true);
      const token = localStorage.getItem("authToken");

      const response = await axios.get(`${API_URL}/api/get_teacher_list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("teacher", response);
      setStudentNameWithClassId(response.data || []);
    } catch (error) {
      toast.error("Error fetching teachers");
      console.error("Error fetching teachers:", error);
    } finally {
      setLoadingExams(false);
    }
  };
  const fetchTeacherList = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(`${API_URL}/api/get_teacher_list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTeacherList(response.data || []); // Store teacher list separately
    } catch (error) {
      toast.error("Error fetching teachers");
      console.error("Error fetching teachers:", error);
    }
  };
  const handleTeacherSelect = (index, selectedOption) => {
    setTimetable((prevTimetable) =>
      prevTimetable.map((row, i) =>
        i === index ? { ...row, substituteTeacher: selectedOption?.value } : row
      )
    );
  };
  const teacherOptions = useMemo(
    () =>
      teacherList.map((teacher) => ({
        value: teacher.reg_id,
        label: teacher.name,
      })),
    [teacherList]
  );
  const resetTeacherDropdown = () => {
    setTimetable([]);
  };

  const handleStudentSelect = (selectedOption) => {
    setStudentError(""); // Reset error if student is selected
    setSelectedStudent(selectedOption);
    setSelectedStudentId(selectedOption?.value);
  };

  // Dropdown options

  const studentOptions = useMemo(
    () =>
      studentNameWithClassId.map((teacher) => ({
        value: teacher.reg_id,
        label: teacher.name,
      })),
    [studentNameWithClassId]
  );

  // Prepare data for submission
  const prepareDataForSubmission = () => {
    console.log("Timetable is", timetable);

    const substitutions = timetable.map((row) => ({
      class_id: row.classId,
      section_id: row.sectionId,
      subject_id: row.subjectId,
      period: row.periodNo,
      date: row.date,
      teacher_id: row.teacherId,
      substitute_teacher_id: row.substituteTeacher, // Map substitute teacher ID
    }));

    return { substitutions };
  };

  const handleSubmit = async () => {
    const preparedData = prepareDataForSubmission();
    console.log("Prepared Data", preparedData);

    // Validation: Ensure at least one substitute teacher is selected
    const hasSubstitute = preparedData.substitutions.some(
      (sub) => sub.substitute_teacher_id
    );

    if (!hasSubstitute) {
      toast.error("Please select at least one substitute teacher.");
      return;
    }

    // Show loader
    setLoading(true);

    try {
      const response = await axios.put(
        `${API_URL}/api/update_substituteteacher/${teacherId}/${date}`,
        preparedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Data updated successfully!");
      // Clear the timetable data if necessary
      navigate("/substituteTeacher");
      setTimetable([]);
    } catch (error) {
      toast.error("Failed to update data. Please try again.");
      console.error("Error in submission:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full md:w-[80%] mx-auto p-4 ">
        <ToastContainer />
        <div className="card p-4 rounded-md ">
          <div className=" card-header mb-4 flex justify-between items-center ">
            <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
              Edit Substitution Teacher
            </h5>
            <RxCross1
              className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
              onClick={() => {
                // setErrors({});
                navigate("/substituteTeacher");
              }}
            />
          </div>
          <div
            className=" relative w-full   -top-6 h-1  mx-auto bg-red-700"
            style={{
              backgroundColor: "#C03078",
            }}
          ></div>

          {/* Form Section - Displayed when parentInformation is fetched */}
          {/* // Render the table */}

          {timetable.length > 0 && (
            <>
              <div className="md:w-[65%] w-full mx-auto pb-3 pt-2 px-1 md:px-4">
                <div className="card bg-gray-100 py-2 px-3 rounded-md">
                  <h5 className="text-center text-blue-600">{`Timetable for ${day} `}</h5>
                  <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border bg-gray-50 border-gray-300">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border p-2 w-full md:w-[10%] font-semibold text-center">
                            Period
                          </th>
                          <th className="border p-2 w-full md:w-[30%] font-semibold text-center">
                            Subject
                          </th>
                          <th className="border-3 p-2  w-full md:w-[40%]  font-semibold text-center">
                            Substitute Teacher
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-50  z-10">
                              <Loader /> {/* Replace with your loader */}
                            </div>
                          </tr>
                        ) : (
                          timetable.map((row, index) => (
                            <tr key={index}>
                              <td className="border p-2 text-center">
                                {row.periodNo}
                              </td>
                              <td className="border p-2 text-center">
                                {row.subject} {row.classSection}
                              </td>
                              <td className="border p-2 text-center">
                                <Select
                                  options={row.substituteOptions || []}
                                  menuPortalTarget={document.body}
                                  menuPosition="fixed"
                                  isClearable
                                  value={row.substituteOptions?.find(
                                    (option) =>
                                      option.value === row.substituteTeacher
                                  )}
                                  onChange={(selectedOption) =>
                                    handleTeacherSelect(index, selectedOption)
                                  }
                                  placeholder="Select"
                                  className="text-sm text-black"
                                  styles={{
                                    control: (provided) => ({
                                      ...provided,
                                      fontSize: "0.75rem",
                                      minHeight: "30px",
                                    }),
                                    menu: (provided) => ({
                                      ...provided,
                                      fontSize: "0.75rem",
                                    }),
                                    option: (provided, state) => ({
                                      ...provided,
                                      fontSize: "0.95rem",
                                      backgroundColor: state.isFocused
                                        ? "rgba(59, 130, 246, 0.1)"
                                        : "white",
                                      color: state.isSelected
                                        ? "blue"
                                        : "inherit", // Ensures selected value is black
                                    }),
                                  }}
                                />
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="my-1 md:w-[65%] mx-auto w-full flex flex-col md:flex-row gap-1 justify-center md:justify-end ">
                <button
                  type="button"
                  onClick={resetTeacherDropdown}
                  className={`bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700`}
                  disabled={isSubmitDisabled}
                >
                  Reset
                </button>{" "}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className={`bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded ${
                    isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitDisabled}
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EditSubstituteTeacher;
