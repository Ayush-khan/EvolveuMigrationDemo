import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageCropper from "../common/ImageUploadAndCrop";
import { FaUserGroup } from "react-icons/fa6";
import Loader from "../common/LoaderFinal/LoaderStyle";
import LoadingSpinner from "../common/LoadingSpinner";

function Form() {
  const API_URL = import.meta.env.VITE_API_URL;
  // for unique user name
  const [usernameError, setUsernameError] = useState(""); // To store the error message
  const [isImageCropped, setIsImageCropped] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [loadingForUsername, setLoadingForUsername] = useState(false);

  const { student } = location.state || {};
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

  const [loading, setLoading] = useState(false);
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
    category: " ",
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
    m_blood_group: "",
    f_blood_group: "",
    allergies: "",
    nationality: "",
    pincode: "",
    image_name: null,
    // student_id: "",
    reg_no: " ",
    // Parent fields
    father_name: "",
    father_occupation: "",
    f_office_add: "",
    f_office_tel: "",
    f_mobile: "",
    f_email: "",
    f_dob: " ",
    m_dob: " ",
    has_specs: "",
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

  console.log("employeeID", student.employeeId);

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
        admission_class: student.admission_class || " ",
        city: student.city || " ",
        state: student.state || "",
        roll_no: student.roll_no || "",
        // student_id: student.student_id || " ",
        reg_no: student.reg_no || " ",
        blood_group: student.blood_group || " ",
        category: student.category || " ",
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
        image_name: student.image_name || null,
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
        has_specs: student.has_specs || " ",
        m_blood_group: student?.parents?.m_blood_group || " ",
        f_blood_group: student?.parents?.f_blood_group || " ",

        // Preferences
        SetToReceiveSMS: student.SetToReceiveSMS || "",
        SetEmailIDAsUsername: student.SetEmailIDAsUsername || "",

        // Base64 Image (optional)
        // student_image: student.student_image || "",
      });

      // Set the initial state for father's and mother's mobile preferences based on prefilled data
      // Update the state for username and SMS based on the prefilled data
      // Set initial state for mobile and email preferences based on prefilled data
      setFatherMobileSelected({
        setUsername: student.SetEmailIDAsUsername === "FatherMob",
        receiveSms: student.SetToReceiveSMS === "FatherMob",
      });
      setMotherMobileSelected({
        setUsername: student.SetEmailIDAsUsername === "MotherMob",
        receiveSms: student.SetToReceiveSMS === "MotherMob",
      });
      setFatherEmailSelected({
        setUsername: student.SetEmailIDAsUsername === "Father",
      });
      setMotherEmailSelected({
        setUsername: student.SetEmailIDAsUsername === "Mother",
      });

      setSelectedClass(student.class_id || ""); // Set the selected class
      setSelectedDivision(student.section_id || ""); // Set the selected division

      if (student?.image_name) {
        setPhotoPreview(
          // `${API_URL}/path/to/images/${student.teacher_image_name}`
          // `https://sms.evolvu.in/storage/app/public/student_images/${student.image_name}`
          `${student.image_name}`
        );
      }
    }
  }, [student, API_URL]);

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
          setDivisions(response.data.divisions); // Update divisions
        } catch (error) {
          toast.error("Error fetching divisions");
        }
      };

      fetchDivisions();
    }
  }, [selectedClass, API_URL]);

  // Logic for the preselect readio button
  // useEffect(() => {
  //   if (student) {
  //     // Set form data from student object...
  //     setFormData((prev) => ({
  //       ...prev,
  //       f_mobile: student.parents?.f_mobile || "",
  //       f_email: student.parents?.f_email || "",
  //       m_mobile: student.parents?.m_mobile || "",
  //       m_emailid: student.parents?.m_emailid || "",
  //       SetToReceiveSMS: student.SetToReceiveSMS || "",
  //       SetEmailIDAsUsername: student.SetEmailIDAsUsername || "",
  //     }));

  //     // Initializing selectedUsername based on conditions
  //     const userId = student.user_master?.user_id;
  //     if (userId === student.parents?.f_mobile) {
  //       setSelectedUsername("FatherMob");
  //     } else if (userId === student.parents?.m_mobile) {
  //       setSelectedUsername("MotherMob");
  //     } else if (userId === student.parents?.f_email) {
  //       setSelectedUsername("Father");
  //     } else if (userId === student.parents?.m_emailid) {
  //       setSelectedUsername("Mother");
  //     }
  //   }
  // }, [student]);

  // This one is check extra for the sms:
  useEffect(() => {
    if (student) {
      // Set form data from student object...
      setFormData((prev) => ({
        ...prev,
        f_mobile: student.parents?.f_mobile || "",
        f_email: student.parents?.f_email || "",
        m_mobile: student.parents?.m_mobile || "",
        m_emailid: student.parents?.m_emailid || "",
        SetToReceiveSMS: student.SetToReceiveSMS || "",
        SetEmailIDAsUsername: student.SetEmailIDAsUsername || "",
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
      const userId = student.user_master?.user_id
        ? student.user_master.user_id
        : null;
      console.log("master user_id", userId);

      // Check if userId is undefined and exit early
      if (userId === null) {
        setSelectedUsername("");
        console.log("User ID is undefined, skipping conditions");
        return;
      } else if (userId === student.parents?.f_mobile) {
        setSelectedUsername("FatherMob");
      } else if (userId === student.parents?.m_mobile) {
        setSelectedUsername("MotherMob");
      } else if (userId === student.parents?.f_email) {
        setSelectedUsername("Father");
      } else if (userId === student.parents?.m_emailid) {
        setSelectedUsername("Mother");
      } else {
        setSelectedUsername("");
        console.log("User ID does not match any condition");
      }

      // Set 'SetToReceiveSMS' based on mobile number matching
      if (student.SetToReceiveSMS === student.parents?.f_mobile) {
        setFormData((prev) => ({
          ...prev,
          SetToReceiveSMS: "Father",
        }));
      } else if (student.SetToReceiveSMS === student.parents?.m_mobile) {
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
  }, [student]);

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

  // const handleFatherMobileSelection = async () => {
  //   setUsernameErrors("");
  //   // Clear only the SetEmailIDAsUsername error
  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     SetEmailIDAsUsername: "", // Clear username error
  //   }));
  //   await handleSetUsernameSelection(
  //     "FatherMob",
  //     formData.f_mobile,
  //     "fatherMobile"
  //   );
  // };

  // const handleMotherMobileSelection = async () => {
  //   setUsernameErrors("");
  //   // Clear only the SetEmailIDAsUsername error
  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     SetEmailIDAsUsername: "",
  //   }));
  //   await handleSetUsernameSelection(
  //     "MotherMob",
  //     formData.m_mobile,
  //     "motherMobile"
  //   );
  // };

  // const handleFatherEmailSelection = async () => {
  //   setUsernameErrors("");
  //   // Clear only the SetEmailIDAsUsername error
  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     SetEmailIDAsUsername: "",
  //   }));
  //   await handleSetUsernameSelection("Father", formData.f_email, "fatherEmail");
  // };

  // const handleMotherEmailSelection = async () => {
  //   setUsernameErrors("");
  //   // Clear only the SetEmailIDAsUsername error
  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     SetEmailIDAsUsername: "",
  //   }));
  //   await handleSetUsernameSelection(
  //     "Mother",
  //     formData.m_emailid,
  //     "motherEmail"
  //   );
  // };
  const handleFatherMobileSelection = async () => {
    setUsernameErrors("");
    setErrors((prevErrors) => ({
      ...prevErrors,
      SetEmailIDAsUsername: "",
    }));
    setSelectedUsername("FatherMob"); // Update state
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
    setSelectedUsername("MotherMob"); // Update state
    await handleSetUsernameSelection(
      "MotherMob",
      formData.m_mobile,
      "motherMobile"
    );
  };

  const handleFatherEmailSelection = async () => {
    setUsernameErrors("");
    setErrors((prevErrors) => ({
      ...prevErrors,
      SetEmailIDAsUsername: "",
    }));
    setSelectedUsername("Father"); // Update state
    await handleSetUsernameSelection("Father", formData.f_email, "fatherEmail");
  };

  const handleMotherEmailSelection = async () => {
    setUsernameErrors("");
    setErrors((prevErrors) => ({
      ...prevErrors,
      SetEmailIDAsUsername: "",
    }));
    setSelectedUsername("Mother"); // Update state
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

  // const validate = () => {
  //   const newErrors = {};

  //   // Validate required fields

  //   // Check if a username or SMS receiver is required
  //   // const isUsernameRequired =
  //   //   formData?.SetEmailIDAsUsername === "Father" ||
  //   //   formData?.SetEmailIDAsUsername === "Mother" ||
  //   //   formData?.SetEmailIDAsUsername === "FatherMob" ||
  //   //   formData?.SetEmailIDAsUsername === "MotherMob";

  //   // const isSmsReceiverRequired =
  //   //   formData?.SetToReceiveSMS === "Father" ||
  //   //   formData?.SetToReceiveSMS === "Mother" ||
  //   //   formData?.SetToReceiveSMS === "FatherMob" ||
  //   //   formData?.SetToReceiveSMS === "MotherMob";

  //   // // Validate required fields
  //   // if (!formData?.SetEmailIDAsUsername && isUsernameRequired) {
  //   //   newErrors.SetEmailIDAsUsername = "Username is required";
  //   // }
  //   // if (!formData?.SetToReceiveSMS && isSmsReceiverRequired) {
  //   //   newErrors.SetToReceiveSMS = "Receive SMS name is required";
  //   // }
  //   if (!formData?.SetEmailIDAsUsername)
  //     newErrors.SetEmailIDAsUsername = "User name is required";
  //   if (!formData?.SetToReceiveSMS)
  //     newErrors.SetToReceiveSMS = "ReceiveSms name is required";
  //   if (!formData.first_name) newErrors.first_name = "First name is required";
  //   // if (!formData.gender) newErrors.gender = "Gender selection is required";
  //   if (!formData.dob) newErrors.dob = "Date of Birth is required";
  //   if (!formData.nationality)
  //     newErrors.nationality = "Nationality is required";
  //   if (!formData.mother_tongue)
  //     newErrors.mother_tongue = "MotherTongue is required";
  //   if (!formData.student_name)
  //     newErrors.student_name = "Student name is required";
  //   if (!formData.reg_no) {
  //     newErrors.reg_no = "GR number is required";
  //   }
  //   if (!formData.admission_date)
  //     newErrors.admission_date = "Date of admission is required";
  //   if (!formData.admission_date)
  //     newErrors.admission_date = "Date of admission is required";
  //   // Adrees validations
  //   if (!formData.permant_add) newErrors.permant_add = "Address is required";
  //   if (!formData.city) newErrors.city = "City is required";
  //   if (!formData.state) newErrors.state = "State is required";
  //   // Dropdown validations
  //   if (
  //     !formData.category ||
  //     formData.category === "Select" ||
  //     formData.category === null
  //   ) {
  //     newErrors.category = "Category selection is required";
  //   }
  //   if (
  //     !formData.gender ||
  //     formData.gender === "Select" ||
  //     formData.gender === null
  //   ) {
  //     newErrors.gender = "Gender selection is required";
  //   }
  //   if (
  //     !formData.religion ||
  //     formData.religion === "Select" ||
  //     formData.religion === null
  //   ) {
  //     newErrors.religion = "Religion selection is required";
  //   }
  //   if (
  //     !formData.admission_class ||
  //     formData.admission_class === "Select" ||
  //     formData.admission_class === null
  //   ) {
  //     newErrors.admission_class = "Admission class selection is required";
  //   }
  //   if (
  //     !formData.class_id ||
  //     formData.class_id === "Select" ||
  //     formData.class_id === null
  //   ) {
  //     newErrors.class_id = "Class selection is required";
  //   }
  //   if (
  //     !formData.section_id ||
  //     formData.section_id === "Select" ||
  //     formData.section_id === null
  //   ) {
  //     newErrors.section_id = "Division selection is required";
  //   }

  //   // newErrors.gender = "Gender selection is required";

  //   // Phone, Aadhar and Email validations
  //   const phoneError = validatePhone(formData.f_mobile);
  //   if (phoneError) newErrors.f_mobile = phoneError;
  //   // mother phone error
  //   const m_mobile = validatePhone(formData.m_mobile);
  //   if (m_mobile) newErrors.m_mobile = m_mobile;

  //   const stu_aadhaar_no = validateAadhar(formData.stu_aadhaar_no);
  //   if (stu_aadhaar_no) newErrors.stu_aadhaar_no = stu_aadhaar_no;
  //   // mother adhar card validatoins
  //   const m_adhar_no = validateAadhar(formData.m_adhar_no);
  //   if (m_adhar_no) newErrors.m_adhar_no = m_adhar_no;
  //   // Father adhar validations
  //   const aadharError = validateAadhar(formData.parent_adhar_no);
  //   if (aadharError) newErrors.parent_adhar_no = aadharError;

  //   const f_email = validateEmail(formData.f_email);
  //   if (f_email) newErrors.f_email = f_email;

  //   const m_emailid = validateEmail(formData.m_emailid);
  //   if (m_emailid) newErrors.m_emailid = m_emailid;
  //   // Validate required fields
  //   if (!formData.father_name.trim())
  //     newErrors.father_name = "Father Name is required";
  //   // mother
  //   if (!formData.m_adhar_no.trim())
  //     newErrors.m_adhar_no = "Mother Aadhaar Card No. is required";
  //   if (!formData.stu_aadhaar_no.trim())
  //     newErrors.stu_aadhaar_no = "Student Aadhaar Card No. is required";
  //   if (!formData.parent_adhar_no.trim())
  //     newErrors.parent_adhar_no = "Father Aadhaar Card No. is required";
  //   if (!formData.mother_name.trim())
  //     newErrors.mother_name = "Mother Name is required";
  //   // if (!formData.m_adhar_no.trim())
  //   //   newErrors.m_adhar_no = "Mother Aadhaar Card No. is required";
  //   // Add more validations as needed

  //   return newErrors;
  // };

  // Handle change and field-level validation

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
    } else if (name === "m_adhar_no") {
      fieldErrors.m_adhar_no = validateAadhar(newValue);
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
    setIsImageCropped(true); // Mark that cropping has occurred
    setFormData((prevData) => ({
      ...prevData,
      image_name: croppedImageData,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log("Validation Errors:", validationErrors);
      return;
    }
    // const validationErrors = validate();

    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   Object.values(validationErrors).forEach((error) => {
    //     console.log(error);
    //   });
    //   console.log("error in feilds name");

    //   return;
    // }
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
    setBackendErrors({});
    try {
      setLoading(true); // Start loading state

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }
      // console.log("formattedFormData", formattedFormData);
      console.log("selectedUsername------>", selectedUsername);
      // Create a local copy of formData with the updated field

      const updatedFormData = {
        ...formData,
        image_name: isImageCropped ? formData.image_name : "",
        SetEmailIDAsUsername: selectedUsername || "",
      };
      console.log("formData Before submitting", updatedFormData);

      const response = await axios.put(
        `${API_URL}/api/students/${student.student_id}`,
        updatedFormData, // Send the FormData object
        {
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Student updated successfully!");
        setTimeout(() => {
          navigate("/manageStudent");
        }, 500);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      if (error.response && error.response.data && error.response.data.errors) {
        setBackendErrors(error.response.data.errors || {});
        toast.error(
          "Some fields contain duplicate data. Please ensure all values are unique."
        );
        console.log("setBackendErrors", backendErrors);
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
            onClick={() => navigate("/manageStudent")}
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
                {errors.dateOfBirth && (
                  <p className="text-[12px] text-red-500 mb-1">
                    {errors.dateOfBirth}
                  </p>
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
                      checked={formData.has_specs == "Y"}
                      value="Y"
                      onChange={handleChange}
                      // onBlur={handleBlur}
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
                      checked={formData.has_specs == "N"}
                      value="N"
                      onChange={handleChange}
                      // onBlur={handleBlur}
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
              <div className="w-full col-span-4 relative top-4">
                <div className="w-full mx-auto">
                  <h3 className="text-blue-500 w-full mx-auto text-center  md:text-[1.2em] text-nowrap font-bold">
                    {" "}
                    <FaUserGroup className="text-[1.4em] text-blue-700 inline" />{" "}
                    Parent's Information :{" "}
                  </h3>
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
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
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
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
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
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
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
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
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
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
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
                    className="input-field block w-full border-1 border-gray-400 outline-none rounded-r-md py-1 px-3 bg-white shadow-inner"
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
                    // checked={
                    //   selectedUsername === "FatherMob" ||
                    //   student?.user_master?.user_id ===
                    //     student?.parents?.f_mobile
                    // }
                    checked={selectedUsername === "FatherMob"}
                  />
                  <label htmlFor="setusernameFatherMob">
                    Set this as username
                  </label>
                  {selectedUsername === "FatherMob" && loadingForUsername && (
                    <div>
                      <LoadingSpinner />
                    </div>
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
                    checked={
                      formData.SetToReceiveSMS === "Father" ||
                      formData.SetToReceiveSMS == formData.f_mobile
                    }
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
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
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
                    // checked={
                    //   selectedUsername === "Father" ||
                    //   student?.user_master?.user_id === student?.parent?.f_email
                    // }
                    checked={selectedUsername === "Father"}
                  />
                  <label htmlFor="setUserNameFather">
                    Set this as username
                  </label>
                  {selectedUsername === "Father" && loadingForUsername && (
                    <div>
                      <LoadingSpinner />
                    </div>
                  )}
                </div>
              </div>
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
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
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
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
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
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
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
                  name="m_blood_group"
                  value={formData.m_blood_group}
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
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.m_adhar_no && (
                  <span className="text-red-500 text-xs">
                    {errors.m_adhar_no}
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
                  name="m_office_add"
                  value={formData.m_office_add}
                  onChange={handleChange}
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                />
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
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
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
                    className="input-field block w-full border-1 border-gray-400 outline-none rounded-r-md py-1 px-3 bg-white shadow-inner"
                    // required
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
                    // checked={
                    //   selectedUsername === "MotherMob" ||
                    //   student?.user_master?.user_id ===
                    //     student?.parent?.m_mobile
                    // }
                    checked={selectedUsername === "MotherMob"}
                  />
                  <label htmlFor="setusernameMotherMob">
                    Set this as username
                  </label>
                  {selectedUsername === "MotherMob" && loadingForUsername && (
                    <div>
                      <LoadingSpinner />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="receiveSms"
                    value="Mother"
                    id="receiveSmsmobMother"
                    checked={
                      formData.SetToReceiveSMS === "Mother" ||
                      formData.SetToReceiveSMS == formData.m_mobile
                    }
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
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
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
                    // checked={
                    //   selectedUsername === "Mother" ||
                    //   student?.user_master?.user_id ===
                    //     student?.parent?.m_emailid
                    // }
                    checked={selectedUsername === "Mother"}
                  />
                  <label htmlFor="emailuser">Set this as username</label>
                  {selectedUsername === "Mother" && loadingForUsername && (
                    <div>
                      <LoadingSpinner />
                    </div>
                  )}
                </div>
              </div>
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
                  className="input-field block w-full border-1 border-gray-400 rounded-md py-1 px-3 bg-white shadow-inner"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                />
              </div>
              {/*  */}
              {/* added father feilds here */}
              <div className="col-span-3 md:mr-9 my-2 text-right">
                <button
                  // type="submit"
                  // type="button"
                  style={{ backgroundColor: "#2196F3" }}
                  className=" text-white font-bold py-1 border-1 border-blue-500 px-4 rounded"
                >
                  Update
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Form;
