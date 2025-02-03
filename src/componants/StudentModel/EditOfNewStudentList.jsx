import React, { useState, useEffect, useMemo } from "react";
import { FaUserCircle } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageCropper from "../common/ImageUploadAndCrop";
import { FaUserGroup } from "react-icons/fa6";
import Select from "react-select";
import Loader from "../common/LoaderFinal/LoaderStyle";
import LoadingSpinner from "../common/LoadingSpinner";

function EditOfNewStudentList() {
  const API_URL = import.meta.env.VITE_API_URL;
  // for unique user name
  const [loadingForUsername, setLoadingForUsername] = useState(false);

  const [usernameError, setUsernameError] = useState(""); // To store the error message
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [parentInformation, setParentInformation] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { student } = location.state || {};
  const [classForSiblingMapping, setClassForSiblingMapping] = useState(null);

  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);

  const [classError, setClassError] = useState("");
  const [divisionError, setDivisionError] = useState("");
  const [usernameErrors, setUsernameErrors] = useState({
    fatherMobile: "",
    motherMobile: "",
    fatherEmail: "",
    motherEmail: "",
  });
  const [nameError, setNameError] = useState("");
  const [selectedUsername, setSelectedUsername] = useState(null);

  // Fetch class names
  useEffect(() => {
    const fetchClassNames = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/api/getClassList`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(response.data);
        console.log("claases are", classes);
      } catch (error) {
        toast.error("Error fetching class names");
      }
    };

    fetchClassNames();
  }, [API_URL]);

  // Handle class change and fetch divisions
  const handleClassChange = async (e) => {
    const selectedClassId = e.target.value;
    setSelectedClass(selectedClassId);
    setFormData((prev) => ({
      ...prev,
      class_id: selectedClassId,
      section_id: "",
    }));
    setSelectedDivision(""); // Clear division when class changes

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/get_divisions/${selectedClassId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDivisions(response.data.divisions); // Update divisions based on selected class
    } catch (error) {
      toast.error("Error fetching divisions");
    }
  };

  // Handle division change
  const handleDivisionChange = (e) => {
    const selectedDivisionId = e.target.value;
    setSelectedDivision(selectedDivisionId);
    setFormData((prev) => ({ ...prev, section_id: selectedDivisionId }));
  };
  console.log("the data of student", student);
  const [formData, setFormData] = useState({
    // Student fields
    first_name: "",
    mid_name: "",
    last_name: "",
    house: "",
    student_name: "",
    dob: "",
    admission_date: "",
    stud_id_no: "",
    stu_aadhaar_no: "",
    gender: "",
    category: "",
    blood_group: " ",
    mother_tongue: "",
    permant_add: " ",
    birth_place: "",
    admission_class: "",
    city: "",
    state: "",
    roll_no: "",
    class_id: "",
    section_id: "",
    religion: "",
    caste: "",
    subcaste: "",
    vehicle_no: "",
    emergency_name: "",
    emergency_contact: "",
    emergency_add: "",
    transport_mode: " ",
    height: "",
    weight: "",
    allergies: "",
    nationality: "",
    pincode: "",
    image_name: "",
    // student_id: "",
    reg_no: " ",
    // Parent fields
    parent_id: "",
    father_name: "",
    father_occupation: "",
    f_office_add: "",
    f_office_tel: "",
    f_mobile: "",
    f_email: "",
    f_dob: " ",
    m_dob: " ",
    parent_adhar_no: "",
    mother_name: "",
    mother_occupation: "",
    m_office_add: "",
    m_office_tel: "",
    m_mobile: "",
    m_emailid: "",
    m_adhar_no: "",
    udise_pen_no: "",
    // Preferences
    SetToReceiveSMS: "",
    SetEmailIDAsUsername: "",
  });
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [backendErrors, setBackendErrors] = useState({});

  console.log("employeeID", student?.employeeId);

  // State for father's mobile selection
  const [fatherMobileSelected, setFatherMobileSelected] = useState({
    setUsername: false, // If father's mobile is set as username
    receiveSms: false, // If SMS is received on father's mobile
  });

  // State for mother's mobile selection
  const [motherMobileSelected, setMotherMobileSelected] = useState({
    setUsername: false, // If mother's mobile is set as username
    receiveSms: false, // If SMS is received on mother's mobile
  });

  // State for father's email selection
  const [fatherEmailSelected, setFatherEmailSelected] = useState({
    setUsername: false, // If father's email is set as username
  });

  // State for mother's email selection
  const [motherEmailSelected, setMotherEmailSelected] = useState({
    setUsername: false, // If mother's email is set as username
  });
  console.log("student", student);
  useEffect(() => {
    if (student) {
      setFormData({
        first_name: student.first_name || " ",
        mid_name: student.mid_name || "",
        last_name: student.last_name || "",
        house: student.house || "",
        student_name: student.student_name || "",
        dob: student.dob || "",
        admission_date: student.admission_date || "",
        stud_id_no: student.stud_id_no || "",
        stu_aadhaar_no: student.stu_aadhaar_no || "",
        gender: student.gender || "",
        permant_add: student.permant_add || " ",
        mother_tongue: student.mother_tongue || "",
        birth_place: student.birth_place || "",
        admission_class: student.admission_class || "",
        city: student.city || " ",
        state: student.state || "",
        roll_no: student.roll_no || "",
        // student_id: student.student_id || " ",
        reg_no: student.reg_no || " ",
        blood_group: student.blood_group || " ",
        category: student.category || "",
        class_id: student.class_id || "",
        section_id: student.section_id || "",
        religion: student.religion || "",
        caste: student.caste || "",
        subcaste: student.subcaste || "",
        transport_mode: student.transport_mode || " ",
        vehicle_no: student.vehicle_no || "",
        emergency_name: student.emergency_name || " ",
        emergency_contact: student.emergency_contact || "",
        emergency_add: student.emergency_add || "",
        height: student.height || "",
        weight: student.weight || "",
        allergies: student.allergies || "",
        nationality: student.nationality || "",
        pincode: student.pincode || "",
        image_name: student.image_name || "",
        // Parent information
        f_dob: student?.parents?.f_dob || " ",
        m_dob: student?.parents?.m_dob || " ",
        father_name: student?.parents?.father_name || " ",
        father_occupation: student?.parents?.father_occupation || "",
        f_office_add: student?.parents?.f_office_add || "  ",
        f_office_tel: student?.parents?.f_office_tel || "",
        f_mobile: student?.parents?.f_mobile || "",
        f_email: student?.parents?.f_email || "",
        parent_adhar_no: student?.parents?.parent_adhar_no || "",
        mother_name: student?.parents?.mother_name || " ",
        mother_occupation: student?.parents?.mother_occupation || "",
        m_office_add: student?.parents?.m_office_add || " ",
        m_office_tel: student?.parents?.m_office_tel || "",
        m_mobile: student?.parents?.m_mobile || "",
        m_emailid: student?.parents?.m_emailid || "",
        m_adhar_no: student?.parents?.m_adhar_no || "",
        udise_pen_no: student.udise_pen_no || " ",
        // Preferences
        SetToReceiveSMS: "",
        SetEmailIDAsUsername: "",

        // Base64 Image (optional)
        // student_image: student.student_image || "",
      });

      // Set the initial state for father's and mother's mobile preferences based on prefilled data
      // Update the state for username and SMS based on the prefilled data
      // Set initial state for mobile and email preferences based on prefilled data
      // setFatherMobileSelected({
      //   setUsername: student.SetEmailIDAsUsername === "FatherMob",
      //   receiveSms: student.SetToReceiveSMS === "FatherMob",
      // });
      // setMotherMobileSelected({
      //   setUsername: student.SetEmailIDAsUsername === "MotherMob",
      //   receiveSms: student.SetToReceiveSMS === "MotherMob",
      // });
      // setFatherEmailSelected({
      //   setUsername: student.SetEmailIDAsUsername === "Father",
      // });
      // setMotherEmailSelected({
      //   setUsername: student.SetEmailIDAsUsername === "Mother",
      // });

      setSelectedClass(student.class_id || ""); // Set the selected class
      setSelectedDivision(student.section_id || ""); // Set the selected division

      if (student?.image_name) {
        setPhotoPreview(
          // `${API_URL}/path/to/images/${student.teacher_image_name}`
          `https://sms.evolvu.in/storage/app/public/student_images/${student.image_name}`
        );
      }
    }
  }, [student, API_URL]);
  console.log("setPhotoPreview", photoPreview);
  // for fecting data for parent informations
  const [classesforForm, setClassesforForm] = useState([]);
  const [studentNameWithClassId, setStudentNameWithClassId] = useState([]);
  const [classIdForSearch, setClassIdForSearch] = useState(null);
  //   const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingForSibling, setLoadingForSibling] = useState(false);
  //   const [isDropdownDisabled, setIsDropdownDisabled] = useState(false);
  const [parentExist, setParentExist] = useState("no"); // Track the selected radio button
  // Handle radio button change
  const handleRadioChange = (e) => {
    const value = e.target.value;
    setParentExist(value);

    if (value === "no") {
      // Clear form data if "Yes" is selected
      setFormData((prevFormData) => ({
        ...prevFormData, // Spread the existing form data to keep it intact
        // Now update only the parent-related fields
        father_name: "",
        father_occupation: "",
        f_office_add: "",
        f_office_tel: "",
        f_mobile: "",
        f_email: "",
        parent_adhar_no: "",
        mother_name: "",
        mother_occupation: "",
        m_office_add: "",
        m_office_tel: "",
        m_mobile: "",
        m_emailid: "",
        m_adhar_no: "",
        f_dob: "",
        m_dob: "",
        f_blood_group: "",
        m_blood_group: "",
        SetToReceiveSMS: "",
        SetEmailIDAsUsername: "",
      }));
      setSelectedClass(null);
      setClassIdForSearch(null);
      setSelectedStudent(null);
      setSelectedStudentId(null);
      console.log("setClassIdForSearch_______!", classIdForSearch);
      fetchStudentNameWithClassId(null);
    }
  };

  // Conditionally disable/enable dropdowns and other fields based on the selected radio button value
  const isDropdownDisabled = parentExist === "no"; // Disable class and student dropdowns if "No" is selected
  const areOtherFieldsDisabled = parentExist === "yes"; // Disable other fields if "Yes" is selected

  // Custom styles for class dropdown
  const classOptions = useMemo(
    () =>
      classesforForm.map((cls) => ({
        value: cls.section_id,
        label: `${cls?.get_class?.name || " "} ${cls.name || " "}`,
        key: `${cls.class_id}-${cls.section_id}`, // Add key here for uniqueness
      })),
    [classesforForm]
  );

  // Custom styles for student dropdown
  const studentOptions = useMemo(
    () =>
      studentNameWithClassId.map((stu) => ({
        value: stu.student_id,
        label: `${stu?.first_name || " "} ${stu?.mid_name || " "} ${
          stu.last_name || " "
        }`,
      })),
    [studentNameWithClassId]
  );

  // Handle class selection
  const handleClassSelect = (selectedOption) => {
    setNameError("");

    setClassForSiblingMapping(selectedOption);
    setSelectedStudent(null); // Clear the student selection when class changes
    setSelectedStudentId(null);
    setClassIdForSearch(selectedOption.value);
    console.log("classIdForSearch__________", classIdForSearch);
    fetchStudentNameWithClassId(selectedOption.value); // Fetch students based on selected class
  };

  // Handle student selection
  const handleStudentSelect = (selectedOption) => {
    setNameError("");
    setSelectedStudent(selectedOption);
    setSelectedStudentId(selectedOption.value);
  };

  // Function to handle the search
  const handleSearch = async () => {
    if (!selectedStudentId) {
      setNameError("Please select a student.");
      toast.error("Please select a student!");
      return;
    }
    setLoadingForSibling(true);
    setErrors({});
    try {
      const token = localStorage.getItem("authToken");
      let response;
      if (selectedStudentId) {
        response = await axios.get(
          `${API_URL}/api/getParentInfoOfStudent/${selectedStudentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      console.log("Response:", response.data);
      const studentList = response?.data?.parent || [];
      if (studentList.length > 0) {
        // If parent data is found, set parentExist to "yes" and fill the fields
        setParentExist("yes");
        setParentInformation(studentList[0]); // Take the first parent's information
      } else {
        setParentInformation(null);
      }
      console.log("Parent info:", studentList);
    } catch (error) {
      toast.error("Error fetching student details.");
    } finally {
      setLoadingForSibling(false);
    }
  };

  // useEffect(() => {
  //   if (parentInformation) {
  //     setFormData((prevFormData) => ({
  //       ...prevFormData, // Spread the existing formData to retain other values
  //       // Now update only the parent-related fields
  //       parent_id: parentInformation.parent_id || " ",
  //       father_name: parentInformation.father_name || "",
  //       father_occupation: parentInformation.father_occupation || "",
  //       f_office_add: parentInformation.f_office_add || "",
  //       f_office_tel: parentInformation.f_office_tel || "",
  //       f_mobile: parentInformation.f_mobile || "",
  //       f_email: parentInformation.f_email || "",
  //       parent_adhar_no: parentInformation.parent_adhar_no || "",
  //       mother_name: parentInformation.mother_name || "",
  //       mother_occupation: parentInformation.mother_occupation || "",
  //       m_office_add: parentInformation.m_office_add || "",
  //       m_office_tel: parentInformation.m_office_tel || "",
  //       m_mobile: parentInformation.m_mobile || "",
  //       m_emailid: parentInformation.m_emailid || "",
  //       m_adhar_no: parentInformation.m_adhar_no || "",
  //       f_dob: parentInformation.f_dob || "",
  //       m_dob: parentInformation.m_dob || "",
  //       f_blood_group: parentInformation.f_blood_group || "",
  //       m_blood_group: parentInformation.m_blood_group || "",
  //     }));

  //     // Set additional preferences for mobile or email-based login or SMS settings
  //     setFatherMobileSelected({
  //       setUsername: parentInformation.SetEmailIDAsUsername === "FatherMob",
  //       receiveSms: parentInformation.SetToReceiveSMS === "FatherMob",
  //     });
  //     setMotherMobileSelected({
  //       setUsername: parentInformation.SetEmailIDAsUsername === "MotherMob",
  //       receiveSms: parentInformation.SetToReceiveSMS === "MotherMob",
  //     });
  //     setFatherEmailSelected({
  //       setUsername: parentInformation.SetEmailIDAsUsername === "Father",
  //     });
  //     setMotherEmailSelected({
  //       setUsername: parentInformation.SetEmailIDAsUsername === "Mother",
  //     });
  //   }
  // }, [parentInformation]);

  // Fetch classes with student count

  //  newLogic
  useEffect(() => {
    if (parentInformation) {
      setFormData((prevFormData) => ({
        ...prevFormData, // Spread the existing formData to retain other values
        parent_id: parentInformation.parent_id || " ",
        father_name: parentInformation.father_name || "",
        father_occupation: parentInformation.father_occupation || "",
        f_office_add: parentInformation.f_office_add || "",
        f_office_tel: parentInformation.f_office_tel || "",
        f_mobile: parentInformation.f_mobile || "",
        f_email: parentInformation.f_email || "",
        parent_adhar_no: parentInformation.parent_adhar_no || "",
        mother_name: parentInformation.mother_name || "",
        mother_occupation: parentInformation.mother_occupation || "",
        m_office_add: parentInformation.m_office_add || "",
        m_office_tel: parentInformation.m_office_tel || "",
        m_mobile: parentInformation.m_mobile || "",
        m_emailid: parentInformation.m_emailid || "",
        m_adhar_no: parentInformation.m_adhar_no || "",
        f_dob: parentInformation.f_dob || "",
        m_dob: parentInformation.m_dob || "",
        f_blood_group: parentInformation.f_blood_group || "",
        m_blood_group: parentInformation.m_blood_group || "",
        SetToReceiveSMS: parentInformation.SetToReceiveSMS || "",
        SetEmailIDAsUsername: parentInformation.SetEmailIDAsUsername || "",
      }));

      setFatherMobileSelected({
        setUsername: parentInformation.SetEmailIDAsUsername === "FatherMob",
        receiveSms: parentInformation.SetToReceiveSMS === "FatherMob",
      });
      setMotherMobileSelected({
        setUsername: parentInformation.SetEmailIDAsUsername === "MotherMob",
        receiveSms: parentInformation.SetToReceiveSMS === "MotherMob",
      });
      setFatherEmailSelected({
        setUsername: parentInformation.SetEmailIDAsUsername === "Father",
      });
      setMotherEmailSelected({
        setUsername: parentInformation.SetEmailIDAsUsername === "Mother",
      });

      // Setting up preselected values for the radio buttons based on parentInformation
      const userId = parentInformation?.SetEmailIDAsUsername; // Assuming user_master exists in parentInformation
      console.log("userId", userId);
      setFatherMobileSelected({
        setUsername:
          parentInformation.SetEmailIDAsUsername === "FatherMob" ||
          userId === parentInformation.f_mobile,
        receiveSms:
          parentInformation.SetToReceiveSMS === "FatherMob" ||
          userId === parentInformation.f_mobile,
      });
      setMotherMobileSelected({
        setUsername:
          parentInformation.SetEmailIDAsUsername === "MotherMob" ||
          userId === parentInformation.m_mobile,
        receiveSms:
          parentInformation.SetToReceiveSMS === "MotherMob" ||
          userId === parentInformation.m_mobile,
      });
      setFatherEmailSelected({
        setUsername:
          parentInformation.SetEmailIDAsUsername === "Father" ||
          userId === parentInformation.f_email,
      });
      setMotherEmailSelected({
        setUsername:
          parentInformation.SetEmailIDAsUsername === "Mother" ||
          userId === parentInformation.m_emailid,
      });
    }
  }, [parentInformation]);

  useEffect(() => {
    if (parentInformation) {
      // Set form data from student object...
      setFormData((prev) => ({
        ...prev,
        f_mobile: parentInformation?.f_mobile || "",
        f_email: parentInformation?.f_email || "",
        m_mobile: parentInformation?.m_mobile || "",
        m_emailid: parentInformation?.m_emailid || "",
        // SetToReceiveSMS: parentInformation?.SetToReceiveSMS || "",
        SetEmailIDAsUsername: parentInformation?.SetEmailIDAsUsername || "",
      }));

      // Initializing selectedUsername based on conditions
      // const userId = student.user_master?.user_id;
      // console.log("master user_id", userId);
      // if (userId === student.parents?.f_mobile) {
      //   setSelectedUsername("FatherMob");
      // } else if (userId === student.parents?.m_mobile) {
      //   setSelectedUsername("MotherMob");
      // } else if (userId === student.parents?.f_email) {
      //   setSelectedUsername("Father");
      // } else if (userId === student.parents?.m_emailid) {
      //   setSelectedUsername("Mother");
      // } else if (userId === undefined) {
      //   setSelectedUsername("");
      //   console.log("run conditon when userid is undefined");
      // }
      // const userId = student.user_master?.user_id;
      const userId = parentInformation?.SetEmailIDAsUsername
        ? parentInformation?.SetEmailIDAsUsername
        : null;
      console.log("master user_id", userId);

      // Check if userId is undefined and exit early
      if (userId === null) {
        setSelectedUsername("");
        console.log("User ID is undefined, skipping conditions");
        return;
      } else if (userId === parentInformation?.f_mobile) {
        setSelectedUsername("FatherMob");
      } else if (userId === parentInformation?.m_mobile) {
        setSelectedUsername("MotherMob");
      } else if (userId === parentInformation?.f_email) {
        setSelectedUsername("Father");
      } else if (userId === parentInformation?.m_emailid) {
        setSelectedUsername("Mother");
      } else {
        setSelectedUsername("");
        console.log("User ID does not match any condition");
      }

      // Set 'SetToReceiveSMS' based on mobile number matching
      if (parentInformation.SetToReceiveSMS === parentInformation?.f_mobile) {
        setFormData((prev) => ({
          ...prev,
          SetToReceiveSMS: "Father",
        }));
      } else if (
        parentInformation.SetToReceiveSMS === parentInformation?.m_mobile
      ) {
        setFormData((prev) => ({
          ...prev,
          SetToReceiveSMS: "Mother",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          SetToReceiveSMS: "",
        }));
      }
    }
  }, [parentInformation]);

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const classResponse = await axios.get(
        `${API_URL}/api/getallClassWithStudentCount`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClassesforForm(classResponse.data || []);
    } catch (error) {
      toast.error("Error fetching initial data.");
    }
  };

  // Fetch student list based on class ID
  const fetchStudentNameWithClassId = async (section_id = null) => {
    try {
      const params = section_id ? { section_id } : {};
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/getStudentListBySectionData`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );
      setStudentNameWithClassId(response?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching students.");
    }
  };

  useEffect(() => {
    fetchInitialData(); // Fetch classes when the component mounts
    fetchStudentNameWithClassId();
  }, []);

  // Fetch divisions when the class is already selected (for pre-filled data)
  useEffect(() => {
    if (selectedClass) {
      const fetchDivisions = async () => {
        try {
          const token = localStorage.getItem("authToken");
          const response = await axios.get(
            `${API_URL}/api/get_divisions/${selectedClass}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setDivisions(response?.data?.divisions); // Update divisions
        } catch (error) {
          toast.error("Error fetching divisions");
        }
      };

      fetchDivisions();
    }
  }, [selectedClass, API_URL]);

  // Function to check username uniqueness
  // Function to check username uniqueness
  // const studentId=student.student_id
  // console.log("studentId",studentId)
  // const checkUserId = async (studentId, userId) => {
  //   try {
  //     const token = localStorage.getItem("authToken");

  //     const response = await axios.get(
  //       `${API_URL}/api/check-user-id/${studentId}/${userId}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     return response.data; // API returns true or false
  //   } catch (error) {
  //     console.error("Error checking username uniqueness:", error);
  //     return false;
  //   }
  // };
  // const handleSetUsernameSelection = async (value, userId) => {
  //   const isUnique = await checkUserId(student.student_id, userId); // Check if username is unique

  //   if (!isUnique) {
  //     setUsernameError(`Username "${userId}" is already taken.`);
  //   } else {
  //     setUsernameError(""); // Clear error if the username is unique
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       SetEmailIDAsUsername: value, // Set the selected username in formData
  //     }));
  //   }
  // };
  const checkUserId = async (studentId, userId) => {
    setLoadingForUsername(true);
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${API_URL}/api/check-user-id/${studentId}/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response?.data?.exists;
    } catch (error) {
      console.error("Error checking username uniqueness:", error);
      return false; // Default to false if there's an error
    } finally {
      setLoadingForUsername(false);
    }
  };

  const handleSetUsernameSelection = async (value, userId, key) => {
    const usernameExists = await checkUserId(student.student_id, userId);
    setUsernameErrors("");
    if (usernameExists) {
      setUsernameErrors((prevErrors) => ({
        ...prevErrors,
        [key]: `Username is already taken.`,
      }));
    } else {
      setUsernameErrors((prevErrors) => ({
        ...prevErrors,
        [key]: "", // Clear error if username is unique
      }));

      setFormData((prevData) => ({
        ...prevData,
        SetEmailIDAsUsername: value, // Set the selected username in formData
      }));
    }

    // Update selectedUsername state
    setSelectedUsername(value);
  };

  const handleFatherMobileSelection = async () => {
    setUsernameErrors("");
    // Clear only the SetEmailIDAsUsername error
    setErrors((prevErrors) => ({
      ...prevErrors,
      SetEmailIDAsUsername: "", // Clear username error
    }));
    await handleSetUsernameSelection(
      "FatherMob",
      formData.f_mobile,
      "fatherMobile"
    );
  };

  const handleMotherMobileSelection = async () => {
    setUsernameErrors("");
    setErrors((prevErrors) => ({
      ...prevErrors,
      SetEmailIDAsUsername: "",
    }));
    await handleSetUsernameSelection(
      "MotherMob",
      formData.m_mobile,
      "motherMobile"
    );
  };

  const handleFatherEmailSelection = async () => {
    setUsernameErrors("");
    // Clear only the SetEmailIDAsUsername error
    setErrors((prevErrors) => ({
      ...prevErrors,
      SetEmailIDAsUsername: "",
    }));
    await handleSetUsernameSelection("Father", formData.f_email, "fatherEmail");
  };

  const handleMotherEmailSelection = async () => {
    setUsernameErrors("");
    // Clear only the SetEmailIDAsUsername error
    setErrors((prevErrors) => ({
      ...prevErrors,
      SetEmailIDAsUsername: "",
    }));
    await handleSetUsernameSelection(
      "Mother",
      formData.m_emailid,
      "motherEmail"
    );
  };

  // Handle SMS selection
  const handleReceiveSmsSelection = (value) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      SetToReceiveSMS: "", // Clear SetToReceiveSMS error when this is selected
    }));
    setFormData((prevData) => ({
      ...prevData,
      SetToReceiveSMS: value, // One of 'FatherMob', 'MotherMob'
    }));
  };

  // Validation Functions
  const validatePhone = (phone) => {
    if (!phone) return "Phone number is required";
    if (!/^\d{10}$/.test(phone)) return "Phone number must be 10 digits";
    return null;
  };

  const validateAadhar = (aadhar) => {
    if (!aadhar) return "Aadhar card number is required";
    if (!/^\d{12}$/.test(aadhar.replace(/\s+/g, "")))
      return "Aadhar card number must be 12 digits";
    return null;
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Email address is invalid";
    return null;
  };

  // Handle change and field-level validation

  // const validate = () => {
  //   const newErrors = {};

  //   // Required field validations
  //   if (!formData?.SetEmailIDAsUsername) {
  //     newErrors.SetEmailIDAsUsername = "User name is required";
  //   }
  //   if (!formData?.SetToReceiveSMS) {
  //     newErrors.SetToReceiveSMS = "Receive SMS name is required";
  //   }
  //   if (!formData.first_name?.trim()) {
  //     newErrors.first_name = "First name is required";
  //   }
  //   if (!formData.dob) {
  //     newErrors.dob = "Date of Birth is required";
  //   }
  //   if (!formData.nationality) {
  //     newErrors.nationality = "Nationality is required";
  //   }
  //   if (!formData.mother_tongue) {
  //     newErrors.mother_tongue = "Mother Tongue is required";
  //   }
  //   if (!formData.student_name?.trim()) {
  //     newErrors.student_name = "Student name is required";
  //   }
  //   if (!formData.reg_no?.trim()) {
  //     newErrors.reg_no = "GR number is required";
  //   }
  //   if (!formData.admission_date) {
  //     newErrors.admission_date = "Date of admission is required";
  //   }
  //   if (!formData.permant_add?.trim()) {
  //     newErrors.permant_add = "Permanent address is required";
  //   }
  //   if (!formData.city?.trim()) {
  //     newErrors.city = "City is required";
  //   }
  //   if (!formData.state?.trim()) {
  //     newErrors.state = "State is required";
  //   }

  //   // Dropdown field validations

  //   if (
  //     !formData.category ||
  //     formData.category == "Select" ||
  //     formData.category == null
  //   ) {
  //     newErrors.category = "Category selection is required";
  //   }
  //   if (
  //     !formData.gender ||
  //     formData.gender == "Select" ||
  //     formData.gender == null
  //   ) {
  //     newErrors.gender = "Gender selection is required";
  //   }
  //   if (
  //     !formData.religion ||
  //     formData.religion == "Select" ||
  //     formData.religion == null
  //   ) {
  //     newErrors.religion = "Religion selection is required";
  //   }
  //   if (
  //     !formData.admission_class ||
  //     formData.admission_class == "Select" ||
  //     formData.admission_class == null
  //   ) {
  //     newErrors.admission_class = "Admission class selection is required";
  //   }
  //   if (
  //     !formData.class_id ||
  //     formData.class_id == "Select" ||
  //     formData.class_id == null
  //   ) {
  //     newErrors.class_id = "Class selection is required";
  //   }
  //   if (
  //     !formData.section_id ||
  //     formData.section_id == "Select" ||
  //     formData.section_id == null
  //   ) {
  //     newErrors.section_id = "Division selection is required";
  //   }

  //   // Phone and Aadhaar validations
  //   const phoneError = validatePhone(formData.f_mobile);
  //   if (phoneError) {
  //     newErrors.f_mobile = phoneError;
  //   }

  //   const m_mobile = validatePhone(formData.m_mobile);
  //   if (m_mobile) {
  //     newErrors.m_mobile = m_mobile;
  //   }

  //   const stu_aadhaar_no = validateAadhar(formData.stu_aadhaar_no);
  //   if (stu_aadhaar_no) {
  //     newErrors.stu_aadhaar_no = stu_aadhaar_no;
  //   }

  //   const m_adhar_no = validateAadhar(formData.m_adhar_no);
  //   if (m_adhar_no) {
  //     newErrors.m_adhar_no = m_adhar_no;
  //   }

  //   const aadharError = validateAadhar(formData.parent_adhar_no);
  //   if (aadharError) {
  //     newErrors.parent_adhar_no = aadharError;
  //   }

  //   // Email validations
  //   const f_email = validateEmail(formData.f_email);
  //   if (f_email) {
  //     newErrors.f_email = f_email;
  //   }

  //   const m_emailid = validateEmail(formData.m_emailid);
  //   if (m_emailid) {
  //     newErrors.m_emailid = m_emailid;
  //   }

  //   // Guardian fields
  //   if (!formData.father_name?.trim()) {
  //     newErrors.father_name = "Father Name is required";
  //   }
  //   if (!formData.mother_name?.trim()) {
  //     newErrors.mother_name = "Mother Name is required";
  //   }
  //   if (!formData.m_adhar_no?.trim()) {
  //     newErrors.m_adhar_no = "Mother Aadhaar Card No. is required";
  //   }
  //   if (!formData.stu_aadhaar_no?.trim()) {
  //     newErrors.stu_aadhaar_no = "Student Aadhaar Card No. is required";
  //   }
  //   if (!formData.parent_adhar_no?.trim()) {
  //     newErrors.parent_adhar_no = "Father Aadhaar Card No. is required";
  //   }

  //   return newErrors;
  // };
  const validate = () => {
    const newErrors = {};

    // Required field validations
    if (
      !formData?.SetEmailIDAsUsername ||
      formData.SetEmailIDAsUsername == null ||
      formData.SetEmailIDAsUsername == ""
    ) {
      newErrors.SetEmailIDAsUsername = "User name is required";
    }
    if (
      !formData?.SetToReceiveSMS ||
      formData.SetToReceiveSMS == null ||
      formData.SetToReceiveSMS == ""
    ) {
      newErrors.SetToReceiveSMS = "Receive SMS name is required";
    }
    if (
      !formData.first_name?.trim() ||
      formData.first_name == null ||
      formData.first_name == ""
    ) {
      newErrors.first_name = "First name is required";
    }
    if (
      !formData.dob ||
      formData.dob == null ||
      formData.dob == "" ||
      formData.dob == "0000-00-00"
    ) {
      newErrors.dob = "Date of Birth is required";
    }
    if (
      !formData.nationality ||
      formData.nationality == null ||
      formData.nationality == ""
    ) {
      newErrors.nationality = "Nationality is required";
    }
    if (
      !formData.mother_tongue ||
      formData.mother_tongue == null ||
      formData.mother_tongue == ""
    ) {
      newErrors.mother_tongue = "Mother Tongue is required";
    }
    if (
      !formData.student_name?.trim() ||
      formData.student_name == null ||
      formData.student_name == ""
    ) {
      newErrors.student_name = "Student name is required";
    }
    if (
      !formData.reg_no?.trim() ||
      formData.reg_no == null ||
      formData.reg_no == ""
    ) {
      newErrors.reg_no = "GR number is required";
    }
    if (
      !formData.admission_date ||
      formData.admission_date == null ||
      formData.admission_date == "" ||
      formData.admission_date == "0000-00-00"
    ) {
      newErrors.admission_date = "Date of admission is required";
    }
    if (
      !formData.permant_add?.trim() ||
      formData.permant_add == null ||
      formData.permant_add == ""
    ) {
      newErrors.permant_add = "Permanent address is required";
    }
    if (
      !formData.city?.trim() ||
      formData.city == null ||
      formData.city == ""
    ) {
      newErrors.city = "City is required";
    }
    if (
      !formData.state?.trim() ||
      formData.state == null ||
      formData.state == ""
    ) {
      newErrors.state = "State is required";
    }

    // Dropdown field validations
    if (
      !formData.category ||
      formData.category == "Select" ||
      formData.category == null ||
      formData.category == ""
    ) {
      newErrors.category = "Category selection is required";
    }
    if (
      !formData.gender ||
      formData.gender == "Select" ||
      formData.gender == null ||
      formData.gender == ""
    ) {
      newErrors.gender = "Gender selection is required";
    }
    if (
      !formData.religion ||
      formData.religion == "Select" ||
      formData.religion == null ||
      formData.religion == ""
    ) {
      newErrors.religion = "Religion selection is required";
    }
    if (
      !formData.admission_class ||
      formData.admission_class == "Select" ||
      formData.admission_class == "null" ||
      formData.admission_class == ""
    ) {
      newErrors.admission_class = "Admission class selection is required";
    }
    if (
      !formData.class_id ||
      formData.class_id == "Select" ||
      formData.class_id == null ||
      formData.class_id == ""
    ) {
      newErrors.class_id = "Class selection is required";
    }
    if (
      !formData.section_id ||
      formData.section_id == "Select" ||
      formData.section_id == null ||
      formData.section_id == ""
    ) {
      newErrors.section_id = "Division selection is required";
    }

    // Phone and Aadhaar validations
    const phoneError = validatePhone(formData.f_mobile);
    if (phoneError) {
      newErrors.f_mobile = phoneError;
    }

    const m_mobile = validatePhone(formData.m_mobile);
    if (m_mobile) {
      newErrors.m_mobile = m_mobile;
    }

    const stu_aadhaar_no = validateAadhar(formData.stu_aadhaar_no);
    if (stu_aadhaar_no) {
      newErrors.stu_aadhaar_no = stu_aadhaar_no;
    }

    const m_adhar_no = validateAadhar(formData.m_adhar_no);
    if (m_adhar_no) {
      newErrors.m_adhar_no = m_adhar_no;
    }

    const aadharError = validateAadhar(formData.parent_adhar_no);
    if (aadharError) {
      newErrors.parent_adhar_no = aadharError;
    }

    // Email validations
    const f_email = validateEmail(formData.f_email);
    if (f_email) {
      newErrors.f_email = f_email;
    }

    const m_emailid = validateEmail(formData.m_emailid);
    if (m_emailid) {
      newErrors.m_emailid = m_emailid;
    }

    // Guardian fields
    if (
      !formData.father_name?.trim() ||
      formData.father_name == null ||
      formData.father_name == ""
    ) {
      newErrors.father_name = "Father Name is required";
    }
    if (
      !formData.mother_name?.trim() ||
      formData.mother_name == null ||
      formData.mother_name == ""
    ) {
      newErrors.mother_name = "Mother Name is required";
    }
    if (
      !formData.m_adhar_no?.trim() ||
      formData.m_adhar_no == null ||
      formData.m_adhar_no == ""
    ) {
      newErrors.m_adhar_no = "Mother Aadhaar Card No. is required";
    }
    if (
      !formData.stu_aadhaar_no?.trim() ||
      formData.stu_aadhaar_no == null ||
      formData.stu_aadhaar_no == ""
    ) {
      newErrors.stu_aadhaar_no = "Student Aadhaar Card No. is required";
    }
    if (
      !formData.parent_adhar_no?.trim() ||
      formData.parent_adhar_no == null ||
      formData.parent_adhar_no == ""
    ) {
      newErrors.parent_adhar_no = "Father Aadhaar Card No. is required";
    }

    return newErrors;
  };

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    let newValue = value;

    if (type === "checkbox") {
      newValue = checked;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));

    // Clear backend errors for specific fields on change
    if (
      name === "stud_id_no" ||
      name === "stu_aadhaar_no" ||
      name === "udise_pen_no" ||
      name === "reg_no"
    ) {
      setBackendErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined, // Remove the backend error for the field
      }));
    }
    // Validate field on change
    let fieldErrors = {};
    if (name === "f_mobile") {
      fieldErrors.f_mobile = validatePhone(newValue);
    } else if (name === "m_mobile") {
      fieldErrors.m_mobile = validatePhone(newValue);
    } else if (name === "parent_adhar_no") {
      fieldErrors.parent_adhar_no = validateAadhar(newValue);
    } else if (name === "stu_aadhaar_no") {
      fieldErrors.stu_aadhaar_no = validateAadhar(newValue);
    } else if (name === "f_email" || name === "m_emailid") {
      fieldErrors[name] = validateEmail(newValue);
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...fieldErrors,
    }));
  };

  // const validatePhone = (phone) => {
  //   if (!phone) return "Phone number is required";
  //   if (!/^\d{10}$/.test(phone)) return "Phone number must be 10 digits";
  //   return null;
  // };

  // const validateAadhar = (aadhar) => {
  //   if (!aadhar) return "Aadhar card number is required";
  //   if (!/^\d{12}$/.test(aadhar.replace(/\s+/g, "")))
  //     return "Aadhar card number must be 12 digits";
  //   return null;
  // };

  // const validateEmail = (email) => {
  //   if (!email) return "Email is required";
  //   if (!/\S+@\S+\.\S+/.test(email)) return "Email address is invalid";
  //   return null;
  // };

  // const validate = () => {
  //   const newErrors = {};
  //   if (!formData.first_name) newErrors.first_name = "First name is required";
  //   // Add other field validations
  //   const phoneError = validatePhone(formData.phone);
  //   if (phoneError) newErrors.phone = phoneError;
  //   const aadharError = validateAadhar(formData.aadhar_card_no);
  //   if (aadharError) newErrors.aadhar_card_no = aadharError;
  //   const emailError = validateEmail(formData.email);
  //   if (emailError) newErrors.email = emailError;
  //   return newErrors;
  // };

  // const handleChange = (event) => {
  //   const { name, value, checked, type } = event.target;
  //   let newValue = value;

  //   if (type === "checkbox") {
  //     newValue = checked;
  //   }

  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: newValue,
  //   }));

  //   // Validate field on change
  //   let fieldErrors = {};
  //   if (name === "phone") {
  //     fieldErrors.phone = validatePhone(newValue);
  //   } else if (name === "aadhar_card_no") {
  //     fieldErrors.aadhar_card_no = validateAadhar(newValue);
  //   } else if (name === "email") {
  //     fieldErrors.email = validateEmail(newValue);
  //   }

  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     ...fieldErrors,
  //   }));
  // };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setFormData((prevState) => ({
  //       ...prevState,
  //       student_image: file,
  //     }));
  //     setPhotoPreview(URL.createObjectURL(file));
  //   }
  // };

  const handleImageCropped = (croppedImageData) => {
    setFormData((prevData) => ({
      ...prevData,
      image_name: croppedImageData,
    }));
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const validationErrors = validate();

  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     Object.values(validationErrors).forEach((error) => {
  //       toast.error(error);
  //     });
  //     return;
  //   }

  //   // Prepare the data for API submission
  //   const formattedFormData = new FormData();
  //   Object.keys(formData).forEach((key) => {
  //     if (formData[key] instanceof File) {
  //       formattedFormData.append(key, formData[key]);
  //     } else {
  //       formattedFormData.append(key, formData[key]);
  //     }
  //   });
  //   console.log(" formattedFormData is,", formData);

  //   try {
  //     const token = localStorage.getItem("authToken");
  //     if (!token) {
  //       throw new Error("No authentication token is found");
  //     }
  //     console.log(" formattedFormData,", formattedFormData);
  //     const response = await axios.put(
  //       `${API_URL}/api/students/${student.student_id}`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       toast.success("Student updated successfully!");
  //       setTimeout(() => {
  //         navigate("/StudentList");
  //       }, 3000);
  //     }
  //   } catch (error) {
  //     toast.error("An error occurred while updating the student.");
  //     console.error("Error:", error.response?.data || error.message);
  //     if (error.response && error.response.data && error.response.data.errors) {
  //       setBackendErrors(error.response.data.errors || {});
  //     } else {
  //       toast.error(error.message);
  //     }
  //   }
  // };
  const handleSubmit = async (event) => {
    console.log("hudsfh");
    event.preventDefault();
    // const validationErrors = validate();

    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   Object.values(validationErrors).forEach((error) => {
    //     console.log(error);
    //   });
    //   console.log("error in feilds name");

    //   return;
    // }
    setErrors({});
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log("Validation Errors:", validationErrors);
      return;
    }
    // Check for username-specific errors
    const hasUsernameErrors = Object.values(usernameErrors).some(
      (error) => error !== ""
    );
    if (hasUsernameErrors) {
      // Set backend errors if any
      if (hasUsernameErrors) {
        Object.keys(usernameErrors).forEach((key) => {
          if (usernameErrors[key]) {
            console.log(usernameErrors[key]);
          }
        });
      }
      console.log("error in the uniquye name");
      // Exit function if there are validation errors or username errors
      return;
    }
    // // Create FormData object
    // const formattedFormData = new FormData();
    // Object.keys(formData).forEach((key) => {
    //   formattedFormData.append(key, formData[key]);
    // });
    if (parentExist === "no") {
      formData.parent_id = 0;
      console.log("formadata parent_id not exit", formData.parent_id);
    } else {
      console.log("formadata parent_id is exit", formData.parent_id);
    }
    try {
      setBackendErrors({});
      setLoading(true); // Start loading
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }
      // console.log("formattedFormData", formattedFormData);
      console.log("formData", formData);
      // const ParentIdIs=formData.parent_id;
      const response = await axios.put(
        `${API_URL}/api/updateNewStudent/${student.student_id}/${formData?.parent_id}`,
        formData, // Send the FormData object
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Student updated successfully!");
        setTimeout(() => {
          navigate("/newStudentList");
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      if (error.response && error.response.data && error.response.data.errors) {
        setBackendErrors(error.response.data.errors || {});
        toast.error(
          "Some fields contain duplicate data. Please ensure all values are unique."
        );
      } else {
        toast.error(
          error.message || "Backdend error occur while updating data"
        );
      }
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Fetch class names when component loads

  return (
    <div className=" w-[95%] mx-auto p-4">
      <ToastContainer />
      <div className="card p-3  rounded-md">
        <div className="card-header mb-4 flex justify-between items-center">
          <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
            Edit Student Information
          </h5>
          <RxCross1
            className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
            onClick={() => navigate("/newStudentList")}
          />
        </div>
        <div
          className="relative w-full -top-6 h-1 mx-auto bg-red-700"
          style={{ backgroundColor: "#C03078" }}
        ></div>
        <p className=" md:absolute md:right-8 md:top-[5%] text-gray-500">
          <span className="text-red-500">*</span> indicates mandatory
          information
        </p>
        <form
          onSubmit={handleSubmit}
          className="md:mx-2 overflow-x-hidden shadow-md py-1 bg-gray-50"
        >
          {loading ? (
            <div className=" inset-0 flex items-center justify-center bg-gray-50  z-10">
              <Loader /> {/* Replace this with your loader component */}
            </div>
          ) : (
            <div className="flex flex-col gap-y-3 p-2 md:grid md:grid-cols-4 md:gap-x-14 md:mx-10 ">
              <h5 className="col-span-4 text-blue-400  relative top-2">
                {" "}
                Personal Information
              </h5>
              <div className=" row-span-2  ">
                <ImageCropper
                  photoPreview={photoPreview}
                  onImageCropped={handleImageCropped}
                />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="first_name"
                  className="block font-bold text-xs mb-0.5"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  maxLength={100}
                  // required
                  value={formData.first_name}
                  onChange={handleChange}
                  className=" input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.first_name && (
                  <span className="text-red-500 text-xs">
                    {errors.first_name}
                  </span>
                )}
              </div>
              {/* Add other form fields similarly */}
              <div className="mt-2">
                <label
                  htmlFor="mid_name"
                  className="block font-bold text-xs mb-0.5"
                >
                  Middle Name
                </label>
                <input
                  type="text"
                  id="mid_name"
                  name="mid_name"
                  maxLength={100}
                  value={formData.mid_name}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="lastName"
                  className="block font-bold text-xs mb-0.5"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="last_name"
                  maxLength={100}
                  value={formData.last_name}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="dateOfBirth"
                  className="block font-bold text-xs mb-0.5"
                >
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dob"
                  value={formData.dob}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
                {errors.dob && (
                  <p className="text-[12px] text-red-500 mb-1">{errors.dob}</p>
                )}
              </div>
              <div className="mt-2">
                <label
                  htmlFor="gender"
                  className="block font-bold text-xs mb-0.5"
                >
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                >
                  <option>Select</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-[12px] text-red-500 mb-1">
                    {errors.gender}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <label
                  htmlFor="bloodGroup"
                  className="block font-bold text-xs mb-0.5"
                >
                  Blood group
                </label>
                <select
                  id="bloodGroup"
                  name="blood_group"
                  value={formData.blood_group}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                >
                  <option>Select</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="mt-2">
                <label
                  htmlFor="religion"
                  className="block font-bold text-xs mb-0.5"
                >
                  Religion <span className="text-red-500">*</span>
                </label>
                <select
                  id="religion"
                  name="religion"
                  value={formData.religion}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                >
                  <option>Select</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Christian">Christian</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Jain">Jain</option>
                  <option value="Buddhist">Buddhist</option>
                </select>
                {errors.religion && (
                  <p className="text-[12px] text-red-500 mb-1">
                    {errors.religion}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <label
                  htmlFor="caste"
                  className="block font-bold text-xs mb-0.5"
                >
                  Caste
                </label>
                <input
                  type="text"
                  id="caste"
                  maxLength={100}
                  name="caste"
                  value={formData.caste}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="category"
                  className="block font-bold text-xs mb-0.5"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                >
                  <option>Select</option>
                  <option value="General">General</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="OBC">OBC</option>
                  <option value="SBC">SBC</option>
                  <option value="NT">NT</option>
                  <option value="VJNT">VJNT</option>
                  <option value="Minority">Minority</option>
                </select>
                {errors.category && (
                  <p className="text-[12px] text-red-500 mb-1">
                    {errors.category}
                  </p>
                )}
              </div>
              {/* Birth place */}
              <div className="mt-2">
                <label
                  htmlFor="birthPlace"
                  className="block font-bold text-xs mb-0.5"
                >
                  Birth Place
                </label>
                <input
                  type="text"
                  id="birthPlace"
                  name="birth_place"
                  maxLength={50}
                  value={formData.birth_place}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="nationality"
                  className="block font-bold text-xs mb-0.5"
                >
                  Nationality <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nationality"
                  maxLength={100}
                  name="nationality"
                  value={formData.nationality}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
                {errors.nationality && (
                  <p className="text-[12px] text-red-500 mb-1">
                    {errors.nationality}
                  </p>
                )}
              </div>
              {/* Mother toung */}
              <div className="mt-2">
                <label
                  htmlFor="motherTongue"
                  className="block font-bold text-xs mb-0.5"
                >
                  Mother Tongue <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="motherTongue"
                  name="mother_tongue"
                  maxLength={20}
                  value={formData.mother_tongue}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
                {errors.mother_tongue && (
                  <p className="text-[12px] text-red-500 mb-1">
                    {errors.mother_tongue}
                  </p>
                )}
              </div>
              {/* Student Details */}
              {/* <div className="w-[120%] mx-auto h-2 bg-white col-span-4"></div> */}
              <h5 className="col-span-4 text-blue-400 mt-2 relative top-4">
                {" "}
                Student Details
              </h5>
              {/* Student Name is */}
              <div className="mt-2">
                <label
                  htmlFor="studentName"
                  className="block font-bold text-xs mb-0.5"
                >
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="studentName"
                  maxLength={100}
                  name="student_name"
                  value={formData.student_name}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
                {errors.student_name && (
                  <p className="text-[12px] text-red-500 mb-1">
                    {errors.student_name}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <label
                  htmlFor="studentClass"
                  className="block font-bold text-xs mb-0.5"
                >
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  id="studentClass"
                  name="class_id"
                  value={selectedClass}
                  onChange={handleClassChange}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                >
                  <option value="">Select</option>
                  {classes.map((cls) => (
                    <option key={cls.class_id} value={cls.class_id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                {errors.class_id && (
                  <p className="text-[12px] text-red-500 mb-1">
                    {errors.class_id}
                  </p>
                )}
              </div>
              {/* Division Dropdown */}
              <div className="mt-2">
                <label
                  htmlFor="division"
                  className="block font-bold text-xs mb-0.5"
                >
                  Division <span className="text-red-500">*</span>
                </label>
                <select
                  id="division"
                  name="section_id"
                  value={selectedDivision}
                  onChange={handleDivisionChange}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  disabled={!selectedClass} // Disable division until class is selected
                >
                  <option value="">Select</option>
                  {divisions.map((div) => (
                    <option key={div.section_id} value={div.section_id}>
                      {div.name}
                    </option>
                  ))}
                </select>
                {errors.section_id && (
                  <p className="text-[12px] text-red-500 mb-1">
                    {errors.section_id}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <label
                  htmlFor="rollNumber"
                  className="block font-bold text-xs mb-0.5"
                >
                  Roll No.
                </label>
                <input
                  type="text"
                  id="rollNumber"
                  maxLength={11}
                  name="roll_no"
                  value={formData.roll_no}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="grnNumber"
                  className="block font-bold text-xs mb-0.5"
                >
                  GRN No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="grnNumber"
                  name="reg_no"
                  maxLength={10}
                  value={formData.reg_no}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
                {backendErrors.reg_no && (
                  <p className="text-[12px] text-red-500 mb-1">
                    {backendErrors.reg_no}
                  </p>
                )}
                {errors.reg_no && (
                  <p className="text-[12px] text-red-500 mb-1">
                    {errors.reg_no}
                  </p>
                )}
              </div>{" "}
              <div className="mt-2">
                <label
                  htmlFor="house"
                  className="block font-bold text-xs mb-0.5"
                >
                  House
                </label>
                <select
                  id="house"
                  name="house"
                  value={formData.house}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                >
                  <option>Select</option>
                  <option value="D">Diamond</option>
                  <option value="E">Emerald</option>
                  <option value="R">Ruby</option>
                  <option value="S">Sapphire</option>
                </select>
              </div>
              {/* Admision in class */}
              <div className="mt-2">
                <label
                  htmlFor="admittedInClass"
                  className="block font-bold text-xs mb-0.5"
                >
                  Admitted In Class <span className="text-red-500">*</span>
                </label>
                <select
                  id="admittedInClass"
                  name="admission_class"
                  value={formData.admission_class}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                >
                  <option>Select</option>
                  <option value="Nursery">Nursery</option>
                  <option value="LKG">LKG</option>
                  <option value="UKG">UKG</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
                {errors.admission_class && (
                  <p className="text-[12px] text-red-500 mb-1">
                    {errors.admission_class}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <label
                  htmlFor="dataOfAdmission"
                  className="block font-bold text-xs mb-0.5"
                >
                  Date of Admission <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="dataOfAdmission"
                  name="admission_date"
                  value={formData.admission_date}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
                {errors.admission_date && (
                  <p className="text-[12px] text-red-500 mb-1">
                    {errors.admission_date}
                  </p>
                )}
              </div>
              {/* Student Id number */}
              <div className="mt-2">
                <label
                  htmlFor="studentIdNumber"
                  className="block font-bold text-xs mb-0.5"
                >
                  Student ID No.
                </label>
                <input
                  type="text"
                  id="studentIdNumber"
                  name="stud_id_no"
                  maxLength={25}
                  value={formData.stud_id_no}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
                {backendErrors.stud_id_no && (
                  <p className="text-[12px] text-red-500 mb-1">
                    {backendErrors.stud_id_no}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <label
                  htmlFor="studentAadharNumber"
                  className="block font-bold text-xs mb-0.5"
                >
                  Student Aadhar No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="studentAadharNumber"
                  name="stu_aadhaar_no"
                  maxLength={12}
                  value={formData.stu_aadhaar_no}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
                {backendErrors.stu_aadhaar_no && (
                  <p className="text-[12px] text-red-500 mb-1">
                    {backendErrors.stu_aadhaar_no}
                  </p>
                )}
                {errors.stu_aadhaar_no && (
                  <p className="text-[12px] text-red-500 mb-1">
                    {errors.stu_aadhaar_no}
                  </p>
                )}
              </div>{" "}
              {/* Udise Number */}
              {selectedClass > 99 && (
                <div className="mt-2">
                  <label
                    htmlFor="studentAadharNumber"
                    className="block font-bold text-xs mb-0.5"
                  >
                    Udise Pen No.
                  </label>
                  <input
                    type="text"
                    id="Udise_no"
                    name="udise_pen_no"
                    maxLength={11}
                    value={formData.udise_pen_no}
                    className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                    onChange={handleChange}
                    // onBlur={handleBlur}
                  />
                  {backendErrors.udise_pen_no && (
                    <p className="text-[12px] text-red-500 mb-1">
                      {backendErrors.udise_pen_no}
                    </p>
                  )}
                </div>
              )}
              {/* Address Information */}
              <h5 className="col-span-4 text-blue-400 mt-2 relative top-4">
                {" "}
                Address Information
              </h5>
              <div className="mt-2">
                <label
                  htmlFor="address"
                  className="block font-bold text-xs mb-0.5"
                >
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="permant_add"
                  maxLength={200}
                  rows={2}
                  value={formData.permant_add}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
                {errors.permant_add && (
                  <p className="text-[12px] text-red-500 mb-1">
                    {errors.permant_add}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <label
                  htmlFor="city"
                  className="block font-bold text-xs mb-0.5"
                >
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  maxLength={100}
                  value={formData.city}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
                {errors.city && (
                  <p className="text-[12px] text-red-500 mb-1">{errors.city}</p>
                )}
              </div>
              <div className="mt-2">
                <label
                  htmlFor="state"
                  className="block font-bold text-xs mb-0.5"
                >
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="state"
                  maxLength={100}
                  name="state"
                  value={formData.state}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
                {errors.state && (
                  <p className="text-[12px] text-red-500 mb-1">
                    {errors.state}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <label
                  htmlFor="pincode"
                  className="block font-bold text-xs mb-0.5"
                >
                  Pincode
                </label>
                <input
                  type="text"
                  id="pincode"
                  maxLength={6}
                  name="pincode"
                  value={formData.pincode}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
              </div>
              {/* </div> */}
              {/*  */}
              {/* <div className="w-full sm:max-w-[30%]"> */}
              {/* Emergency Contact */}
              <h5 className="col-span-4 text-blue-400 mt-2 relative top-4">
                {" "}
                Emergency Contact
              </h5>
              <div className="mt-2">
                <label
                  htmlFor="emergencyName"
                  className="block font-bold text-xs mb-0.5"
                >
                  Emergency Name
                </label>
                <input
                  type="text"
                  id="emergencyName"
                  maxLength={100}
                  name="emergency_name"
                  value={formData.emergency_name}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
              </div>
              {/* <div className="mt-2">
              <label
                htmlFor="emergencyAddress"
                className="block font-bold text-xs mb-0.5"
              >
                Emergency Address
              </label>
              <textarea
                id="emergencyAddress"
                name="emergency_add"
                rows={2}
                maxLength={200}
                value={formData.emergency_add}
                className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                onChange={handleChange}
                // onBlur={handleBlur}
              />
              <div className="flex flex-row items-center gap-2 -mt-1 w-full">
                <input
                  type="checkbox"
                  id="sameAs"
                  name="emergencyAddress"
                  rows={2}
                  className="border h-[26px] border-[#ccc] px-3 py-[6px] text-[14px] leading-4 outline-none"
                  onChange={(event) => {
                    if (event.target.checked) {
                      event.target.value = formData.address;
                      handleChange(event);
                    }
                  }}
                  // onBlur={handleBlur}
                />
                <label htmlFor="sameAs" className="text-xs">
                  Same as permanent address
                </label>
              </div>
            </div> */}
              <div className="mt-2">
                <label
                  htmlFor="emergencyAddress"
                  className="block font-bold text-xs mb-0.5"
                >
                  Emergency Address
                </label>
                <textarea
                  id="emergencyAddress"
                  name="emergency_add"
                  rows={2}
                  maxLength={200}
                  value={formData.emergency_add}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                />
                <div className="flex flex-row items-center gap-2 -mt-1 w-full">
                  <input
                    type="checkbox"
                    id="sameAs"
                    name="sameAs"
                    className="border h-[26px] border-[#ccc] px-3 py-[6px] text-[14px] leading-4 outline-none"
                    onChange={(event) => {
                      if (event.target.checked) {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          emergency_add: prevFormData.permant_add,
                        }));
                      } else {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          emergency_add: "",
                        }));
                      }
                    }}
                  />
                  <label htmlFor="sameAs" className="text-xs">
                    Same as permanent address
                  </label>
                </div>
              </div>
              {/* <div className="mt-2">
              <label
                htmlFor="emergencyContact"
                className="block font-bold text-xs mb-0.5"
              >
                Emergency Contact
              </label>
              <div className="w-full flex flex-row items-center">
                <span className="w-[15%] h-[34px] text-[14px] text-[#555] text-center border border-[#ccc] border-r-0 flex items-center justify-center p-1">
                  +91
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  id="emergencyContact"
                  name="emergency_contact"
                  maxLength={10}
                  value={formData.emergency_contact}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
              </div>
            </div> */}
              <div className="mt-2">
                <label
                  htmlFor="emergencyContact"
                  className=" font-bold text-xs mb-0.5"
                >
                  Emergency Contact{" "}
                </label>
                <div className="w-full flex flex-row items-center">
                  <span className="w-[15%] h-[34px] text-[14px] text-[#555] text-center border border-[#ccc] border-r-0 flex items-center justify-center p-1">
                    +91
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    id="emergencyContact"
                    name="emergency_contact"
                    maxLength={10}
                    value={formData.emergency_contact}
                    className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                      if (value.length <= 10) {
                        setFormData({
                          ...formData,
                          emergency_contact: value,
                        });
                      }
                    }}
                  />
                </div>
              </div>
              {/* Transport Information */}
              {/* <h5 className="col-span-4 text-gray-500 mt-2 relative top-2"> Transport Information</h5> */}
              <div className="mt-2">
                <label
                  htmlFor="transportMode"
                  className="block font-bold text-xs mb-0.5"
                >
                  Transport Mode
                </label>
                <select
                  id="transportMode"
                  name="transport_mode"
                  value={formData.transport_mode}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                >
                  <option>Select</option>
                  <option value="School Bus">School Bus</option>
                  <option value="Private Van">Private Van</option>
                  <option value="Self">Self</option>
                </select>
                <input
                  type="text"
                  id="vehicleNumber"
                  name="vehicle_no"
                  maxLength={13}
                  placeholder="Vehicle No."
                  value={formData.vehicle_no}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
              </div>
              {/* Health Information */}
              <h5 className="col-span-4 text-blue-400 mt-2 relative top-4">
                {" "}
                Health Information
              </h5>
              <div className="mt-2">
                <label
                  htmlFor="allergies"
                  className="block font-bold text-xs mb-0.5"
                >
                  Allergies(if any)
                </label>
                <input
                  type="text"
                  id="allergies"
                  name="allergies"
                  maxLength={200}
                  value={formData.allergies}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="height"
                  className="block font-bold text-xs mb-0.5"
                >
                  Height
                </label>
                <input
                  type="text"
                  id="height"
                  maxLength={4.1}
                  name="height"
                  value={formData.height}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="weight"
                  className="block font-bold text-xs mb-0.5"
                >
                  Weight
                </label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  maxLength={4.1}
                  value={formData.weight}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
              </div>
              {/* Has Spectales */}
              <div className="  flex gap-4 pt-[7px]">
                <div
                  htmlFor="weight"
                  className="block font-bold text-[.9em] mt-4 "
                >
                  Has Spectacles
                </div>
                <div className="flex items-center gap-6 mt-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="yes"
                      name="has_specs"
                      checked={formData.has_specs === "Y"}
                      value="Y"
                      onChange={handleChange}
                    />
                    <label htmlFor="yes" className="ml-1">
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="no"
                      name="has_specs"
                      checked={formData.has_specs === "N"}
                      value="N"
                      onChange={handleChange}
                    />
                    <label htmlFor="no" className="ml-1">
                      No
                    </label>
                  </div>
                </div>
              </div>
              {/* ... */}
              {/* Add other form fields similarly */}
              {/* ... */}
              <div className="w-full col-span-4 relative top-6">
                <div className="w-full mx-auto">
                  <h3 className="text-blue-500 w-full mx-auto text-center  md:text-[1.2em] text-nowrap font-bold">
                    {" "}
                    <FaUserGroup className="text-[1.4em] text-blue-700 inline" />{" "}
                    Parent's Information :{" "}
                  </h3>
                </div>
              </div>
              <div className=" w-full col-span-4   flex justify-center flex-col md:flex-row gap-x-1 md:gap-x-8  bg-white  rounded-lg border border-gray-300 mx-auto mt-10 p-6">
                <div className=" w-full md:w-[40%]  flex md:flex-row justify-between items-center">
                  <label
                    htmlFor="siblingmap"
                    className="block md:text-nowrap  md:mb-0 font-bold text-[.9em] mb-0.5"
                  >
                    If Parent Already Exist:{" "}
                  </label>
                  <label className="block md:text-nowrap font-semibold text-[.9em] mb-0.5">
                    <input
                      type="radio"
                      //   id="siblingmap"
                      value="yes"
                      name="parentExist"
                      checked={parentExist === "yes"} //   className="md:text-nowrap"
                      onChange={handleRadioChange}
                    />{" "}
                    Yes
                  </label>
                  <label className="block md:text-nowrap font-semibold text-[.9em] mb-0.5">
                    <input
                      type="radio"
                      value="no"
                      checked={parentExist === "no"}
                      name="parentExist"
                      onChange={handleRadioChange}
                    />{" "}
                    No
                  </label>
                </div>
                <div className="w-full md:w[80%]  flex flex-col gap-y-2 md:gap-y-0 md:flex-row ml-0 md:ml-10">
                  <div className="w-full   gap-x-3 md:justify-start justify-between  my-1 md:my-4 flex  md:flex-row  ">
                    <label
                      htmlFor="classSection"
                      className="block relative left-0 md:-left-3   pt-2 items-center text-center md:text-nowrap font-bold text-[.9em] mb-0.5"
                    >
                      Sibling in
                    </label>
                    <div className="w-[60%] md:w-[50%] ">
                      <Select
                        isDisabled={isDropdownDisabled} // Disable if parentExist is "no"
                        value={classForSiblingMapping}
                        onChange={handleClassSelect}
                        options={classOptions}
                        placeholder="Class"
                        isSearchable
                        isClearable
                        className="text-sm"
                      />
                      {/* {nameError && (
                        <div className=" relative top-0.5 ml-1 text-danger text-xs">
                          {nameError}
                        </div>
                      )} */}
                    </div>
                  </div>
                  <div className="w-full  relative left-0 md:-left-[7%] justify-between  md:w-[90%] my-1 md:my-4 flex  md:flex-row  ">
                    <label
                      htmlFor="classSection"
                      className="relative left-0 md:-left-3  md:text-nowrap pt-2 items-center text-center"
                    ></label>
                    <div className="w-full md:w-[85%] ">
                      <Select
                        isDisabled={isDropdownDisabled} // Disable if no class is selected or parentExist is "no"
                        value={selectedStudent}
                        onChange={handleStudentSelect}
                        options={studentOptions}
                        placeholder="Student Name"
                        isSearchable
                        isClearable
                        className="text-sm"
                        // isClearable={() => {
                        //   setSelectedStudentId("");
                        // }}
                      />
                      {nameError && (
                        <span className=" relative top-0.5 md:absolute md:top-[95%]   ml-1 text-danger text-xs">
                          {nameError}
                        </span>
                      )}{" "}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSearch}
                    style={{ backgroundColor: "#2196F3" }}
                    className={`my-1 md:my-4 btn h-10 w-18 md:w-auto btn-primary text-white font-bold py-1 border-1 border-blue-500 px-4 rounded ${
                      loadingForSibling ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loadingForSibling}
                  >
                    {loadingForSibling ? "Searching..." : "Search"}
                  </button>
                </div>
              </div>
              <h5 className="col-span-4 text-blue-400 mt-2 relative top-4">
                {" "}
                Father Details
              </h5>
              <div className="mt-2">
                <label
                  htmlFor="email"
                  className="block font-bold text-xs mb-0.5"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="email"
                  name="father_name"
                  maxLength={100}
                  value={formData.father_name}
                  onChange={handleChange}
                  disabled={areOtherFieldsDisabled}
                  className={`input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 shadow-inner ${
                    areOtherFieldsDisabled
                      ? "bg-gray-200  text-gray-500"
                      : "bg-white"
                  }`}

                  // className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.father_name && (
                  <span className="text-red-500 text-xs">
                    {errors.father_name}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <label
                  htmlFor="email"
                  className="block font-bold text-xs mb-0.5"
                >
                  Occupation
                </label>
                <input
                  type="text"
                  id="email"
                  maxLength={100}
                  name="father_occupation"
                  value={formData.father_occupation}
                  onChange={handleChange}
                  disabled={areOtherFieldsDisabled}
                  className={`input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 shadow-inner ${
                    areOtherFieldsDisabled
                      ? "bg-gray-200  text-gray-500"
                      : "bg-white"
                  }`}
                />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="bloodGroup"
                  className="block font-bold text-xs mb-0.5"
                >
                  Blood group
                </label>
                <select
                  id="bloodGroup"
                  name="f_blood_group"
                  value={formData.f_blood_group}
                  disabled={areOtherFieldsDisabled}
                  className={`input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 shadow-inner ${
                    areOtherFieldsDisabled
                      ? "bg-gray-200  text-gray-500"
                      : "bg-white"
                  }`}
                  onChange={handleChange}
                  // onBlur={handleBlur}
                >
                  <option>Select</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="mt-2">
                <label
                  htmlFor="email"
                  className="block font-bold text-xs mb-0.5"
                >
                  Father Aadhaar Card No.{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="email"
                  name="parent_adhar_no"
                  maxLength={12}
                  value={formData.parent_adhar_no}
                  onChange={handleChange}
                  disabled={areOtherFieldsDisabled}
                  className={`input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 shadow-inner ${
                    areOtherFieldsDisabled
                      ? "bg-gray-200  text-gray-500"
                      : "bg-white"
                  }`}
                />
                {errors.parent_adhar_no && (
                  <span className="text-red-500 text-xs">
                    {errors.parent_adhar_no}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <label
                  htmlFor="email"
                  className="block font-bold text-xs mb-0.5"
                >
                  Office Address
                </label>
                <textarea
                  id="email"
                  rows={2}
                  maxLength={200}
                  name="f_office_add"
                  value={formData.f_office_add}
                  onChange={handleChange}
                  disabled={areOtherFieldsDisabled}
                  className={`input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 shadow-inner ${
                    areOtherFieldsDisabled
                      ? "bg-gray-200  text-gray-500"
                      : "bg-white"
                  }`}
                />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="telephone"
                  className="block font-bold text-xs mb-0.5"
                >
                  Telephone
                </label>
                <input
                  type="text"
                  maxLength={11}
                  id="telephone"
                  name="f_office_tel"
                  value={formData.f_office_tel}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                    if (value.length <= 11) {
                      setFormData({
                        ...formData,
                        f_office_tel: value,
                      });
                    }
                  }}
                  disabled={areOtherFieldsDisabled}
                  className={`input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 shadow-inner ${
                    areOtherFieldsDisabled
                      ? "bg-gray-200  text-gray-500"
                      : "bg-white"
                  }`}
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block font-bold text-xs mb-0.5"
                >
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="w-[15%] h-[34px] text-[14px] text-[#555] text-center border border-[#ccc] border-r-0 flex items-center justify-center p-1">
                    +91
                  </span>
                  <input
                    type="tel"
                    id="phone"
                    name="f_mobile"
                    pattern="\d{10}"
                    maxLength="10"
                    value={formData.f_mobile}
                    onChange={handleChange}
                    disabled={areOtherFieldsDisabled}
                    className={`input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 shadow-inner ${
                      areOtherFieldsDisabled
                        ? "bg-gray-200  text-gray-500"
                        : "bg-white"
                    }`}
                    // required
                  />
                </div>
                {backendErrors.phone && (
                  <span className="error">{backendErrors.phone[0]}</span>
                )}
                {errors.f_mobile && (
                  <span className=" text-red-500 text-xs">
                    {errors.f_mobile}
                  </span>
                )}{" "}
                {usernameErrors.fatherMobile && (
                  <span className="block text-red-500 text-xs">
                    {usernameErrors.fatherMobile}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="setusernameFatherMob"
                    name="setUsername"
                    onChange={handleFatherMobileSelection}
                    checked={selectedUsername === "FatherMob"}
                    disabled={loadingForUsername} // Disable input while loading
                  />
                  {loadingForUsername ? (
                    <span>Loading...</span> // Loader for this option
                  ) : (
                    <label htmlFor="setusernameFatherMob">
                      Set this as username
                    </label>
                  )}
                </div>
                <div className={`${errors.SetEmailIDAsUsername ? "h-2" : ""}`}>
                  {errors.SetEmailIDAsUsername && (
                    <span className="text-red-500 text-xs relative left-5 -top-2">
                      {errors.SetEmailIDAsUsername}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="receiveSms"
                    value="Father"
                    id="receiveSmsmob"
                    // checked={
                    //   formData.SetToReceiveSMS === "Father" ||
                    //   formData.SetToReceiveSMS == formData.f_mobile
                    // }
                    checked={formData.SetToReceiveSMS === "Father"}
                    onChange={() => handleReceiveSmsSelection("Father")}
                  />
                  <label htmlFor="receiveSmsmob">
                    Set to receive SMS at this no.
                  </label>
                </div>
                {errors.SetToReceiveSMS && (
                  <span className="text-red-500 text-xs relative left-5 -top-2">
                    {errors.SetToReceiveSMS}
                  </span>
                )}{" "}
              </div>
              <div className="mt-2">
                <label
                  htmlFor="email"
                  className="block font-bold text-xs mb-0.5"
                >
                  Email Id <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="f_email"
                  maxLength={50}
                  value={formData.f_email}
                  onChange={handleChange}
                  disabled={areOtherFieldsDisabled}
                  className={`input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 shadow-inner ${
                    areOtherFieldsDisabled
                      ? "bg-gray-200  text-gray-500"
                      : "bg-white"
                  }`}
                />
                {errors.f_email && (
                  <span className="text-red-500 text-xs">{errors.f_email}</span>
                )}
                {usernameErrors.fatherEmail && (
                  <span className="block text-red-500 text-xs">
                    {usernameErrors.fatherEmail}
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="setUserNameFather"
                    name="setUsername"
                    onChange={handleFatherEmailSelection}
                    checked={selectedUsername === "Father"}
                    disabled={loadingForUsername} // Disable input while loading
                  />
                  {loadingForUsername ? (
                    <span>Loading...</span> // Loader for this option
                  ) : (
                    <label htmlFor="setUserNameFather">
                      Set this as username
                    </label>
                  )}
                </div>
              </div>
              {/* Father Date of birth */}
              <div className="mt-2">
                <label
                  htmlFor="dataOfAdmission"
                  className="block font-bold text-xs mb-0.5"
                >
                  Father Date Of Birth
                </label>
                <input
                  type="date"
                  id="dataOfAdmission"
                  name="f_dob"
                  value={formData.f_dob}
                  disabled={areOtherFieldsDisabled}
                  className={`input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 shadow-inner ${
                    areOtherFieldsDisabled
                      ? "bg-gray-200  text-gray-500"
                      : "bg-white"
                  }`}
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
              </div>
              {/* Mother information */}
              <h5 className="col-span-4 text-blue-400 mt-2 relative top-4">
                {" "}
                Mother Details
              </h5>
              <div className="mt-2">
                <label
                  htmlFor="email"
                  className="block font-bold text-xs mb-0.5"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="email"
                  maxLength={100}
                  name="mother_name"
                  value={formData.mother_name}
                  onChange={handleChange}
                  disabled={areOtherFieldsDisabled}
                  className={`input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 shadow-inner ${
                    areOtherFieldsDisabled
                      ? "bg-gray-200  text-gray-500"
                      : "bg-white"
                  }`}
                />
                {errors.mother_name && (
                  <span className="text-red-500 text-xs">
                    {errors.mother_name}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <label
                  htmlFor="email"
                  className="block font-bold text-xs mb-0.5"
                >
                  Occupation
                </label>
                <input
                  type="text"
                  id="email"
                  maxLength={100}
                  name="mother_occupation"
                  value={formData.mother_occupation}
                  onChange={handleChange}
                  disabled={areOtherFieldsDisabled}
                  className={`input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 shadow-inner ${
                    areOtherFieldsDisabled
                      ? "bg-gray-200  text-gray-500"
                      : "bg-white"
                  }`}
                />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="bloodGroup"
                  className="block font-bold text-xs mb-0.5"
                >
                  Blood group
                </label>
                <select
                  id="bloodGroup"
                  name="m_blood"
                  value={formData.m_blood}
                  disabled={areOtherFieldsDisabled}
                  className={`input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 shadow-inner ${
                    areOtherFieldsDisabled
                      ? "bg-gray-200  text-gray-500"
                      : "bg-white"
                  }`}
                  onChange={handleChange}
                  // onBlur={handleBlur}
                >
                  <option>Select</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              {/* Mother Adhar Card */}
              <div className="mt-2">
                <label
                  htmlFor="email"
                  className="block font-bold text-xs mb-0.5"
                >
                  Mother Aadhaar Card No.{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="email"
                  name="m_adhar_no"
                  maxLength={12}
                  value={formData.m_adhar_no}
                  onChange={handleChange}
                  disabled={areOtherFieldsDisabled}
                  className={`input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 shadow-inner ${
                    areOtherFieldsDisabled
                      ? "bg-gray-200  text-gray-500"
                      : "bg-white"
                  }`}
                />
                {errors.m_adhar_no && (
                  <span className="text-red-500 text-xs">
                    {errors.m_adhar_no}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <label
                  htmlFor="m_office_tel"
                  className="block font-bold text-xs mb-0.5"
                >
                  Telephone
                </label>
                <input
                  type="text"
                  maxLength={11}
                  id="m_office_tel"
                  name="m_office_tel"
                  value={formData.m_office_tel}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                    if (value.length <= 11) {
                      setFormData({
                        ...formData,
                        m_office_tel: value,
                      });
                    }
                  }}
                  disabled={areOtherFieldsDisabled}
                  className={`input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 shadow-inner ${
                    areOtherFieldsDisabled
                      ? "bg-gray-200  text-gray-500"
                      : "bg-white"
                  }`}
                />
              </div>{" "}
              <div className="mt-2">
                <label
                  htmlFor="email"
                  className="block font-bold text-xs mb-0.5"
                >
                  Office Address
                </label>
                <textarea
                  id="email"
                  rows={2}
                  maxLength={200}
                  name="m_office_add"
                  value={formData.m_office_add}
                  onChange={handleChange}
                  disabled={areOtherFieldsDisabled}
                  className={`input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 shadow-inner ${
                    areOtherFieldsDisabled
                      ? "bg-gray-200  text-gray-500"
                      : "bg-white"
                  }`}
                />
              </div>
              {/* <div className="mt-2">
              <label htmlFor="email" className="block font-bold text-xs mb-0.5">
                Telephone
              </label>
              <input
                type="text"
                maxLength={11}
                id="email"
                name="m_office_tel"
                value={formData.m_office_tel}
                onChange={handleChange}
                className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
              />
            </div> */}
              <div>
                <label
                  htmlFor="phone"
                  className="block font-bold text-xs mb-0.5"
                >
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="w-[15%] h-[34px] text-[14px] text-[#555] text-center border border-[#ccc] border-r-0 flex items-center justify-center p-1">
                    +91
                  </span>
                  <input
                    type="tel"
                    id="phone"
                    name="m_mobile"
                    pattern="\d{10}"
                    maxLength="10"
                    value={formData.m_mobile}
                    onChange={handleChange}
                    disabled={areOtherFieldsDisabled}
                    className={`input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 shadow-inner ${
                      areOtherFieldsDisabled
                        ? "bg-gray-200  text-gray-500"
                        : "bg-white"
                    }`}
                  />
                </div>
                {backendErrors.phone && (
                  <span className="error">{backendErrors.phone[0]}</span>
                )}
                {errors.m_mobile && (
                  <span className="text-red-500 text-xs">
                    {errors.m_mobile}
                  </span>
                )}{" "}
                {usernameErrors.motherMobile && (
                  <span className="block text-red-500 text-xs">
                    {usernameErrors.motherMobile}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="setusernameMotherMob"
                    name="setUsername"
                    onChange={handleMotherMobileSelection}
                    checked={selectedUsername === "MotherMob"}
                    disabled={loadingForUsername} // Disable input while loading
                  />
                  {loadingForUsername ? (
                    <span>Loading...</span> // Loader for this option
                  ) : (
                    <label htmlFor="setusernameMotherMob">
                      Set this as username
                    </label>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="receiveSms"
                    value="Mother"
                    id="receiveSmsmobMother"
                    // checked={
                    //   formData.SetToReceiveSMS === "Mother" ||
                    //   formData.SetToReceiveSMS == formData.m_mobile
                    // }
                    checked={formData.SetToReceiveSMS === "Mother"}
                    onChange={() => handleReceiveSmsSelection("Mother")}
                  />
                  <label htmlFor="receiveSmsmobMother">
                    Set to receive SMS at this no.
                  </label>
                </div>
              </div>
              <div className="mt-2">
                <label
                  htmlFor="email"
                  className="block font-bold text-xs mb-0.5"
                >
                  Email Id <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="m_emailid"
                  maxLength={50}
                  value={formData.m_emailid}
                  onChange={handleChange}
                  disabled={areOtherFieldsDisabled}
                  className={`input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 shadow-inner ${
                    areOtherFieldsDisabled
                      ? "bg-gray-200  text-gray-500"
                      : "bg-white"
                  }`}
                />
                {errors.m_emailid && (
                  <span className="text-red-500 text-xs">
                    {errors.m_emailid}
                  </span>
                )}{" "}
                {usernameErrors.motherEmail && (
                  <span className="block text-red-500 text-xs">
                    {usernameErrors.motherEmail}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="emailuser"
                    name="setUsername"
                    onChange={handleMotherEmailSelection}
                    checked={selectedUsername === "Mother"}
                    disabled={loadingForUsername} // Disable input while loading
                  />
                  {loadingForUsername ? (
                    <span>Loading...</span> // Loader for this option
                  ) : (
                    <label htmlFor="emailuser">Set this as username</label>
                  )}
                </div>
              </div>
              {/* Mother date  of birth */}
              <div className="mt-2">
                <label
                  htmlFor="dataOfAdmission"
                  className="block font-bold text-xs mb-0.5"
                >
                  Mother Date Of Birth
                </label>
                <input
                  type="date"
                  id="dataOfAdmission"
                  name="m_dob"
                  value={formData.m_dob}
                  disabled={areOtherFieldsDisabled}
                  className={`input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 shadow-inner ${
                    areOtherFieldsDisabled
                      ? "bg-gray-200  text-gray-500"
                      : "bg-white"
                  }`}
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
              </div>
              {/*  */}
              {/* added father feilds here */}
              <div className="col-span-4 md:mr-9 my-2 text-right">
                <button
                  type="search"
                  onClick={handleSubmit}
                  style={{ backgroundColor: "#2196F3" }}
                  className={`my-1 md:my-4 btn h-10 w-18 md:w-auto btn-primary text-white font-bold py-1 border-1 border-blue-500 px-4 rounded ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? (
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
                      Updating...
                    </span>
                  ) : (
                    "Update"
                  )}
                </button>
                {/* <button
                  type="submit"
                  // type="button"
                  style={{ backgroundColor: "#2196F3" }}
                  className=" text-white font-bold py-1 border-1 border-blue-500 px-4 rounded"
                >
                  Update
                </button> */}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default EditOfNewStudentList;
