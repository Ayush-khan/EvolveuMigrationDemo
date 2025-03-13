import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { RxCross1 } from "react-icons/rx";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

const PendingStudentId = () => {
  const API_URL = import.meta.env.VITE_API_URL; // URL for host
  const [classes, setClasses] = useState([]);
  const [pendingstudents, setPendingstudents] = useState([]);
  const [classIdForManage, setclassIdForManage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  //   variable to store the respone of the allot pendingstudent tab
  const [nameError, setNameError] = useState(null);
  //   const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageSize = 10;

  // for react-search of manage tab teacher Edit and select class
  const [selectedClass, setSelectedClass] = useState(null);
  const navigate = useNavigate();
  // State for form fields and validation errorsconst
  const [loading, setLoading] = useState(false); // For loader
  const [parentsData, setParentsData] = useState([]);
  const [selectedFathers, setSelectedFathers] = useState([]);
  const [errors, setErrors] = useState({});

  // Custom styles for the close button
  const classOptions = useMemo(
    () =>
      classes.map((cls) => ({
        value: { class_id: cls.class_id, section_id: cls.section_id }, // Store both values
        label: `${cls?.get_class?.name} ${cls.name}`, // Display class name & section
      })),
    [classes]
  );

  const handleClassSelect = (selectedOption) => {
    setNameError("");
    setSelectedClass(selectedOption);
    setclassIdForManage(selectedOption ? selectedOption.value : null);
    setPendingstudents([]); // Clear student list when class is changed
  };

  // Fetch initial data (classes with student count) and display loader while loading
  const fetchClassNameswithSection = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const classResponse = await axios.get(
        `${API_URL}/api/getallClassWithStudentCount`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClasses(classResponse.data || []);
    } catch (error) {
      toast.error("Error fetching initial data.");
    } finally {
      setLoading(false);
    }
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return ""; // Handle empty values safely
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleSearch = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    // Reset selectedClass when search is triggered

    setNameError("");

    if (!classIdForManage) {
      setNameError("Please select a Class.");
      setIsSubmitting(false);
      return;
    }

    setLoading(true);
    setSearchTerm(""); // Reset search term before starting a new search

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Authentication token is missing. Please log in.");
        throw new Error("Authentication token is missing.");
      }

      const { class_id, section_id } = classIdForManage || {};
      if (!class_id || !section_id) {
        toast.error("Invalid class selection. Please try again.");
        throw new Error("Class ID or Section ID is missing.");
      }

      const response = await axios.get(
        `${API_URL}/api/get_pendingstudentidcard?class_id=${class_id}&section_id=${section_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const studentData = response.data?.data;
      if (!Array.isArray(studentData) || studentData.length === 0) {
        toast.error("No pending students found for this class.");
        setParentsData([]); // Reset state to empty array
        setPendingstudents([]); // Reset pending students list
        return;
      }

      console.log("Extracted Pending Student List:", studentData);

      setPendingstudents(studentData); // Update student data in state
      setParentsData(studentData); // Store parents data for editing
      setPageCount(Math.ceil(studentData.length / pageSize)); // Update pagination
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch student details. Please try again."
      );
    } finally {
      setLoading(false);
      setIsSubmitting(false); // Set submitting state back to false
    }
  };

  const handleSelectFather = (parentId) => {
    if (!parentId) return; // Ensure parentId is valid
    const numericParentId = Number(parentId); // Convert to number

    setSelectedFathers((prevSelected) => {
      if (prevSelected.includes(numericParentId)) {
        return prevSelected.filter((id) => id !== numericParentId); // Remove if already selected
      } else {
        return [...prevSelected, numericParentId]; // Add only parent_id (as number)
      }
    });
  };

  const handleInputChange = (e, field, index) => {
    const { value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [`${index}-${field}`]: value.trim() ? "" : `${field} is required`,
    }));

    setPendingstudents((prev) =>
      prev.map((student, i) =>
        i === index
          ? {
              ...student,
              parent: {
                ...student.parent,
                [field]: value,
              },
            }
          : student
      )
    );
  };

  // handle sibling chnage
  const handleSiblingChange = (e, field, index, sIndex) => {
    const { value } = e.target;

    // Update errors state
    setErrors((prev) => ({
      ...prev,
      [`${index}-${sIndex}-${field}`]: value.trim()
        ? ""
        : `${field} is required`,
    }));

    // Update state only if value is valid
    setPendingstudents((prev) =>
      prev.map(
        (student, i) =>
          i === index
            ? {
                ...student,
                parent: {
                  ...student.parent,
                  siblings: student.parent.siblings.map(
                    (sibling, stdi) =>
                      stdi === sIndex
                        ? {
                            ...sibling,
                            [field]: value, // update the sibling's field
                          }
                        : sibling // return unchanged sibling if it's not the one being updated
                  ),
                },
              }
            : student // return unchanged student if it's not the one being updated
      )
    );
  };

  // Re-fetch data when the component mounts or after successful post
  useEffect(() => {
    fetchClassNameswithSection();
    // fetchHouses();
  }, []);

  useEffect(() => {
    if (Array.isArray(pendingstudents) && pendingstudents.length > 0) {
      const formattedParentsData = pendingstudents.map((student) => {
        console.log("Processing parent:", student.parent); // Debugging

        return {
          parent_id: student.parent?.parent_id || null,
          f_mobile: student.parent?.f_mobile || "",
          m_mobile: student.parent?.m_mobile || "",
          students: Array.isArray(student.parent?.siblings)
            ? student.parent.siblings.map((sibling) => ({
                student_id: sibling.student_id || null,
                permant_add: sibling.permant_add || "",
                blood_group: sibling.blood_group || "",
                house: sibling.house || "",
              }))
            : [], // Always return an array, avoid undefined
        };
      });

      console.log("📝 Formatted parentsData:", formattedParentsData);
      setParentsData(formattedParentsData);
    } else {
      console.warn("⚠️ No valid pendingstudents found.");
      setParentsData([]);
    }
  }, [pendingstudents]);

  // using this inside parent all students data check if any one empty not update
  const handleSubmitEdit = async () => {
    console.log("Selected Parents (IDs):", selectedFathers);
    console.log("Raw Parents Data:", parentsData);

    if (!parentsData || parentsData.length === 0) {
      toast.error("Data is still loading. Please wait.");
      return;
    }

    // 🔹 Convert `selectedFathers` & `parent_id` to numbers for strict comparison
    const selectedParentIds = new Set(selectedFathers.map((id) => Number(id)));

    console.log("Set of Selected Parent IDs:", selectedParentIds);

    // ✅ Filter parentsData based on selected parent IDs
    let filteredParentsData = parentsData.filter((parent) =>
      selectedParentIds.has(Number(parent.parent_id))
    );

    // 🔥 Remove duplicates using a Map (ensures unique `parent_id`s)
    filteredParentsData = Array.from(
      new Map(
        filteredParentsData.map((parent) => [parent.parent_id, parent])
      ).values()
    );

    console.log("Filtered Parents Data for Submission:", filteredParentsData);

    if (filteredParentsData.length === 0) {
      toast.error("No selected parent data available to update.");
      return;
    }

    // ✅ **Validation: Check if required fields are empty**
    for (const parent of filteredParentsData) {
      if (!parent.f_mobile || !parent.m_mobile) {
        toast.error("Father's and Mother's mobile numbers are required.");
        return;
      }

      for (const student of parent.students || []) {
        if (!student.permant_add || !student.blood_group || !student.house) {
          toast.error(
            "Permanent Address, Blood Group, and House are required for all students."
          );
          return;
        }
      }
    }

    const token = localStorage.getItem("authToken");

    try {
      // Use a structured JSON object instead of FormData
      const requestData = {
        parents: filteredParentsData.map((parent) => ({
          parent_id: parent.parent_id,
          f_mobile: parent.f_mobile,
          m_mobile: parent.m_mobile,
          students: parent.students
            ? parent.students.map((student) => ({
                student_id: student.student_id,
                permant_add: student.permant_add,
                blood_group: student.blood_group,
                house: student.house,
              }))
            : [],
        })),
      };

      console.log("Submitting Request Data:", requestData);

      const response = await axios.put(
        `${API_URL}/api/update_pendingstudentidcard`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure JSON format
          },
        }
      );

      if (response.status === 200) {
        toast.success("ID Card details updated successfully.");

        // ✅ **Refresh the pending students after successful update**
        handleSearch(); // 🔄 Reloads pending students

        // ✅ **Clear selected checkboxes after update**
        setSelectedFathers([]);
      } else {
        toast.error("Failed to update ID Card details.");
      }
    } catch (error) {
      console.error("Error updating student ID card:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const filteredSections = Array.isArray(pendingstudents)
    ? pendingstudents.filter((section) => {
        const searchLower = searchTerm.toLowerCase();
        const parentName = `${
          section?.parent?.father_name ?? ""
        }`.toLowerCase();
        const studentName =
          section?.parent?.siblings
            ?.map((sibling) =>
              `${sibling.first_name ?? ""} ${sibling.mid_name ?? ""} ${
                sibling.last_name ?? ""
              }`
                .trim()
                .toLowerCase()
            )
            .join(" ") ?? "";
        // Joins them into a single string for searching
        const studentClass =
          section?.parent?.siblings
            ?.map((sibling) => sibling["class-secname"]?.toLowerCase()) // Correct bracket notation
            .join(" ") ?? ""; // Join classes into a single string

        return (
          studentName.includes(searchLower) ||
          parentName.includes(searchLower) ||
          studentClass.includes(searchLower)
        );
      })
    : [];

  console.log(filteredSections);
  const displayedSections = filteredSections.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  // handle allot pendingstudent close model
  console.log("displayedSections", displayedSections);

  return (
    <>
      <div className="md:mx-auto md:w-[90%] p-4 bg-white mt-4 ">
        <div className=" card-header flex justify-between items-center ">
          <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
            Pending Student ID Card
          </h3>
          <RxCross1
            className=" relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
            onClick={() => {
              navigate("/dashboard");
            }}
          />
        </div>
        <div
          className=" relative  mb-8   h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>
        <div className="bg-white w-full md:w-[100%] mx-auto rounded-md ">
          <div className="w-full  mx-auto">
            <ToastContainer />

            <div className="max-w-full bg-white  p-2">
              <div className=" w-full md:w-[49%]   flex  flex-col md:flex-row gap-x-1 md:gap-x-6 ">
                <div className="w-full md:w-[60%]   gap-x-3 md:justify-center justify-around  my-1 md:my-4 flex  md:flex-row  ">
                  <label
                    htmlFor="classSection"
                    className=" mr-2 pt-2 items-center text-center"
                  >
                    Class <span className="text-red-500">*</span>
                  </label>
                  <div className="w-[65%] md:w-[55%] ">
                    <Select
                      value={selectedClass}
                      onChange={handleClassSelect}
                      options={classOptions}
                      placeholder="Select "
                      isSearchable
                      isClearable
                      className="text-sm"
                    />
                    {nameError && (
                      <div className=" relative top-0.5 ml-1 text-danger text-xs">
                        {nameError}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  type="button"
                  disabled={isSubmitting}
                  className="mr-0 md:mr-4 my-1 md:my-4 btn h-10  w-18 md:w-auto btn-primary "
                >
                  {isSubmitting ? "Searching..." : "Search"}
                </button>
              </div>
            </div>

            {pendingstudents.length > 0 && ( // selectedClass &&
              <div className="w-full  mt-4">
                <div className="card mx-auto lg:w-full shadow-lg">
                  <div className="p-2 px-3 bg-gray-100 border-none flex justify-between items-center">
                    <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
                      Pending Student ID Card List
                    </h3>
                    <div className="w-1/2 md:w-fit mr-1 ">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search "
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                    <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden w-full  md:w-[100%] mx-auto">
                      <table className="min-w-full leading-normal table-auto">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="px-2 w-full md:w-[4%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Sr. No
                            </th>
                            <th className="px-2 w-full md:w-[6%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Parent
                            </th>
                            <th className="px-2 w-full md:w-[9%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Father Mobile No.
                            </th>
                            <th className="px-2 w-full md:w-[9%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Mother Mobile No.
                            </th>
                            <th className="px-2 w-full md:w-[60%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              <th className="px-2 w-full md:w-[12%] text-center lg:px-3 py-2  text-sm font-semibold text-gray-900 tracking-wider">
                                {" "}
                                Student Name{" "}
                              </th>
                              <th className="px-2 w-full md:w-[8%] text-center lg:px-3 py-2  text-sm font-semibold text-gray-900 tracking-wider">
                                {" "}
                                Class
                              </th>
                              <th className="px-2 w-full md:w-[10%] text-center lg:px-3 py-2  text-sm font-semibold text-gray-900 tracking-wider">
                                DOB
                              </th>
                              <th className="px-2 w-full md:w-[16%] text-center lg:px-3 py-2  text-sm font-semibold text-gray-900 tracking-wider">
                                Address
                              </th>
                              <th className="px-2 w-full md:w-[7%] text-center lg:px-3 py-2  text-sm font-semibold text-gray-900 tracking-wider">
                                Blood Group
                              </th>
                              <th className="px-2 w-full md:w-[7%] text-center lg:px-3 py-2  text-sm font-semibold text-gray-900 tracking-wider">
                                House
                              </th>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedSections.length ? (
                            displayedSections.map((pendingstudent, index) => (
                              <tr
                                key={pendingstudent.student_id}
                                className="text-sm"
                              >
                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {currentPage * pageSize + index + 1}
                                </td>

                                {/* <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    <input
                                      type="checkbox"
                                      checked={selectedFathers.includes(
                                        Number(pendingstudent.parent?.parent_id)
                                      )} // Ensure number comparison
                                      onChange={
                                        () =>
                                          handleSelectFather(
                                            Number(
                                              pendingstudent.parent?.parent_id
                                            )
                                          ) // Pass number
                                      }
                                      className="mr-2"
                                    />
                                    
                                    {capitalizeFirstLetter(
                                      pendingstudent.parent?.father_name
                                    )}{" "}
                                  </td> */}

                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  <div className="flex flex-col items-center">
                                    <input
                                      type="checkbox"
                                      checked={selectedFathers.includes(
                                        Number(pendingstudent.parent?.parent_id)
                                      )} // Ensure number comparison
                                      onChange={() =>
                                        handleSelectFather(
                                          Number(
                                            pendingstudent.parent?.parent_id
                                          )
                                        )
                                      } // Pass number
                                      className="mb-1" // Adds spacing between checkbox and name
                                    />

                                    <span>
                                      {capitalizeFirstLetter(
                                        pendingstudent.parent?.father_name
                                      )}
                                    </span>
                                  </div>
                                </td>

                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  <input
                                    type="text"
                                    className="text-center w-full px-2 py-1 border rounded outline-none focus:ring focus:ring-blue-300"
                                    value={
                                      pendingstudent.parent?.f_mobile || ""
                                    }
                                    onChange={(e) =>
                                      handleInputChange(e, "f_mobile", index)
                                    }
                                    maxLength={10}
                                  />
                                  <div>
                                    {errors[`${index}-f_mobile`] && (
                                      <span className="error text-xs text-red-500">
                                        Father No. is required!{" "}
                                        {/* Custom error message */}
                                      </span>
                                    )}
                                  </div>
                                </td>

                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  <input
                                    type="text"
                                    className="text-center w-full px-2 py-1 border rounded outline-none focus:ring focus:ring-blue-300"
                                    value={
                                      pendingstudent.parent?.m_mobile || ""
                                    }
                                    onChange={(e) =>
                                      handleInputChange(e, "m_mobile", index)
                                    }
                                    maxLength={10}
                                  />
                                  <div>
                                    {errors[`${index}-m_mobile`] && (
                                      <span className="error text-xs text-red-500">
                                        Mother No. is required!{" "}
                                        {/* Custom error message */}
                                      </span>
                                    )}
                                  </div>
                                </td>

                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  <div className="flex flex-col gap-2 w-full">
                                    {pendingstudent.parent?.siblings?.length > 0
                                      ? pendingstudent.parent.siblings.map(
                                          (sibling, sIndex) => (
                                            <div
                                              key={sIndex}
                                              className="flex items-center border border-gray-400 rounded-md p-2 bg-gray-100 text-xs min-h-[100px] max-h-[120px] gap-x-4"
                                            >
                                              {/* Name (20%) */}
                                              <div className="w-[20%] break-words text-center lg:px-3 py-2 text-sm">
                                                {capitalizeFirstLetter(
                                                  sibling.first_name
                                                )}{" "}
                                                {capitalizeFirstLetter(
                                                  sibling.mid_name
                                                )}{" "}
                                                {capitalizeFirstLetter(
                                                  sibling.last_name
                                                )}
                                              </div>

                                              {/* Class (15%) */}
                                              <div className="w-[15%] truncate text-center lg:px-3 py-2  text-sm">
                                                {sibling["class-secname"] ||
                                                  "N/A"}
                                              </div>

                                              {/* DOB (15%) */}
                                              <div className="w-[17%] truncate text-center lg:px-3 py-2  text-sm">
                                                {sibling.dob || "N/A"}
                                              </div>

                                              {/* Address (25%) */}
                                              <div className="w-[25%] text-center  text-sm">
                                                <textarea
                                                  maxLength={200}
                                                  rows="4"
                                                  value={
                                                    sibling?.permant_add || ""
                                                  }
                                                  onChange={(e) =>
                                                    handleSiblingChange(
                                                      e,
                                                      "permant_add",
                                                      index,
                                                      sIndex
                                                    )
                                                  }
                                                  className="w-full text-xs bg-white border border-gray-400 rounded-md p-1"
                                                  required
                                                />
                                                {errors[
                                                  `${index}-${sIndex}-permant_add`
                                                ] && (
                                                  <span className="error text-xs text-red-500">
                                                    Address is required!{" "}
                                                    {/* Custom error message */}
                                                  </span>
                                                )}
                                              </div>

                                              {/* Blood Group (12%) */}
                                              <div className="w-[12%] p-1 text-center lg:px-3 py-2  text-sm">
                                                <select
                                                  value={
                                                    sibling.blood_group || ""
                                                  }
                                                  onChange={(e) =>
                                                    handleSiblingChange(
                                                      e,
                                                      "blood_group",
                                                      index,
                                                      sIndex
                                                    )
                                                  }
                                                  className="w-full border border-gray-400 rounded-md py-2 px-3 bg-white text-xs"
                                                  required
                                                >
                                                  <option value="">
                                                    Select
                                                  </option>
                                                  <option value="AB+">
                                                    AB+
                                                  </option>
                                                  <option value="AB-">
                                                    AB-
                                                  </option>
                                                  <option value="B+">B+</option>
                                                  <option value="B-">B-</option>
                                                  <option value="A+">A+</option>
                                                  <option value="A-">A-</option>
                                                  <option value="O+">O+</option>
                                                  <option value="O-">O-</option>
                                                </select>
                                                {errors[
                                                  `${index}-${sIndex}-blood_group`
                                                ] && (
                                                  <span className="error text-xs text-red-500">
                                                    Blood group is required!{" "}
                                                    {/* Custom error message */}
                                                  </span>
                                                )}
                                              </div>

                                              {/* House (12%) */}
                                              <div className="w-[12%] p-1 text-center lg:px-3 py-2 text-sm">
                                                <select
                                                  value={sibling.house || ""}
                                                  onChange={(e) =>
                                                    handleSiblingChange(
                                                      e,
                                                      "house",
                                                      index,
                                                      sIndex
                                                    )
                                                  }
                                                  className="w-full border border-gray-400 rounded-md py-2 px-3 bg-white text-xs"
                                                  required
                                                >
                                                  <option value="">
                                                    Select
                                                  </option>
                                                  <option value="D">
                                                    Diamond
                                                  </option>
                                                  <option value="R">
                                                    Ruby
                                                  </option>
                                                  <option value="E">
                                                    Emerald
                                                  </option>
                                                  <option value="S">
                                                    Sapphire
                                                  </option>
                                                </select>
                                                {errors[
                                                  `${index}-${sIndex}-house`
                                                ] && (
                                                  <span className="error text-xs text-red-500">
                                                    House is required!{" "}
                                                    {/* Custom error message */}
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          )
                                        )
                                      : "No Siblings"}
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="10"
                                className="text-center text-red-700 py-4"
                              >
                                Oops! No data found..
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      <div className="flex justify-end">
                        <button
                          className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded m-2"
                          onClick={handleSubmitEdit}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                    <div className=" flex justify-center pt-2 -mb-3">
                      <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        pageCount={pageCount}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={1}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        activeClassName={"active"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PendingStudentId;
