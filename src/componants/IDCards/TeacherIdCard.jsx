import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import Loader from "../common/LoaderFinal/LoaderStyle";
import { FiPrinter } from "react-icons/fi";
import { FaDownload, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";

const TeacherIdCard = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingForSearch, setLoadingForSearch] = useState(false);

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [timetable, setTimetable] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    handleSearch();
  }, []);

  // Handle search and fetch parent information
  const handleSearch = async () => {
    let valid = true;
    if (!valid) {
      setLoadingForSearch(false);
      return;
    } // Stop if any validation fails

    try {
      setLoadingForSearch(true); // Start loading
      setTimetable([]);
      setSearchTerm("");
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/get_teacheridcard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response?.data?.data || response?.data?.data.length === 0) {
        toast.error("No student ID card data found for the selected class."); // Show warning toast
        setTimetable([]); // Ensure timetable is set to an empty array
      } else {
        setTimetable(response?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching Student Id Card data:", error);
      toast.error("An error occurred while fetching Student Id Carddata.");
    } finally {
      setLoadingForSearch(false);
    }
  };

  const handleDownloadEXL = () => {
    if (!displayedSections || displayedSections.length === 0) {
      toast.error(
        "No data available to download Excel sheet of Student ID Card."
      );
      return;
    }

    // Define headers
    const headers = [
      "Sr.No",

      "Photo URL",
      "Employee Id",
      "Name",

      "Phone No.",

      "Address",
      "Gender",
      "Blood Group",

      "Profile Image Name",
    ];

    // Convert table data into an array format
    const data = displayedSections.map((subject, index) => [
      index + 1,

      subject?.teacher_image_url || "  ",
      `${subject?.employee_id || ""} `,
      `${subject?.name || ""} 
      }`,
      subject?.phone || "  ",
      subject?.address || "  ",
      subject?.sex || " ",

      subject?.blood_group || "  ",
      subject?.teacher_image_name || "  ",
    ]);

    // Create a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Teachers Data");

    // Write and download the file
    XLSX.writeFile(workbook, `Teachers idCard list .xlsx`);
  };
  const handleDownloadZip = () => {
    setShowDeleteModal(true);
  };
  const handleSubmitDownloadZip = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found.");
      }

      // Fetch the ZIP file from the API
      const response = await axios.get(
        `${API_URL}/api/get_teacherziparchiveimages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Important for handling binary data
        }
      );

      if (!response.data) {
        toast.error("No data available for download.");
        return;
      }

      // Create a Blob from the response
      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Teacher idCard list zip`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("ZIP file For Teacher Id Card downloaded successfully!");
    } catch (error) {
      console.error("Error downloading ZIP file For Teacher Id Card:", error);

      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || "Download failed.");
      } else {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
      setShowDeleteModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
  };

  console.log("row", timetable);
  const handlePrint = () => {
    const printTitle = `Teacher ID Card List`;

    const printContent = `
  <div id="tableMain" class="flex items-center justify-center min-h-screen bg-white">
         <h5 id="tableHeading5"  class="text-lg font-semibold border-1 border-black">${printTitle}</h5>
 <div id="tableHeading" class="text-center w-3/4">
      <table class="min-w-full leading-normal table-auto border border-black mx-auto mt-2">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-2 text-center py-2 border border-black text-sm font-semibold">Sr.No</th>

            <th class="px-2 text-center py-2 border border-black text-sm font-semibold">Photo</th>
                        <th class="px-2 text-center py-2 border border-black text-sm font-semibold">Employee Id</th>

            
            <th class="px-2 text-center py-2 border border-black text-sm font-semibold">Name</th>
            <th class="px-2 text-center py-2 border border-black text-sm font-semibold">Phone No.</th>
            <th class="px-2 text-center py-2 border border-black text-sm font-semibold">Address</th>
                        <th class="px-2 text-center py-2 border border-black text-sm font-semibold">Gender</th>
            <th class="px-2 text-center py-2 border border-black text-sm font-semibold">Blood Group</th>
            <th class="px-2 text-center py-2 border border-black text-sm font-semibold">Profile Image Name</th>
          </tr>
        </thead>
        <tbody>
          ${displayedSections
            .map(
              (subject, index) => `
              <tr class="text-sm">
                <td class="px-2 text-center py-2 border border-black">${
                  index + 1
                }</td>
               
                <td class="px-2 text-center py-2 border border-black">
                  <img src="${subject?.teacher_image_url || ""}" 
                       alt="${subject?.url}" 
                       class="student-photo" />
                </td>
                <td class="px-2 text-center py-2 border border-black">${
                  subject?.employee_id || " "
                } </td>
                <td class="px-2 text-center py-2 border border-black">${
                  subject?.name || " "
                } </td>
                <td class="px-2 text-center py-2 border border-black">${
                  subject?.phone || " "
                }</td>
              
                <td class="px-2 text-center py-2 border border-black">${
                  subject?.address || " "
                }</td>  <td class="px-2 text-center py-2 border border-black">${
                subject?.sex || " "
              }</td>
                <td class="px-2 text-center py-2 border border-black">${
                  subject?.blood_group || " "
                }</td>
              
                
                <td class="px-2 text-center py-2 border border-black">${
                  subject?.teacher_image_name || " "
                }</td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  </div>`;

    const printWindow = window.open("", "", "height=800,width=1000");
    printWindow.document.write(`
  <html>
  <head>
    <title>${printTitle}</title>
    <style>
      @page { margin: 0; padding:0; box-sizing:border-box;   ;
}
      body { margin: 0; padding: 0; box-sizing:border-box; font-family: Arial, sans-serif; }
      #tableHeading {
  width: 100%;
  margin: auto; /* Centers the div horizontally */
  display: flex;
  justify-content: center;
}

#tableHeading table {
  width: 100%; /* Ensures the table fills its container */
  margin:auto;
  padding:0 10em 0 10em;

  


}

#tableContainer {
  display: flex;
  justify-content: center; /* Centers the table horizontally */
  width: 80%;
  
}

 
h5 {  
  width: 100%;  
  text-align: center;  
  margin: 0;  /* Remove any default margins */
  padding: 5px 0;  /* Adjust padding if needed */
}

#tableMain {
width:100%;
margin:auto;
box-sizing:border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Prevent unnecessary space */
padding:0 10em 0 10em;
}

h5 + * { /* Targets the element after h5 */
  margin-top: 0; /* Ensures no extra space after h5 */
}


      table { border-spacing: 0; width: 70%; margin: auto;   }
      th { font-size: 0.8em; background-color: #f9f9f9; }
      td { font-size: 12px; }
      th, td { border: 1px solid gray; padding: 8px; text-align: center; }
      .student-photo {
        width: 30px !important; 
        height: 30px !important;
        object-fit: cover;
        border-radius: 50%;
      }
    </style>
  </head>
  <body>
    ${printContent}
  </body>
  </html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const filteredSections = timetable.filter((section) => {
    const searchLower = searchTerm.toLowerCase();
    // Extract relevant fields and convert them to lowercase for case-insensitive search
    const studentRollNo = section?.employee_id?.toString().toLowerCase() || "";
    const studentName = `${section?.name} `.toLowerCase() || "";
    const studentDOB = section?.phone?.toLowerCase() || "";
    const studentBloodGroup = section?.blood_group?.toLowerCase() || "";
    const studentGrnNo = section?.sex?.toLowerCase() || "";
    const studentClass = `${section?.address}`.toLowerCase() || "";

    // Check if the search term is present in any of the specified fields
    return (
      studentRollNo.includes(searchLower) ||
      studentName.includes(searchLower) ||
      studentDOB.includes(searchLower) ||
      studentBloodGroup.includes(searchLower) ||
      studentGrnNo.includes(searchLower) ||
      studentClass.includes(searchLower)
    );
  });

  const displayedSections = filteredSections.slice(currentPage * pageSize);
  return (
    <>
      <div className="w-full md:w-[95%] mx-auto p-4 ">
        <ToastContainer />
        <div className="card p-4 rounded-md ">
          <div className=" card-header mb-4 flex justify-between items-center ">
            <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
              Teacher ID Card
            </h5>
            <RxCross1
              className=" relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
              onClick={() => {
                navigate("/dashboard");
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
            <div className=" w-full md:w-[55%]   flex justify-center flex-col md:flex-row gap-x-1     ml-0    p-2">
              <div className="w-[99%] flex md:flex-row justify-between items-center mt-0 md:mt-4"></div>
            </div>
            {/* // Render the table */}
            {loadingForSearch ? (
              <>
                <div className="flex justify-center items-center h-64">
                  <Loader />
                </div>
              </>
            ) : (
              <>
                {timetable.length > 0 && (
                  <>
                    <div className="w-full  mt-4">
                      <div className="card mx-auto lg:w-full shadow-lg">
                        <div className="p-2 px-3 bg-gray-100 border-none flex justify-between items-center">
                          <div className="w-full   flex flex-row justify-between mr-0 md:mr-4 ">
                            <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
                              Teachers ID Card List
                            </h3>
                            <div className="w-1/2 md:w-[18%] mr-1 ">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search "
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row gap-x-1 justify-center md:justify-end">
                            <button
                              type="button"
                              onClick={handleDownloadEXL}
                              className="relative bg-blue-400 py-1 hover:bg-blue-500 text-white px-3 rounded group"
                            >
                              <FaFileExcel />

                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:flex items-center justify-center bg-gray-600  text-white text-[.7em] rounded-md py-1 px-2">
                                Exports to excel
                              </div>
                            </button>

                            <button
                              onClick={handlePrint}
                              className="relative flex flex-row justify-center align-middle items-center gap-x-1 bg-blue-400 hover:bg-blue-500 text-white px-3 rounded group"
                            >
                              <FiPrinter />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:flex items-center justify-center bg-gray-600  text-white text-[.7em] rounded-md py-1 px-2">
                                Print{" "}
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={handleDownloadZip}
                              className={`relative bg-blue-400 text-white px-3 rounded hover:bg-blue-500 group ${
                                isSubmitDisabled
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={isSubmitDisabled}
                            >
                              <FaDownload />

                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:flex items-center justify-center bg-gray-600  text-white text-[.7em] rounded-md py-1 px-2">
                                Download profile images
                              </div>
                            </button>
                          </div>
                        </div>
                        <div
                          className=" relative w-[97%]   mb-3 h-1  mx-auto bg-red-700"
                          style={{
                            backgroundColor: "#C03078",
                          }}
                        ></div>

                        <div className="card-body w-full">
                          <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden">
                            <table className="min-w-full leading-normal table-auto">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                    Sr.No
                                  </th>

                                  <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                    Photo
                                  </th>
                                  <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                    Employee Id
                                  </th>
                                  <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                    Name
                                  </th>

                                  <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                    Phone No.
                                  </th>

                                  <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                    Address
                                  </th>
                                  <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                    Gender
                                  </th>
                                  <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                    Blood Group
                                  </th>

                                  <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                    Profile Image Name
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {displayedSections.length ? (
                                  displayedSections.map((subject, index) => (
                                    <tr
                                      key={subject.student_id}
                                      className="text-sm "
                                    >
                                      <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                        {currentPage * pageSize + index + 1}
                                      </td>

                                      <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm py-1">
                                        {console.log(
                                          "the teacher image",
                                          `${subject?.teacher_image_url}`
                                        )}

                                        <img
                                          src={
                                            subject?.teacher_image_url
                                              ? // ? `https://sms.evolvu.in/storage/app/public/student_images/${subject?.image_name}`
                                                `${subject?.teacher_image_url}`
                                              : "https://via.placeholder.com/50"
                                          }
                                          alt={subject?.name}
                                          className="rounded-full w-8 h-8 lg:w-10 lg:h-10 object-cover"
                                        />
                                      </td>
                                      <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                        {subject?.employee_id}
                                      </td>

                                      <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                        {`${subject?.name ?? ""}`.trim()}
                                      </td>

                                      <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                        {subject?.phone}
                                      </td>

                                      <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                        {subject?.address}
                                      </td>
                                      <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                        {subject?.sex || " "}
                                      </td>
                                      <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                        {subject?.blood_group}
                                      </td>

                                      <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                        {subject?.teacher_image_name}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <div className=" absolute left-[1%] w-[100%]  text-center flex justify-center items-center mt-14">
                                    <div className=" text-center text-xl text-red-700">
                                      Oops! No data found..
                                    </div>
                                  </div>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal show " style={{ display: "block" }}>
            <div className="modal-dialog  modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Download Student Id Card</h5>
                  <RxCross1
                    className="float-end relative mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                    type="button"
                    // className="btn-close text-red-600"
                    onClick={handleCloseModal}
                  />
                </div>
                <div
                  className=" relative  mb-3 h-1 w-[95%] mx-auto bg-red-700"
                  style={{
                    backgroundColor: "#C03078",
                  }}
                ></div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to download student ID card of
                    {` ${selectedStudent?.label}?`}
                    {/* {currentClass?.name}? */}
                  </p>
                </div>
                <div className=" flex justify-end p-3">
                  <button
                    type="button"
                    className="py-2 rounded-md bg-blue-500 hover:bg-blue-700 text-white px-3 "
                    onClick={handleSubmitDownloadZip}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Downloading..." : "Download"}
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

export default TeacherIdCard;
