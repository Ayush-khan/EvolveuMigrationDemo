import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import Loader from "../../common/LoaderFinal/LoaderStyle";
import { FiPrinter } from "react-icons/fi";

const ViewExamTimeTable = () => {
  const API_URL = import.meta.env.VITE_API_URL; // API base URL
  const location = useLocation();
  const { staff } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [timetable, setTimetable] = useState([]);
  const [examDetails, setExamDetails] = useState({
    examname: "",
    classname: "",
  });
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  // Fetch timetable data on component mount
  useEffect(() => {
    const fetchTimetableData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        setLoading(true);
        const response = await axios.get(
          `${API_URL}/api/get_viewtimetable?exam_id=${staff?.exam_tt_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = response.data;

        if (data?.success) {
          const timetableDetails = data.exam_timetable_details || [];
          setTimetable(timetableDetails);
          setExamDetails(data.classterm || {});
          setDescription(timetableDetails[0]?.description?.description || "-"); // Set description dynamically

          // Check if timetableDetails array is empty
          if (timetableDetails.length === 0) {
            toast.error("No timetable data available.");
          }
        } else {
          toast.error("Failed to fetch timetable data.");
        }
      } catch (error) {
        console.error("Error fetching timetable:", error);
        toast.error("An error occurred while fetching timetable data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTimetableData();
  }, [API_URL, staff?.exam_tt_id]);

  const contentRef = useRef(); // Create a reference to the content to be printed

  // Set up the print functionality
  //   const handlePrint = useReactToPrint({
  //     content: () => contentRef.current, // Set content to be printed
  //     documentTitle: "Exam Timetable", // Title for the print window
  //     // Optional styles for print
  //     pageStyle: "@media print { table { width: 100%; } }",
  //   });
  const handlePrint = () => {
    // Prepare the content for printing
    const printContent = `
    <div class="flex items-center justify-center min-h-screen bg-white">
      <div id="tableHeading" class="text-center w-3/4">
        <h4 id="tableHeading5" class="text-xl text-center mb-0">
          Timetable of ${examDetails.examname} (Class ${examDetails.classname})
        </h4>
        <table class="w-full border-collapse border border-black mx-auto mt-0">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-black p-2 text-center font-semibold">Date</th>
              <th class="border border-black p-2 text-center font-semibold">Subject Name</th>
            </tr>
          </thead>
          <tbody>
            ${timetable
              .map(
                (row) => `
                <tr>
                  <td class="border border-black p-2 text-center">
                    ${row.date}
                  </td>
                  <td class="border border-black p-2 text-center ${
                    row.study_leave ? "text-red-600 font-semibold" : ""
                  }">
                    ${row.study_leave ? row.study_leave : row.subjects || "-"}
                  </td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
        <div id="bottomDiscription" class="w-full mt-6 flex items-center space-x-4">
          <h5 class="text-lg font-bold text-gray-700">Description:</h5>
          <p id="descriptionContent" class="text-[.8em] mt-2 bg-green-50 px-4 py-2 rounded-md shadow-sm">
            ${description || ""}
          </p>
        </div>
        <hr>
        
      </div>
    </div>
  `;

    // Open a new print window
    const printWindow = window.open("", "", "height=800,width=1000");
    printWindow.document.write(
      `<html>
      <head>
        <title>Timetable of ${examDetails.examname} (Class ${examDetails.classname})</title>
        <style>
          @page {
            margin:  0 ; /* Remove browser-added margins and headers/footers */
          }
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
          }
          #tableHeading {
            width: 70%;
            
            margin: auto;
            margin-top:4em;
          }
          #tableHeading5 {
            text-align: center;
            margin-bottom: 5px; /* Remove space below heading */
          }
          #decorateAtag {
            text-decoration: none;
            font-size: 0.75rem; /* Smaller font size */
          }
          #Atag {
            text-decoration: none;
          }
          #bottomDiscription {
            width: 100%;
            display: flex;
            justify-content: flex-start;
            gap: 1em;
          }
          #descriptionContent {
            margin-top: 20px;
            font-size: 0.9em;
          }
          table {
            border-spacing: 0;
            width: 100%;
            margin: auto;
          }
          th {
            background-color: #FFFFFF;
          }
          th, td {
            border: 1px solid gray;
            padding: 8px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>`
    );
    printWindow.document.close();

    // Trigger the print dialog
    printWindow.print();
  };

  console.log("handlePrint", handlePrint);

  return (
    <div className="w-full md:w-[80%] mx-auto p-4">
      <ToastContainer />
      <div className="card p-4 rounded-md">
        <div className="card-header mb-4 flex justify-between items-center">
          <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
            View Exam Timetable
          </h5>
          <RxCross1
            className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
            onClick={() => navigate("/exam_TImeTable")}
          />
        </div>
        <div
          className="relative w-full -top-6 h-1 mx-auto bg-red-700"
          style={{ backgroundColor: "#C03078" }}
        ></div>
        <div className="text-center relative -top-4  flex justify-end">
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            <FiPrinter />{" "}
          </button>
        </div>
        <div className="w-full mt-2 text-sm md:text-[1.4em] text-opacity-90 font-semibold text-blue-700 flex flex-row justify-center items-center">
          Timetable of{" "}
          <span className="px-1 md:px-2">{examDetails.examname}</span> (Class{" "}
          <span className="text-pink-500 px-1 md:px-2">
            {examDetails.classname}
          </span>
          )
        </div>

        <div
          id="printable-area"
          className="md:w-[75%] w-full mx-auto py-4 px-1 md:px-4"
        >
          <div className="card bg-gray-100 py-2 px-3 rounded-md">
            <div className="overflow-x-auto">
              {/* Wrap the entire content with the contentRef */}
              <div ref={contentRef}>
                <table className="table-auto mt-4 w-full border-collapse border bg-gray-50 border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2 font-semibold text-center">
                        Date
                      </th>
                      <th className="border p-2 font-semibold text-center">
                        Subjects
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                          <Loader />
                        </div>
                      </tr>
                    ) : (
                      timetable.map((row, index) => (
                        <tr
                          key={index}
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-100"
                          } hover:bg-gray-200`}
                        >
                          <td className="border p-2 text-center">{row.date}</td>
                          <td
                            className={`border p-2 text-center ${
                              row.study_leave
                                ? "text-red-500 font-semibold"
                                : ""
                            }`}
                          >
                            {row.study_leave
                              ? row.study_leave
                              : row.subjects || "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-4 mb-3 ml-0 flex flex-row gap-x-4">
              <label
                htmlFor="description"
                className="block font-semibold text-[1em] mb-2 text-gray-700"
              >
                Description:
              </label>
              <textarea
                type="text"
                id="description"
                maxLength={500}
                readOnly
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-1 bg-gray-200 outline-none rounded-sm border-gray-300 p-2 w-[50%] shadow-md mb-2"
              />
            </div>

            {/* Print Button */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewExamTimeTable;
