import React, { useMemo, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";

const TimeTable = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [classesforForm, setClassesforForm] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [classError, setClassError] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classes, setClasses] = useState([]);
  const [studentNameWithClassId, setStudentNameWithClassId] = useState([]);
  const [subjects, setSubjects] = useState([]);
  // for allot subject tab
  const [sectionIdForStudentList, setSectionIdForStudentList] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDActiveModal, setShowDActiveModal] = useState(false);
  const [currentStudentDataForActivate, setCurrentStudentDataForActivate] =
    useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  useState("");
  // This is hold the allot subjet api response
  const [classIdForManage, setclassIdForManage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  // validations state for unique name
  const [grNumber, setGrNumber] = useState("");
  //   variable to store the respone of the allot subject tab
  const [nameError, setNameError] = useState(null);

  const classOptions = useMemo(
    () =>
      classesforForm.map((cls) => ({
        value: cls.class_id,
        label: cls.name,
      })),
    [classesforForm]
  );

  // Fetch Initial Data Classes
  // const fetchInitialData = async () => {
  //   setLoading(true);
  //   try {
  //     const token = localStorage.getItem("authToken");
  //     const classResponse = await axios.get(
  //       `${API_URL}/api/getallClassWithStudentCount`,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     setClasses(classResponse.data || []);
  //   } catch (error) {
  //     toast.error("Error fetching initial data.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Fetch classes Data
  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data)) {
        setClassesforForm(response.data);
        console.log("Classes Fetched", response.data);
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

  const handleClassSelect = (selectedOption) => {
    setSelectedClass(selectedOption);
    setClassError("");
  };

  // Handle Search

  // const handleSearch = async() => {
  //   if(isSubmitting) return;
  //   setIsSubmitting(true);

  //   if(!classIdForManage)
  //   {
  //     setNameError("Please select a Class");
  //     setIsSubmitting(false);
  //     return;
  //   }

  //   setLoading(true);
  //   try{
  //     const token = localStorage.getItem("authToken");
  //     let response;
  //     if(selectedClass)
  //     {
  //       response = await axios.get(`${API_URL}/api/getStudentListBySection`,{
  //         herders:{ Authorization:`Brearer ${token}`},
  //         params:{section_id: selectedClass.value},
  //       })
  //     }

  //   }
  //   catch(error)
  //   {
  //     toast.error("Error in Fetching Selected Class Time Table.")
  //   }
  //   finally
  //   {
  //     setLoading(false);
  //     setIsSubmitting(false);
  //   }
  // }

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto md:mt-4">
        <div className="card mx-auto lg:w-3/4 shadow-lg">
          <div className="p-2 px-3 bg-gray-100 flex justify-between items-center">
            <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl">
              TimeTable
            </h3>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate("/createTimeTable")}
            >
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />
              Add
            </button>
          </div>
          <div
            className="relative w-[97%] mb-3 h-1 mx-auto"
            style={{ backgroundColor: "#C03078" }}
          ></div>
          <div className="mb-4  ">
            <div className="  w-[80%]  mx-auto ">
              <div className="max-w-full bg-white shadow-md rounded-lg border border-gray-300 mx-auto mt-10 p-6">
                <div className=" w-full md:w-[49%]  mx-auto flex justify-center flex-col md:flex-row gap-x-1 md:gap-x-4 ">
                  <div className="w-full  gap-x-3 md:justify-center justify-around  my-1 md:my-4 flex  md:flex-row  ">
                    <label htmlFor="classSection" className="mr-2">
                      Class <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full md:w-[50%]">
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

                    <div className="box-border flex md:gap-x-2 justify-end md:h-10">
                      <button
                        className="btn btn-primary btn-sm md:h-9 text-xs md:text-sm"
                        onClick={() => navigate("/viewTimeTable")}
                      >
                        <FontAwesomeIcon style={{ marginRight: "10px" }} />
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimeTable;
