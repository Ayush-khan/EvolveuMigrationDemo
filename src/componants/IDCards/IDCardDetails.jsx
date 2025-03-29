import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageCropper from "../common/ImageUploadAndCrop";
import Loader from "../common/LoaderFinal/LoaderStyle";

const IDCardDetails = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [loadingForSubmit, setLoadingForSubmit] = useState(false);
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [guardian, setGuardian] = useState([]);
  const [formErrors, setFormErrors] = useState([]);
  const { staff } = location.state || {};
  console.log("IdCardDetails***", staff);
  const [data, setData] = useState(null);
  const fetchStudentData = async () => {
    setFormErrors([]); // Reset errors if no validation issues

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${API_URL}/api/get_studentdatawithparentdata?parent_id=${staff?.parent_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Class", response);
      //   await setData(response?.data?.data || []);

      const data = response?.data?.data || {};
      setData(data);

      setStudents(data.students || []);
      setParents(Array.isArray(data.parents) ? data.parents : []);
      //   setGuardian(Array.isArray(data.guardian) ? data.guardian : []);
      //   setGuardian(
      //     Array.isArray(data.guardian) ? data.guardian : [data.guardian]
      //   );
      setGuardian(
        Array.isArray(data.guardian)
          ? data.guardian
          : data.guardian
          ? [data.guardian]
          : []
      );

      console.log("setParents", parents);

      console.log("setGuardian", guardian);
    } catch (error) {
      toast.error("Error fetching Student Data");
      console.error("Error fetching Student Data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStudentData();
  }, []);

  // Handle Input Changes Separately
  const handleStudentChange = (e, index) => {
    const { name, value } = e.target;
    setStudents((prev) =>
      prev.map((student, i) =>
        i === index ? { ...student, [name]: value } : student
      )
    );
  };

  console.log("student", students);
  const handleParentChange = (e, index) => {
    const { name, value } = e.target;
    setParents((prev) =>
      prev.map((parent, i) =>
        i === index ? { ...parent, [name]: value } : parent
      )
    );
  };

  console.log("parent", parent);

  const handleGuardianChange = (e, index) => {
    const { name, value } = e.target;
    setGuardian((prev) =>
      prev.map((guardian, i) =>
        i === index ? { ...guardian, [name]: value } : guardian
      )
    );
  };

  console.log("guardian", guardian);

  // Handle Image Cropping Separately
  const handleStudentImageCropped = (croppedImageData, index) => {
    setStudents((prev) =>
      prev.map((student, i) =>
        i === index
          ? {
              ...student,
              image_base: croppedImageData ? croppedImageData : "", // Store base64 or empty
            }
          : student
      )
    );
  };

  //   const handleStudentImageCropped = (croppedImageData) => {
  //     setStudents((prev) => ({ ...prev, image_url: croppedImageData }));
  //   };

  const handleParentImageCropped = (croppedImageData, index, type) => {
    setParents((prev) =>
      prev.map((parent, i) =>
        i === index
          ? {
              ...parent,
              // Dynamic key: father_image_url or mother_image_url
              [`${type}_image_base`]: croppedImageData ? croppedImageData : "",
            }
          : parent
      )
    );
  };

  //   const handleParentImageCropped = (croppedImageData) => {
  //     setParents((prev) => ({ ...prev, image_url: croppedImageData }));
  //   };
  const handleGuardianImageCropped = (croppedImageData, index) => {
    setGuardian((prev) =>
      prev.map((guardian, i) =>
        i === index
          ? {
              ...guardian,

              guardian_image_base: croppedImageData ? croppedImageData : "", // Store base64 or empty
            }
          : guardian
      )
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prevent double submissions
    if (loadingForSubmit) return;
    setFormErrors([]); // Reset errors if no validation issues
    // Validation checks
    let errors = [];

    console.log("Start submitting...");

    // Collect student-related errors
    students.forEach((student, index) => {
      if (!student.blood_group) {
        errors.push({
          field: `student_blood_group_${index}`,
          message: "Blood Group is required.",
        });
      }
      if (!student.permant_add) {
        errors.push({
          field: `student_address_${index}`,
          message: "Permanent Address is required.",
        });
      }
    });

    // Collect parent-related errors
    parents.forEach((parent, index) => {
      if (!parent.f_mobile) {
        errors.push({
          field: `parent_f_mobile_${index}`,
          message: "Father's Mobile Number is required.",
        });
      }
      if (!parent.m_mobile) {
        errors.push({
          field: `parent_m_mobile_${index}`,
          message: "Mother's Mobile Number is required.",
        });
      }
    });

    // Collect guardian-related errors
    guardian.forEach((g, index) => {
      if (!g.guardian_mobile) {
        errors.push({
          field: `guardian_mobile_${index}`,
          message: "Guardian's Mobile Number is required.",
        });
      }
    });

    console.log("Collected errors:", errors);

    if (errors.length > 0) {
      setFormErrors(errors); // Store structured errors in state
      return;
    }

    setFormErrors([]); // Reset errors if no validation issues

    console.log("Student Data Submit---->", data);

    const formattedStudents = students.map((student) => ({
      ...student,
      image_url: student.image_url || "",
      image_base: student.image_base || "",
    }));

    const formattedParents = parents.map((parent) => ({
      ...parent,
      father_image_url: parent.father_image_url || "",
      mother_image_url: parent.mother_image_url || "",
      father_image_base: parent.father_image_base || "",
      mother_image_base: parent.mother_image_base || "",
    }));

    const formattedGuardians = guardian.map((g) => ({
      ...g,
      guardian_image_url: g.guardian_image_url,
      guardian_image_base: g.guardian_image_base || "",
    }));

    const finalData = {
      student: formattedStudents,
      parent: formattedParents,
      guardian: formattedGuardians,
    };

    console.log("Submitting Data----->", finalData);

    try {
      setLoadingForSubmit(true); // Start loading state
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${API_URL}/api/save_studentparentguardianimage`,
        finalData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("ID Card Saved successfully!");
        setFormErrors([]); // Reset errors if no validation issues

        setTimeout(() => {
          navigate("/studentIdCard");
        }, 500);
      }
    } catch (error) {
      console.error(
        "Error Saving ID Card:",
        error.response?.data || error.message
      );
    } finally {
      setLoadingForSubmit(false);
      setFormErrors([]); // Reset errors if no validation issues
    }
  };

  //   if (loading) return <p>Loading...</p>;
  if (!students || !parents || !guardian)
    return (
      <>
        {" "}
        <div className="flex w-1/2 mx-auto bg-white justify-center items-center h-64">
          <Loader />
        </div>
      </>
    );

  return (
    <div className="mt-4 bg-gray-200 w-full md:w-[95%] mx-auto">
      <ToastContainer />

      <div className="card p-4 rounded-md ">
        <div className=" card-header mb-4 flex justify-between items-center ">
          <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
            ID Card Details
          </h5>

          <RxCross1
            className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
            onClick={() => {
              navigate("/studentIdCard");
            }}
          />
        </div>
        <div
          className=" relative w-full   -top-6 h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>
        <p className="  md:absolute md:right-10  md:top-[10%]   text-gray-500 ">
          <span className="text-red-500">*</span>indicates mandatory information
        </p>
        <form
          onSubmit={handleSubmit}
          className="   p-0 overflow-x-hidden shadow-md  bg-gray-50 "
        >
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : (
            <div>
              <div className="w-full  mx-auto  flex flex-wrap p-4 gap-4 justify-center">
                {students.map((student, index) => (
                  <>
                    <div className="w-full md:w-[48%] border p-4 pt-2 rounded-lg shadow-lg bg-white">
                      <h2 className="text-xl font-bold mb-4 text-center text-gray-500">
                        Student {index + 1}
                      </h2>

                      {/* Grid Layout for Fields */}
                      <div className="flex flex-col md:grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Full Name */}{" "}
                        <div className=" md:row-span-2 md:col-span-1  flex justify-center mb-4 ">
                          <div className="rounded-full">
                            <ImageCropper
                              photoPreview={student?.image_url}
                              onImageCropped={(croppedImage) =>
                                handleStudentImageCropped(croppedImage, index)
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-col mt-2">
                          <label className="font-bold text-sm">Full Name</label>
                          <p className=" bg-gray-200 border-1 border-gray-100 rounded-md p-2 shadow-inner">
                            {student.first_name || ""} {student.mid_name || " "}{" "}
                            {student.last_name || " "}
                          </p>
                        </div>
                        {/* Class & Division */}
                        <div className="flex flex-col mt-2">
                          <label className="font-bold text-sm">
                            Class & Division
                          </label>
                          <p className=" bg-gray-200 border-1 border-gray-100 rounded-md p-2 shadow-inner">
                            {student.classname || " "} -{" "}
                            {student.sectionname || " "}
                          </p>
                        </div>
                        {/* Date of Birth */}
                        <div className="flex flex-col">
                          <label className="font-bold text-sm">
                            Date of Birth
                          </label>
                          <p className=" bg-gray-200 border-1 border-gray-100 rounded-md p-2 shadow-inner">
                            {student.dob || " "}
                          </p>
                        </div>
                        {/* Blood Group */}
                        <div className="flex flex-col">
                          <label className="font-bold text-sm">
                            Blood Group <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="blood_group"
                            value={student.blood_group}
                            onChange={(e) => handleStudentChange(e, index)}
                            className="w-full   border-1 border-gray-400 rounded-md p-2 shadow-inner"
                          >
                            <option value="">Select</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                          {formErrors.some(
                            (err) =>
                              err.field === `student_blood_group_${index}`
                          ) && (
                            <p className="text-red-500 text-xs">
                              {
                                formErrors.find(
                                  (err) =>
                                    err.field === `student_blood_group_${index}`
                                )?.message
                              }
                            </p>
                          )}
                        </div>
                        {/* House */}
                        <div className="flex flex-col">
                          <label className="font-bold text-sm">
                            House <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="house"
                            value={student.house}
                            onChange={(e) => handleStudentChange(e, index)}
                            // onChange={handleStudentChange}
                            className="w-full   border-1 border-gray-400 rounded-md p-2 shadow-inner"
                          >
                            <option value="">Select</option>
                            <option value="E">Emerald</option>
                            <option value="R">Ruby</option>
                            <option value="S">Sapphire</option>
                            <option value="D">Diamond</option>
                          </select>
                        </div>
                        {/* Address */}
                        <div className="col-span-2 flex flex-col">
                          <label className="font-bold text-sm">
                            Address <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="permant_add"
                            value={student.permant_add} // Fixed the typo
                            onChange={(e) => handleStudentChange(e, index)}
                            maxLength={240}
                            className="w-full border-1 border-gray-400 rounded-md p-2 shadow-inner"
                          />
                          {formErrors.some(
                            (err) => err.field === `student_address_${index}`
                          ) && (
                            <p className="text-red-500 text-xs">
                              {
                                formErrors.find(
                                  (err) =>
                                    err.field === `student_address_${index}`
                                )?.message
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </div>

              <div className="w-full md:w-[95%] mx-auto flex flex-col md:flex-row justify-between gap-x-4">
                {/* Parent Information */}
                {parents.map((parent, index) => (
                  <div
                    key={index}
                    className="w-full md:w-[80%] border p-4 pt-2 rounded-lg shadow-lg bg-white"
                  >
                    <h2 className="text-xl font-bold mb-4 text-center text-gray-500">
                      Parent Information
                    </h2>
                    <div className="flex flex-col md:flex-row gap-x-6 gap-y-6 md:gap-y-1 justify-normal md:justify-between items-center">
                      {/* Father Information */}
                      <div className="w-full md:w-[50%]">
                        <div className="flex justify-center mb-4">
                          <div className="rounded-full">
                            <ImageCropper
                              photoPreview={parent?.father_image_url}
                              onImageCropped={(croppedImage) =>
                                handleParentImageCropped(
                                  croppedImage,
                                  index,
                                  "father"
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-row justify-start gap-x-1 md:gap-x-5  px-1 ">
                          <label className="block mt-2 font-bold text-sm w-full md:w-[35%]">
                            Father Name
                          </label>
                          <p className="w-full md:w-[58%] mx-auto bg-gray-200 border-1 border-gray-400 rounded-md p-2 shadow-inner">
                            {parent.father_name || " "}
                          </p>
                        </div>
                        <div className="mb-2 flex flex-row justify-start gap-x-1 md:gap-x-5  px-1 ">
                          <label className="block mt-2 font-bold text-sm w-full md:w-[35%]">
                            Father Mobile{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="f_mobile"
                            value={parent.f_mobile || ""}
                            // onChange={handleParentChange}
                            onChange={(e) => {
                              let value = e.target.value;

                              // Remove any non-digit characters
                              value = value.replace(/\D/g, "");

                              // Limit input to 10 digits
                              if (value.length > 10) {
                                value = value.slice(0, 10);
                              }

                              handleParentChange(
                                { target: { name: "f_mobile", value } },
                                index
                              );
                            }}
                            // onChange={(e) => handleParentChange(e, index)}
                            className=" md:w-[58%] mx-auto border-1 border-gray-400 rounded-md p-2 shadow-inner w-full "
                          />{" "}
                        </div>
                        {formErrors.some(
                          (err) => err.field === `parent_f_mobile_${index}`
                        ) && (
                          <p className="text-red-500 text-xs mx-2 relative -top-1  float-right">
                            {
                              formErrors.find(
                                (err) =>
                                  err.field === `parent_f_mobile_${index}`
                              )?.message
                            }
                          </p>
                        )}
                      </div>

                      {/* Mother Information */}
                      <div className="w-full md:w-[50%]">
                        <div className="flex justify-center mb-4">
                          <div className="rounded-full">
                            <ImageCropper
                              photoPreview={parent?.mother_image_url}
                              onImageCropped={(croppedImage) =>
                                handleParentImageCropped(
                                  croppedImage,
                                  index,
                                  "mother"
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-row justify-start gap-x-1 md:gap-x-5  px-1  ">
                          <label className="block mt-2 font-bold text-sm w-full md:w-[30%]">
                            Mother Name
                          </label>
                          <p className="w-full md:w-[58%]  mx-auto bg-gray-200 border-1 border-gray-400 rounded-md p-2 shadow-inner">
                            {parent.mother_name || " "}
                          </p>
                        </div>
                        <div className="mb-2 flex flex-row justify-start gap-x-1 md:gap-x-5    ">
                          <label className="block font-bold   mt-2 text-sm w-full md:w-[33%]">
                            Mother Mobile{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="m_mobile"
                            value={parent.m_mobile || ""}
                            // onChange={handleParentChange}
                            onChange={(e) => {
                              let value = e.target.value;

                              // Remove any non-digit characters
                              value = value.replace(/\D/g, "");

                              // Limit input to 10 digits
                              if (value.length > 10) {
                                value = value.slice(0, 10);
                              }

                              handleParentChange(
                                { target: { name: "m_mobile", value } },
                                index
                              );
                            }}
                            // onChange={(e) => handleParentChange(e, index)}
                            className=" md:w-[58%] border-1 border-gray-400 rounded-md p-2 shadow-inner w-full"
                          />
                        </div>
                        {formErrors.some(
                          (err) => err.field === `parent_m_mobile_${index}`
                        ) && (
                          <p className="text-red-500 relative -top-1 text-xs mx-3  float-right">
                            {
                              formErrors.find(
                                (err) =>
                                  err.field === `parent_m_mobile_${index}`
                              )?.message
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Guardian Information */}
                {guardian &&
                  guardian.map((guardians, index) => (
                    <div
                      key={index}
                      className="w-full md:w-[40%] border p-4 pt-2 rounded-lg shadow-lg bg-white"
                    >
                      <h2 className="text-xl font-bold mb-4 text-center text-gray-500">
                        Guardian Information
                      </h2>
                      <div className="flex justify-center mb-4">
                        <div className="rounded-full">
                          <ImageCropper
                            photoPreview={guardians.guardian_image_url}
                            onImageCropped={(croppedImage) =>
                              handleGuardianImageCropped(croppedImage, index)
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-row justify-start gap-x-1 md:gap-x-5">
                        <label className="block mt-2 font-bold text-sm w-full md:w-[35%]">
                          Guardian Name
                        </label>
                        <p className="w-full md:w-[58%] mx-auto bg-gray-200 border-1 border-gray-400 rounded-md p-2 shadow-inner">
                          {guardians.guardian_name || " "}
                        </p>
                      </div>
                      <div className="flex flex-row justify-start gap-x-6 ">
                        <label className=" block mt-2 font-bold text-sm w-full md:w-[60%] ">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="guardian_mobile"
                          value={guardians.guardian_mobile || ""}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Remove any non-digit characters
                            value = value.replace(/\D/g, "");

                            // Limit input to 10 digits
                            if (value.length > 10) {
                              value = value.slice(0, 10);
                            }

                            handleGuardianChange(
                              { target: { name: "guardian_mobile", value } },
                              index
                            );
                          }}
                          //   onChange={(e) => handleGuardianChange(e, index)}
                          className="border-1 border-gray-400 rounded-md p-2 shadow-inner w-full"
                        />{" "}
                      </div>
                      {formErrors.some(
                        (err) => err.field === `guardian_mobile_${index}`
                      ) && (
                        <p className="text-red-500  text-xs   float-right">
                          {
                            formErrors.find(
                              (err) => err.field === `guardian_mobile_${index}`
                            )?.message
                          }
                        </p>
                      )}
                    </div>
                  ))}
              </div>

              <div className="col-span-3 md:mr-9 my-2 text-right">
                <button
                  type="submit"
                  style={{ backgroundColor: "#2196F3" }}
                  className="btn btn-primary  px-3 mb-2 font-bold"
                  disabled={loadingForSubmit}
                >
                  {loadingForSubmit ? "Submiting..." : "Submit"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default IDCardDetails;
