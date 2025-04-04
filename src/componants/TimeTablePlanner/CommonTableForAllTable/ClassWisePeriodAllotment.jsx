import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faRibbon,
} from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
const ClassWisePeriodAllotment = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  // const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentClassPeriod, setCurrentClassPeriod] = useState(null);
  const [currentClassPeriodName, setCurrentClassPeriodName] = useState(null);
  const [currentSectionPeriod, setCurrentSectionPeriod] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [monfriPeriod, setMonFriPeriod] = useState(null);
  const [satPeriod, setSatPeriod] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [periods, setPeriods] = useState({ "mon-fri": "", sat: "" });
  const [errors, setErrors] = useState({
    "mon-fri": "",
    sat: "",
  });

  const [loadingForSearch, setLoadingForSearch] = useState(false);

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [timetable, setTimetable] = useState([]);

  const pageSize = 10;
  const [pageCount, setPageCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    handleSearch();
  }, []);

  // Handle search and fetch parent information
  const handleSearch = async () => {
    setLoadingForSearch(false);
    setSearchTerm("");
    try {
      setLoadingForSearch(true); // Start loading
      setTimetable([]);
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/get_classwiseperiodlist`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Classwise Period Allocation Data", response);
      if (!response?.data?.data || response?.data?.length === 0) {
        toast.error("Classswise Period Allocation data not found.");
        setTimetable([]);
      } else {
        setTimetable(response?.data?.data);
        setPageCount(Math.ceil(response?.data?.data?.length / pageSize)); // Set page count based on response size
      }
    } catch (error) {
      console.error("Error fetching Classwise Period Allocation:", error);
      toast.error(
        "Error fetching Classwise Period Allocation. Please try again."
      );
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
      setLoadingForSearch(false);
    }
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setShowEditModal(false);
    setCurrentClassPeriod(null);
    setCurrentSectionPeriod(null);
    setMonFriPeriod();
    setSatPeriod();
  };

  const handleDelete = (currentPeriod) => {
    console.log("this is class id", currentPeriod.class_id);
    setCurrentClassPeriod(currentPeriod.class_id);
    setCurrentSectionPeriod(currentPeriod.section_id);
    setCurrentClassPeriodName(currentPeriod.classname);
    setShowDeleteModal(true);
  };

  const handleSubmitDelete = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token || !currentClassPeriod || !currentSectionPeriod) {
        throw new Error("Class And Section Id is missing");
      }

      const response = await axios.delete(
        `${API_URL}/api/delete_classwiseperiod/${currentClassPeriod}/${currentSectionPeriod}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      handleSearch();
      if (response.status === 200) {
        handleCloseModal();
        toast.success(
          `${currentClassPeriodName} Class Period deleted successfully!`
        );
      } else {
        toast.error("Class not found");
      }
    } catch (error) {
      console.error("Error deleting Class Period:", error);
      toast.error("Failed to delete Class Period");
      toast.error(error.response.data.error);
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
      setShowDeleteModal(false);
    }
  };

  // const validateSectionName = (classname, monFri, sat) => {
  // const errors = {};

  // if (!classname) {
  //   errors.classname = "Please select Class name.";
  // }

  // if (!monFri || isNaN(Number(monFri))) {
  //   errors["mon-fri"] = "Please enter Mon-Fri Period.";
  // } else if (Number(monFri) <= 0 || Number(monFri) >= 9) {
  //   errors["mon-fri"] = "Mon-Fri Period must be greater than 0 and less than 9.";
  // }

  // if (!sat || isNaN(Number(sat))) {
  //   errors.sat = "Please enter Sat Period.";
  // } else if (Number(sat) <= 0 || Number(sat) >= 5) {
  //   errors.sat = "Sat Period must be greater than 0 and less than 5.";
  // }

  // return errors;
  // };

  // const handleEdit = (section) => {
  // setCurrentClassPeriod(section.class_id);
  // setCurrentSectionPeriod(section.section_id);
  // setCurrentClassPeriodName(section?.classname);

  // // Set previously saved periods if available
  // setMonFriPeriod(section?.["mon-fri"] || "");
  // setSatPeriod(section?.sat || "");

  // setShowEditModal(true);
  // };

  const handleEdit = (section) => {
    setCurrentClassPeriod(section.class_id);
    setCurrentSectionPeriod(section.section_id);
    setCurrentClassPeriodName(section?.classname);

    // Ensure the previously saved periods are set before opening the modal
    setPeriods({
      "mon-fri": section["mon-fri"] || "",
      sat: section.sat || "",
    });

    setErrors({});
    setShowEditModal(true);
  };

  // const handleSubmitEdit = async () => {
  //     if (isSubmitting) return; // Prevent re-submitting
  //     setIsSubmitting(true);

  //     const validationErrors = validateSectionName(
  //       currentClassPeriodName,
  //       monfriPeriod,
  //       satPeriod
  //     );
  //     if (Object.keys(validationErrors).length > 0) {
  //       setFieldErrors(validationErrors);
  //       console.log("setFieldErrors", fieldErrors);
  //       setIsSubmitting(false); // Reset submitting state if validation fails
  //       return;
  //     }

  //     try {
  //       const token = localStorage.getItem("authToken");
  //       if (
  //         !token ||
  //         !currentClassPeriodName ||
  //         !monfriPeriod.["mon-fri"] ||
  //         !satPeriod.sat
  //       ) {
  //         throw new Error("No authentication token or required IDs found");
  //       }

  //       const response = await axios.put(
  //         `${API_URL}/api/update_classwiseperiod/${currentClassPeriod}/${currentSectionPeriod}`,
  //         {
  //           [mon-fri]: monfriPeriod,
  //           sat: satPeriod
  //         },
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //           withCredentials: true,
  //         }
  //       );

  //       console.log("Update response:", response.data);
  //       console.log("Sections fetched after update:", sections);

  //       fetchSections();
  //       handleCloseModal();
  //       toast.success("Class Period Allocation updated successfully!");
  //     } catch (error) {
  //       console.error("Error editing Staff Leave:", error);
  //       console.log("Error details:", error.response?.data || error.message);
  //       if (error.response && error.response.data.status === 422) {
  //         const errors = error.response.data.errors;
  //         // if (errors.staff_id) {
  //         //   setFieldErrors((prev) => ({
  //         //     ...prev,
  //         //     staff_id: errors.staff_id,
  //         //   }));
  //         //   errors.staff_id.forEach((err) => toast.error(err));
  //         // }
  //       } else {
  //         toast.error("Server error. Please try again later.");
  //       }
  //     } finally {
  //       setIsSubmitting(false); // Re-enable the button after the operation
  //     }
  // };

  const handleSubmitEdit = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);

    // const validationErrors = validateSectionName(
    //   currentClassPeriodName,
    //   monfriPeriod,
    //   satPeriod
    // );

    // if (Object.keys(validationErrors).length > 0) {
    //   setFieldErrors(validationErrors);
    //   console.log("setFieldErrors", validationErrors);
    //   setIsSubmitting(false); // Reset submitting state if validation fails
    //   return;
    // }

    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.put(
        `${API_URL}/api/update_classwiseperiod/${currentClassPeriod}/${currentSectionPeriod}`,
        {
          "mon-fri": periods["mon-fri"], // Pass the selected value for mon-fri
          sat: periods["sat"],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      console.log("Update response:", response.data);

      handleSearch();
      handleCloseModal();
      toast.success("Class Period Allocation updated successfully!");
    } catch (error) {
      console.error("Error editing Staff Leave:", error);
      console.log("Error details:", error.response?.data || error.message);

      if (error.response && error.response.data.status === 422) {
        const errors = error.response.data.errors;
        console.log("error", errors);
        // Handle specific validation errors from API response if needed
      } else {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  // const handlePeriodChange = (dayType, value) => {
  // // Parse the value to ensure it's a number
  // let parsedValue = parseInt(value, 10);

  // // If parsedValue is not a valid number (NaN), reset to empty or previous valid value
  // if (isNaN(parsedValue)) {
  //   parsedValue = "";
  // }

  // // Handle Mon-Fri Periods (value cannot exceed 9)
  // if (dayType === "mon-fri") {
  //   if (parsedValue === "") {
  //     // Allow clearing the value
  //     setPeriods((prevPeriods) => ({
  //       ...prevPeriods,
  //       [dayType]: parsedValue,
  //     }));
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       "mon-fri": "",
  //     }));
  //     return;
  //   }

  //   if (parsedValue > 9) {
  //     // Show error if the value exceeds 9
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       "mon-fri": "Mon-Fri Periods cannot be greater than 9.",
  //     }));
  //     return; // Prevent value change if the limit is exceeded
  //   } else if (parsedValue >= 1 && parsedValue <= 9) {
  //     // Update the periods if the value is within the valid range (1 to 9)
  //     setPeriods((prevPeriods) => ({
  //       ...prevPeriods,
  //       [dayType]: parsedValue,
  //     }));
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       "mon-fri": "", // Clear any error if the value is valid
  //     }));
  //   }
  // }

  // // Handle Sat Periods (value cannot exceed 5)
  // if (dayType === "sat") {
  //   if (parsedValue === "") {
  //     // Allow clearing the value
  //     setPeriods((prevPeriods) => ({
  //       ...prevPeriods,
  //       [dayType]: parsedValue,
  //     }));
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       sat: "",
  //     }));
  //     return;
  //   }

  //   if (parsedValue > 5) {
  //     // Show error if the value exceeds 5
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       sat: "Saturday Periods cannot be greater than 5.",
  //     }));
  //     return; // Prevent value change if the limit is exceeded
  //   } else if (parsedValue >= 1 && parsedValue <= 5) {
  //     // Update the periods if the value is within the valid range (1 to 5)
  //     setPeriods((prevPeriods) => ({
  //       ...prevPeriods,
  //       [dayType]: parsedValue,
  //     }));
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       sat: "", // Clear any error if the value is valid
  //     }));
  //   }
  // }
  // };
  const handlePeriodChange = (dayType, value) => {
    let parsedValue = parseInt(value, 10);

    // If input is empty, set error and prevent state update
    if (value.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [dayType]: `${
          dayType === "mon-fri" ? "Mon-Fri" : "Saturday"
        } Periods are required.`,
      }));
      setPeriods((prevPeriods) => ({
        ...prevPeriods,
        [dayType]: "", // Keep it empty
      }));
      return;
    }

    // If parsedValue is not a valid number (NaN), prevent update
    if (isNaN(parsedValue)) return;

    if (dayType === "mon-fri") {
      if (parsedValue < 1 || parsedValue > 9) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          "mon-fri": "Mon-Fri Periods must be between 1 and 9.",
        }));
        return;
      }
    } else if (dayType === "sat") {
      if (parsedValue < 1 || parsedValue > 5) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          sat: "Saturday Periods must be between 1 and 5.",
        }));
        return;
      }
    }

    // If valid, update state and clear errors
    setPeriods((prevPeriods) => ({
      ...prevPeriods,
      [dayType]: parsedValue,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [dayType]: "",
    }));
  };

  console.log("row", timetable);

  const filteredSections = timetable.filter((student) => {
    const searchLower = searchTerm.trim().toLowerCase(); // Trim spaces from input for cleaner search

    // Extract relevant fields and normalize spaces
    const className = student?.classname?.toLowerCase()?.trim() || "";
    const monfri = student?.["mon-fri"]?.toString()?.trim() || "";
    const sat = student?.sat?.toString()?.trim().toLowerCase() || "";

    // Check if the search term matches any of the fields
    return (
      className.includes(searchLower) ||
      monfri.includes(searchLower) ||
      sat.includes(searchLower)
    );
  });

  const displayedSections = filteredSections.slice(currentPage * pageSize);

  return (
    <>
      <div className="w-full md:w-[80%] mx-auto p-4 ">
        <ToastContainer />
        {/* {timetable.length > 0 && (
          <>
            <div className="w-full">
              <div className="card mx-auto lg:w-full shadow-lg">
                <div className="p-2 px-3 bg-gray-100 border-none flex justify-between items-center">
                  <div className="w-full flex flex-row justify-between mr-0 md:mr-4">
                    <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
                      List of Classwise Period Allocation
                    </h3>
                    <div className="box-border flex md:gap-x-2 justify-end md:h-10">
                      <div className=" w-1/2 md:w-fit mr-1">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search"
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <button
                        className="btn btn-primary btn-sm md:h-9 text-xs md:text-sm"
                        onClick={() =>
                          navigate("/createClasswisePeriodAllotment")
                        }
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{ marginRight: "5px" }}
                        />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className="relative w-[97%] mb-3 h-1 mx-auto"
                  style={{ backgroundColor: "#C03078" }}
                ></div>

                <div className="card-body w-full">
                  <div
                    className="h-96 lg:h-96 overflow-y-scroll overflow-x-scroll"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#C03178 transparent",
                    }}
                  >
                    <table className="min-w-full leading-normal table-auto">
                      <thead>
                        <tr className="bg-gray-100">
                          {[
                            "Sr No.",
                            "Class",
                            "Monday-Friday",
                            "Saturday",
                            "Edit",
                            "Delete",
                          ].map((header, index) => (
                            <th
                              key={index}
                              className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {displayedSections.length > 0 ? (
                          displayedSections.map((student, index) => (
                            <tr
                              key={student.adm_form_pk}
                              className="border border-gray-300"
                            >
                              <td className="px-2 py-2 text-center border border-gray-300">
                                {index + 1}
                              </td>
                              <td className="px-2 py-2 text-center border border-gray-300">
                                {student?.classname}
                              </td>
                              <td className="px-2 py-2 text-center border border-gray-300">
                                {student?.["mon-fri"]}
                              </td>
                              <td className="px-2 py-2 text-center border border-gray-300">
                                {student?.sat}
                              </td>
                              <td className="px-2 py-2 text-center border border-gray-300">
                                <button
                                  className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
                                  onClick={() => handleEdit(student)}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </button>
                              </td>
                              <td className="px-2 py-2 text-nowrap text-center border border-gray-300">
                                <button
                                  className="text-red-600 hover:text-red-800 hover:bg-transparent "
                                  onClick={() => handleDelete(student)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="6"
                              className="text-center text-xl text-red-700 py-4"
                            >
                              Oops! No data found..
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )} */}
        {
          <>
            <div className="w-full">
              <div className="card mx-auto lg:w-full shadow-lg">
                <div className="p-2 px-3 bg-gray-100 border-none flex justify-between items-center">
                  <div className="w-full flex flex-row justify-between mr-0 md:mr-4">
                    <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
                      List of Classwise Period Allocation
                    </h3>
                    <div className="box-border flex md:gap-x-2 justify-end md:h-10">
                      <div className="w-1/2 md:w-fit mr-1">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search"
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <button
                        className="btn btn-primary btn-sm md:h-9 text-xs md:text-sm"
                        onClick={() => navigate("/createClassWisePAllot")}
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{ marginRight: "5px" }}
                        />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className="relative w-[97%] mb-3 h-1 mx-auto"
                  style={{ backgroundColor: "#C03078" }}
                ></div>

                <div className="card-body w-full">
                  <div
                    className="h-96 lg:h-96 overflow-y-scroll overflow-x-scroll"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#C03178 transparent",
                    }}
                  >
                    <table className="min-w-full leading-normal table-auto">
                      <thead>
                        <tr className="bg-gray-100">
                          {[
                            "Sr No.",
                            "Class",
                            "Monday-Friday",
                            "Saturday",
                            "Edit",
                            "Delete",
                          ].map((header, index) => (
                            <th
                              key={index}
                              className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      {loadingForSearch ? (
                        <tbody>
                          <div className=" absolute left-[4%] w-[100%]  text-center flex justify-center items-center mt-14">
                            <div className=" text-center text-xl text-blue-700">
                              Please wait while data is loading...
                            </div>
                          </div>
                        </tbody>
                      ) : Array.isArray(displayedSections) &&
                        displayedSections.length > 0 ? (
                        <tbody>
                          {displayedSections.map((student, index) => (
                            <tr
                              key={student.adm_form_pk || index}
                              className="border border-gray-300"
                            >
                              <td className="px-2 py-2 text-center border border-gray-300">
                                {index + 1}
                              </td>
                              <td className="px-2 py-2 text-center border border-gray-300">
                                {student?.classname}
                              </td>
                              <td className="px-2 py-2 text-center border border-gray-300">
                                {student?.["mon-fri"]}
                              </td>
                              <td className="px-2 py-2 text-center border border-gray-300">
                                {student?.sat}
                              </td>
                              <td className="px-2 py-2 text-center border border-gray-300">
                                {String(student?.exists_in_timetable) ===
                                "false" ? (
                                  <button
                                    className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
                                    onClick={() => handleEdit(student)}
                                  >
                                    <FontAwesomeIcon icon={faEdit} />
                                  </button>
                                ) : (
                                  " "
                                )}
                              </td>
                              <td className="px-2 py-2 text-nowrap text-center border border-gray-300">
                                {String(student?.exists_in_timetable) ===
                                "false" ? (
                                  <button
                                    className="text-red-600 hover:text-red-800 hover:bg-transparent "
                                    onClick={() => handleDelete(student)}
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>
                                ) : (
                                  " "
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      ) : (
                        <tbody>
                          <tr>
                            <td
                              colSpan="6"
                              className="text-center text-xl text-red-700 py-4"
                            >
                              Oops! No data found..
                            </td>
                          </tr>
                        </tbody>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      </div>

      {showEditModal && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="flex justify-between p-3">
                <h5 className="modal-title">
                  Edit Classwise Period Allocation
                </h5>
                <RxCross1
                  className="float-end relative  mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                  type="button"
                  // className="btn-close text-red-600"
                  onClick={handleCloseModal}
                />
              </div>
              <div
                className=" relative  mb-3 h-1 w-[97%] mx-auto bg-red-700"
                style={{
                  backgroundColor: "#C03078",
                }}
              ></div>
              <div className="modal-body">
                <div className="relative mb-3 flex justify-center mx-4">
                  <label htmlFor="editStaffName" className="w-1/2 mt-2">
                    Class Name <span className="text-red-500">*</span>
                  </label>
                  <div className="w-[100%]">
                    <input
                      id="editStaffName"
                      className="form-control shadow-md"
                      value={currentClassPeriodName}
                      // onChange={handlePeriodChange}
                      disabled // Makes the select element readonly
                    />
                  </div>
                </div>

                <div className="relative mb-3 flex justify-center mx-4">
                  <label htmlFor="editLeaveAllocated" className="w-1/2 mt-2">
                    Mon-Fri Period<span className="text-red-500">*</span>
                  </label>
                  <div className="w-[100%]">
                    <input
                      type="number"
                      id="leaveAllocated"
                      className="form-control shadow-md"
                      min={1}
                      max={9}
                      placeholder="Enter Period"
                      value={periods["mon-fri"] || ""}
                      onChange={(e) =>
                        handlePeriodChange("mon-fri", e.target.value)
                      }
                    />
                    {errors["mon-fri"] && (
                      <span className="text-xs text-red-500 block mt-1">
                        {errors["mon-fri"]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative mb-3 flex justify-center mx-4">
                  <label htmlFor="editLeaveAllocated" className="w-1/2 mt-2">
                    Sat Period<span className="text-red-500">*</span>
                  </label>
                  <div className="w-[100%]">
                    <input
                      type="number"
                      id="leaveAllocated"
                      className="form-control shadow-md"
                      min={1}
                      max={9}
                      placeholder="Enter Period"
                      value={periods["sat"] || ""}
                      onChange={(e) =>
                        handlePeriodChange("sat", e.target.value)
                      }
                    />
                    {errors["sat"] && (
                      <span className="text-xs text-red-500 block mt-1">
                        {errors["sat"]}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className=" flex justify-end p-3">
                {/* <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button> */}
                <button
                  type="button"
                  // className="btn btn-primary"
                  className="btn btn-primary px-3 mb-2 "
                  style={{}}
                  onClick={handleSubmitEdit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal show " style={{ display: "block" }}>
            <div className="modal-dialog  modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title ">
                    Delete Class Period Allocation
                  </h5>
                  <RxCross1
                    className="float-end relative mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                    onClick={handleCloseModal}
                  />
                </div>
                <div
                  className=" relative  mb-3 h-1 w-[97%] mx-auto bg-red-700"
                  style={{
                    backgroundColor: "#C03078",
                  }}
                ></div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to delete? {currentClassPeriodName}{" "}
                    Class Period
                  </p>
                  {console.log(
                    "currestclassPeriodDelete",
                    currentClassPeriodName
                  )}
                </div>
                <div className=" flex justify-end p-3">
                  <button
                    type="button"
                    className="btn btn-danger px-3 mb-2"
                    onClick={handleSubmitDelete}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClassWisePeriodAllotment;
