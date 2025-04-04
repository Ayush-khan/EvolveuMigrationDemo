import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
// import Loader from "../common/LoaderFinal/LoaderStyle";
import LoaderStyle from "../../common/LoaderFinal/LoaderStyle";

const CreateClassWisePeriodAllotment = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  //   const [selectedStudent, setSelectedStudent] = useState(null);
  const [status, setStatus] = useState(null); // For status dropdown

  const [currentPage, setCurrentPage] = useState(0);
  const [studentNameWithClassId, setStudentNameWithClassId] = useState([]);
  //   const [selectedStudentId, setSelectedStudentId] = useState(null);
  // const [loading, setLoading] = useState(false);
  const [loadingForSearch, setLoadingForSearch] = useState(false);

  const [subjects, setSubjects] = useState([]);
  //   const [selectedSubject, setSelectedSubject] = useState(null);
  //   const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  const navigate = useNavigate();
  const [loadingExams, setLoadingExams] = useState(false);
  //   const [studentError, setStudentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [timetable, setTimetable] = useState([]);
  const [periods, setPeriods] = useState({ "mon-fri": "", sat: "" });
  const [errors, setErrors] = useState({
    "mon-fri": "",
    sat: "",
  });

  const [selectAll, setSelectAll] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  //   const [periodValue, setPeriodValue] = useState(""); // Stores user-input period
  //   const [allocatedPeriods, setAllocatedPeriods] = useState({}); // Stores periods for all rows

  const pageSize = 10;
  const [pageCount, setPageCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchExams();
    fetchSubjects();
    handleSearch();
  }, []);

  const fetchExams = async () => {
    try {
      setLoadingExams(true);
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${API_URL}/api/get_classofnewadmission`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //   console.log("Class", response);
      setStudentNameWithClassId(response?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching Classes");
      console.error("Error fetching Classes:", error);
    } finally {
      setLoadingExams(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      setLoadingExams(true);
      const token = localStorage.getItem("authToken");

      const response = await axios.get(`${API_URL}/api/subject`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Subjects", response);
      setSubjects(response?.data || []);
    } catch (error) {
      toast.error("Error fetching Subjects");
      console.error("Error fetching Subjects:", error);
    } finally {
      setLoadingExams(false);
    }
  };

  const handleSearch = async () => {
    setLoadingForSearch(true);
    setTimetable([]);
    setSearchTerm("");

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/get_classsectionfortimetable`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Class response", response);

      // Check if response data exists
      if (
        !response?.data?.data ||
        Object.keys(response?.data?.data).length === 0
      ) {
        toast.error("Class data not found.");
        setTimetable([]);
      } else {
        // Convert object values to a flat array
        const formattedData = Object.values(response.data.data).flat();
        setTimetable(formattedData);

        // Set pagination count (if needed)
        setPageCount(Math.ceil(formattedData.length / pageSize));
      }
    } catch (error) {
      console.error("Error fetching classwise Period Allotment:", error);
      toast.error(
        "Error fetching classwise Period Allotment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      setLoadingForSearch(false);
    }
  };

  console.log("row", timetable);

  const handleSelectAll = () => {
    if (!Array.isArray(displayedSections) || displayedSections.length === 0) {
      console.log("displayedSections is empty or not an array");
      return;
    }

    const newState = !selectAll;
    setSelectAll(newState);

    const updatedCheckboxes = {};

    displayedSections.forEach((section) => {
      if (section.class_id && section.section_id) {
        // Select/deselect the section
        updatedCheckboxes[section.section_id] = newState;

        // Ensure class-level selection updates if all sections are selected
        updatedCheckboxes[section.class_id] = newState;
      }
    });

    console.log("updatedCheckboxes", updatedCheckboxes); // Debug output

    setSelectedCheckboxes(updatedCheckboxes);
  };

  const handleCheckboxChange = (group, class_id, section_id = null) => {
    let updatedCheckboxes = { ...selectedCheckboxes };

    if (section_id === null) {
      // Class-level checkbox toggled
      const isClassSelected = !selectedCheckboxes[class_id];

      // Select/Deselect all sections within this class
      group.sections.forEach((section) => {
        updatedCheckboxes[section.section_id] = isClassSelected;
      });

      // Also update the class checkbox itself
      updatedCheckboxes[class_id] = isClassSelected;
    } else {
      // Section-level checkbox toggled
      updatedCheckboxes[section_id] = !selectedCheckboxes[section_id];

      // Check if all sections in this class are selected
      const allSectionsSelected = group.sections.every(
        (section) => updatedCheckboxes[section.section_id]
      );

      // Update the class-level checkbox based on section selection
      updatedCheckboxes[class_id] = allSectionsSelected;
    }

    setSelectedCheckboxes(updatedCheckboxes);

    // Update "Select All" checkbox if all class checkboxes are selected
    setSelectAll(
      displayedSections.every((group) => updatedCheckboxes[group.class_id])
    );
  };

  const groupedClasses = timetable.reduce((acc, student) => {
    const { class_id, classname_section } = student;

    // If the class_id doesn't exist in acc, create an entry
    if (!acc[class_id]) {
      acc[class_id] = {
        class_id: class_id,
        sections: [],
      };
    }

    // Push the section into the array
    acc[class_id].sections.push(classname_section);
    return acc;
  }, {});

  // Convert object values into an array
  const groupedData = Object.values(groupedClasses);
  console.log("grouped data", groupedData);

  const handleSubmit = async () => {
    setLoadingForSearch(true);

    const newErrors = {};
    if (!periods["mon-fri"]) {
      newErrors["mon-fri"] = "Mon-Fri Periods are required.";
    }
    if (!periods["sat"]) {
      newErrors["sat"] = "Sat Periods are required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoadingForSearch(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      // Debugging Logs
      console.log("Displayed Sections:", displayedSections);
      console.log("Selected Checkboxes:", selectedCheckboxes);

      const selectedTeachers = displayedSections
        .filter(
          (teacher) =>
            selectedCheckboxes[teacher.class_id] ||
            selectedCheckboxes[teacher.section_id]
        )
        .map((teacher) => ({
          class_id: teacher.class_id,
          section_id: teacher.section_id,
          "mon-fri": periods["mon-fri"],
          sat: periods["sat"],
        }));

      // Ensure at least one selection exists
      if (selectedTeachers.length === 0) {
        toast.error(
          "Please select at least one class or section before submitting."
        );
        setLoadingForSearch(false);
        return;
      }

      console.log("Sending Data:", JSON.stringify(selectedTeachers, null, 2));

      const response = await axios.post(
        `${API_URL}/api/save_classwiseperiod`,
        selectedTeachers,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data.success) {
        toast.success("Classwise Period Allocation Created Successfully.");
        setSelectedCheckboxes({});
        setSelectAll(false);
        setPeriods(false);
      } else {
        toast.error("Classwise Period Allocation not created.");
      }
    } catch (error) {
      console.error("Error Submitting Classwise Period Allocation:", error);
      toast.error("Error submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
      setLoadingForSearch(false);
    }
  };

  const handlePeriodChange = (dayType, value) => {
    // Parse the value to ensure it's a number
    let parsedValue = parseInt(value, 10);

    // If parsedValue is not a valid number (NaN), reset to empty or previous valid value
    if (isNaN(parsedValue)) {
      parsedValue = "";
    }

    // Handle Mon-Fri Periods (value cannot exceed 9)
    if (dayType === "mon-fri") {
      if (parsedValue === "") {
        // Allow clearing the value
        setPeriods((prevPeriods) => ({
          ...prevPeriods,
          [dayType]: parsedValue,
        }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          "mon-fri": "",
        }));
        return;
      }

      if (parsedValue > 9) {
        // Show error if the value exceeds 9
        setErrors((prevErrors) => ({
          ...prevErrors,
          "mon-fri": "Mon-Fri Periods cannot be greater than 9.",
        }));
        return; // Prevent value change if the limit is exceeded
      } else if (parsedValue >= 1 && parsedValue <= 9) {
        // Update the periods if the value is within the valid range (1 to 9)
        setPeriods((prevPeriods) => ({
          ...prevPeriods,
          [dayType]: parsedValue,
        }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          "mon-fri": "", // Clear any error if the value is valid
        }));
      }
    }

    // Handle Sat Periods (value cannot exceed 5)
    if (dayType === "sat") {
      if (parsedValue === "") {
        // Allow clearing the value
        setPeriods((prevPeriods) => ({
          ...prevPeriods,
          [dayType]: parsedValue,
        }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          sat: "",
        }));
        return;
      }

      if (parsedValue > 5) {
        // Show error if the value exceeds 5
        setErrors((prevErrors) => ({
          ...prevErrors,
          sat: "Saturday Periods cannot be greater than 5.",
        }));
        return; // Prevent value change if the limit is exceeded
      } else if (parsedValue >= 1 && parsedValue <= 5) {
        // Update the periods if the value is within the valid range (1 to 5)
        setPeriods((prevPeriods) => ({
          ...prevPeriods,
          [dayType]: parsedValue,
        }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          sat: "", // Clear any error if the value is valid
        }));
      }
    }
  };

  const filteredSections = timetable.filter((section) => {
    const searchLower = searchTerm.toLowerCase().trim();
    const className = section?.classname_section?.toLowerCase().trim() || "";
    return className.includes(searchLower);
  });

  const displayedSections = filteredSections.slice(currentPage * pageSize);

  return (
    <>
      <div className="w-full md:w-[70%] mx-auto p-4 ">
        <ToastContainer />
        <div className="">
          <>
            <div className="w-full  mt-2">
              <div className="card mx-auto lg:w-full shadow-lg">
                <div className="p-2 px-3 bg-gray-100 border-none flex justify-between items-center">
                  <div className="w-full flex flex-row justify-between mr-0 md:mr-4 ">
                    <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
                      Classwise Period Allocation
                    </h3>
                    <RxCross1
                      className="mt-2 relative  text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                      onClick={() => {
                        navigate("/classWisePAllot");
                      }}
                    />
                  </div>
                </div>
                <div
                  className=" relative w-[97%]   mb-3 h-1  mx-auto bg-red-700"
                  style={{
                    backgroundColor: "#C03078",
                  }}
                ></div>

                <div className="card-body w-full">
                  <div
                    className="h-96 lg:h-96 overflow-y-scroll overflow-x-scroll"
                    style={{
                      scrollbarWidth: "thin", // Makes scrollbar thin in Firefox
                      scrollbarColor: "#C03178 transparent", // Sets track and thumb color in Firefox
                    }}
                  >
                    {timetable.length > 0 ? (
                      <>
                        <table className="min-w-full leading-normal table-auto">
                          <thead>
                            <tr className="bg-gray-100">
                              {["Sr No.", "Select All", "Class"].map(
                                (header, index) => (
                                  <th
                                    key={index}
                                    className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider"
                                  >
                                    {header === "Select All" ? (
                                      <div className="flex flex-col items-center justify-center gap-1">
                                        <span>{header}</span>
                                        <input
                                          type="checkbox"
                                          className="form-checkbox h-3 w-3 text-blue-600"
                                          checked={selectAll}
                                          onChange={handleSelectAll}
                                        />
                                      </div>
                                    ) : (
                                      header
                                    )}
                                  </th>
                                )
                              )}
                            </tr>
                          </thead>{" "}
                          <tbody>
                            {Object.values(
                              timetable.reduce((acc, student) => {
                                const {
                                  class_id,
                                  classname_section,
                                  section_id,
                                } = student;

                                if (!acc[class_id]) {
                                  acc[class_id] = {
                                    class_id: class_id,
                                    sections: [],
                                  };
                                }

                                // Push section name with its ID
                                acc[class_id].sections.push({
                                  section_id,
                                  classname_section,
                                });
                                return acc;
                              }, {})
                            ).map((group, index) => (
                              <tr
                                key={group.class_id}
                                className="border border-gray-300"
                              >
                                {/* Sr No */}
                                <td className="px-2 py-2 text-center border border-gray-300">
                                  {index + 1}
                                </td>

                                <td className="px-2 py-2 text-center border border-gray-300">
                                  <input
                                    type="checkbox"
                                    className="form-checkbox h-3 w-3 text-blue-600"
                                    checked={
                                      !!selectedCheckboxes[group.class_id]
                                    }
                                    onChange={() =>
                                      handleCheckboxChange(
                                        group,
                                        group.class_id
                                      )
                                    }
                                  />
                                </td>

                                <td className="px-2 py-2 text-center border border-gray-300">
                                  <div className="grid grid-cols-4 gap-4">
                                    {group.sections.map((section) => (
                                      <label
                                        key={section.section_id}
                                        className="flex items-center gap-2"
                                      >
                                        <input
                                          type="checkbox"
                                          className="form-checkbox h-3 w-3 text-green-600"
                                          checked={
                                            !!selectedCheckboxes[
                                              section.section_id
                                            ]
                                          }
                                          onChange={() =>
                                            handleCheckboxChange(
                                              group,
                                              group.class_id,
                                              section.section_id
                                            )
                                          }
                                        />
                                        <span>{section.classname_section}</span>
                                      </label>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className=" w-full md:w-[full]   flex justify-center flex-col md:flex-row gap-x-1     ml-0    p-2">
                          <div className="w-full md:w-[full] flex md:flex-row justify-between items-center mt-0 md:mt-4">
                            <div className="w-full md:w-[full] gap-x-0 md:gap-x-12  flex flex-col gap-y-2 md:gap-y-0 md:flex-row">
                              <div className="w-full md:w-[70%] gap-x-2 justify-around my-1 md:my-4 flex md:flex-row">
                                <label
                                  className="md:w-[60%] text-md pl-0 md:pl-5 mt-1.5"
                                  htmlFor="monfriSelect"
                                >
                                  Mon-Fri Periods{" "}
                                  <span className="text-sm text-red-500">
                                    *
                                  </span>
                                </label>
                                <div className="w-full md:w-[65%]">
                                  <input
                                    type="number"
                                    placeholder="Enter Period"
                                    value={periods["mon-fri"] || ""}
                                    onChange={(e) =>
                                      handlePeriodChange(
                                        "mon-fri",
                                        e.target.value
                                      )
                                    }
                                    max={9}
                                    min={1}
                                    className="text-sm w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={loadingExams}
                                  />
                                  {errors["mon-fri"] && (
                                    <span className="text-xs text-red-500">
                                      {errors["mon-fri"]}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="w-full md:w-[60%] gap-x-2 justify-around my-1 md:my-4 flex md:flex-row">
                                <label
                                  className="md:w-[50%] text-md pl-0 md:pl-5 mt-1.5"
                                  htmlFor="satSelect"
                                >
                                  Sat Periods{" "}
                                  <span className="text-sm text-red-500">
                                    *
                                  </span>
                                </label>
                                <div className="w-full md:w-[65%]">
                                  <input
                                    type="number"
                                    placeholder="Enter Period"
                                    value={periods["sat"] || ""}
                                    onChange={(e) =>
                                      handlePeriodChange("sat", e.target.value)
                                    }
                                    min={1}
                                    max={5}
                                    className="text-sm w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={loadingExams}
                                  />
                                  {errors["sat"] && (
                                    <span className="text-xs text-red-500">
                                      {errors["sat"]}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="mt-1">
                                <button
                                  type="submit"
                                  onClick={handleSubmit}
                                  style={{ backgroundColor: "#2196F3" }}
                                  className={` btn h-10 w-18 md:w-auto btn-primary text-white font-bold py-1 border-1 border-blue-500 px-4 rounded ${
                                    loadingForSearch
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
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
                                      Saving...
                                    </span>
                                  ) : (
                                    "Save"
                                  )}
                                </button>
                              </div>
                            </div>{" "}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-center items-center h-64">
                        {/* <div className="spinner-border text-primary" role="status"> */}
                        <LoaderStyle />
                        {/* </div> */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default CreateClassWisePeriodAllotment;
