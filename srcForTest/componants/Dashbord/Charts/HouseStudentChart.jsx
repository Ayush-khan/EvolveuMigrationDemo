// // First try
// import React, { useState, useEffect } from "react";
// import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
// import axios from "axios";
// import styles from "../Charts/StudentStyle.module.css";

// const API_URL = "http://127.0.0.1:8000"; // Base URL for your API

// const COLORS = ["#00FFFF", "#A287F3", "#34D399", "#EE82EE"]; // Define your colors

// const HouseStudentChart = () => {
//   const [selectedClass, setSelectedClass] = useState("1"); // Default class set to "1"
//   const [sectionsData, setSectionsData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError("");

//       try {
//         const token = localStorage.getItem("authToken");
//         const academicYr = localStorage.getItem("academicYear");
//         console.log("academic year", academicYr);
//         console.log("token is", token);

//         if (!token || !academicYr) {
//           throw new Error("No authentication token or academic year found");
//         }
//         const response = await axios.get(`${API_URL}/api/getHouseViseStudent`, {
//           params: {
//             class_name: selectedClass,
//             "X-Academic-Year": "2022-2023",
//           },
//           headers: {
//             Authorization: `Bearer ${token}`,
//             // "X-Academic-Year": academicYr,
//             "X-Academic-Year": "2022-2023",
//             // "X-Academic-Year": "2023-2024",
//           },
//         });

//         const data = response.data;

//         // Transforming data into the structure needed for the pie charts
//         const transformedData = data.reduce((acc, curr) => {
//           if (!acc[curr.class_section]) {
//             acc[curr.class_section] = [];
//           }
//           acc[curr.class_section].push({
//             name: curr.house_name || "No House",
//             value: curr.student_counts,
//           });
//           return acc;
//         }, {});

//         setSectionsData(transformedData);
//       } catch (error) {
//         setError("Error fetching class data");
//         console.error("Error fetching class data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [selectedClass]);

//   const renderPieChart = (section) => (
//     <ResponsiveContainer width={227} height={118}>
//       <PieChart>
//         <Pie
//           dataKey="value"
//           startAngle={180}
//           endAngle={0}
//           data={sectionsData[section]}
//           cx="48%"
//           cy="100%"
//           outerRadius={80}
//           fill="#8884d8"
//           label
//         >
//           {sectionsData[section]?.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//           ))}
//         </Pie>
//       </PieChart>
//     </ResponsiveContainer>
//   );

//   return (
//     <div className={`${styles.studenChart} flex flex-col w-full`}>
//       <div className="flex flex-row justify-between items-center bg-gray-200 p-1">
//         <span className="lg:text-lg sm:text-xs sm:font-semibold text-gray-500">
//           House Chart
//         </span>
//         <div className="w-64 sm:w-1/2 flex flex-row justify-end items-center gap-x-2">
//           <label
//             htmlFor="class-select"
//             className="text-sm sm:text-xs font-semibold text-gray-500"
//           >
//             Select Class:
//           </label>
//           <select
//             id="class-select"
//             value={selectedClass}
//             onChange={(e) => setSelectedClass(e.target.value)}
//             className="block h-fit px-2 bg-gray-100 border border-gray-950 rounded-md shadow-sm hover:cursor-pointer focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           >
//             {Array.from({ length: 12 }, (_, i) => i + 1).map((cls) => (
//               <option key={cls} value={cls}>
//                 Class {cls}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//       {error && <p className="text-red-500">{error}</p>}
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div
//           className={`flex mt-2 rounded-lg ${styles.customScrollbar} w-full`}
//         >
//           {Object.keys(sectionsData).map((section) => (
//             <div
//               key={section}
//               className="flex flex-col justify-center items-center gap-y-4 w-full px-4"
//               style={{ alignItems: "center" }}
//             >
//               <p className="text-gray-400 font-bold mb-0 pb-0">{section}</p>
//               {renderPieChart(section)}
//               <ul className="mt-1 list-disc grid grid-cols-2 gap-x-8 mr-6 text-sm text-center">
//                 <li className="text-red-500">No House</li>
//                 <li className="text-yellow-500">House E</li>
//                 <li className="text-green-500">House R</li>
//                 <li className="text-blue-500">House S</li>
//               </ul>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default HouseStudentChart;

// // Here the color is also shown... this is write version
// import React, { useState, useEffect } from "react";
// import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
// import axios from "axios";
// import styles from "../Charts/StudentStyle.module.css";
// import LoadingSpinner from "../../common/LoadingSpinner";

// const API_URL = "http://127.0.0.1:8000"; // Base URL for your API

// const HouseStudentChart = () => {
//   const [selectedClass, setSelectedClass] = useState("1"); // Default class set to "1"
//   const [sectionsData, setSectionsData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError("");

//       try {
//         const token = localStorage.getItem("authToken");
//         const academicYr = localStorage.getItem("academicYear");
//         console.log("academic year", academicYr);
//         console.log("token is", token);

//         if (!token || !academicYr) {
//           throw new Error("No authentication token or academic year found");
//         }
//         const response = await axios.get(`${API_URL}/api/getHouseViseStudent`, {
//           params: {
//             class_name: selectedClass,
//             "X-Academic-Year": "2022-2023",
//           },
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "X-Academic-Year": "2022-2023",
//           },
//         });

//         const data = response.data;

//         // Transforming data into the structure needed for the pie charts
//         const transformedData = data.reduce((acc, curr) => {
//           if (!acc[curr.class_section]) {
//             acc[curr.class_section] = [];
//           }
//           acc[curr.class_section].push({
//             name: curr.house_name || "No House",
//             value: curr.student_counts,
//             color: curr.color_code || "#000000", // Default color if none provided
//           });
//           return acc;
//         }, {});

//         setSectionsData(transformedData);
//       } catch (error) {
//         setError("Error fetching class data");
//         console.error("Error fetching class data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [selectedClass]);

//   const renderPieChart = (section) => (
//     <ResponsiveContainer width={227} height={118}>
//       <PieChart>
//         <Pie
//           dataKey="value"
//           startAngle={180}
//           endAngle={0}
//           data={sectionsData[section]}
//           cx="48%"
//           cy="100%"
//           outerRadius={80}
//           fill="#8884d8"
//           label
//         >
//           {sectionsData[section]?.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={entry.color} />
//           ))}
//         </Pie>
//       </PieChart>
//     </ResponsiveContainer>
//   );

//   return (
//     <div className={`${styles.studenChart} flex flex-col w-full`}>
//       <div className="flex flex-row justify-between items-center bg-gray-200 p-1">
//         <span className="lg:text-lg sm:text-xs sm:font-semibold text-gray-500">
//           House Chart
//         </span>
//         <div className="w-64 sm:w-1/2 flex flex-row justify-end items-center gap-x-2">
//           <label
//             htmlFor="class-select"
//             className="text-sm sm:text-xs font-semibold text-gray-500"
//           >
//             Select Class:
//           </label>
//           <select
//             id="class-select"
//             value={selectedClass}
//             onChange={(e) => setSelectedClass(e.target.value)}
//             className="block h-fit px-2 bg-gray-100 border border-gray-950 rounded-md shadow-sm hover:cursor-pointer focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           >
//             {Array.from({ length: 12 }, (_, i) => i + 1).map((cls) => (
//               <option key={cls} value={cls}>
//                 Class {cls}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//       {error && <p className="text-red-500">{error}</p>}
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className={`flex mt-2 rounded-lg ${styles.customScrollbar} w-full`}>
//           {Object.keys(sectionsData).map((section) => (
//             <div
//               key={section}
//               className="flex flex-col justify-center items-center gap-y-4 w-full px-4"
//               style={{ alignItems: "center" }}
//             >
//               <p className="text-gray-400 font-bold mb-0 pb-0">{`Section-${section}`}</p>
//               {renderPieChart(section)}
//               <ul className="mt-1 list-disc grid grid-cols-2 gap-x-8 mr-6 text-sm text-center">
//                 {sectionsData[section]?.map((entry, index) => (
//                   <li
//                     key={entry.name || `house-no-${index}`}
//                     style={{ color: entry.color }}
//                   >
//                     {entry.name ? `${entry.name}` : "House-NO"}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default HouseStudentChart;

// Second try WIth API calling
import { useState, useEffect } from "react";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import axios from "axios";
import styles from "../Charts/StudentStyle.module.css";
import LoadingSpinner from "../../common/LoadingSpinner";
const API_URL = import.meta.env.VITE_API_URL; // Base URL for your API
// const API_URL = "http://127.0.0.1:8000";

const COLORS = ["#00FFFF", "#A287F3", "#34D399", "#EE82EE"]; // Define your colors

const HouseStudentChart = () => {
  const [selectedClass, setSelectedClass] = useState("1"); // Default class set to "1"
  const [sectionsData, setSectionsData] = useState({});
  const [houseNames, setHouseNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("authToken");
        const academicYr = localStorage.getItem("academicYear");
        console.log("academic year", academicYr);
        console.log("token is", token);

        if (!token || !academicYr) {
          throw new Error("No authentication token or academic year found");
        }
        const response = await axios.get(`${API_URL}/api/getHouseViseStudent`, {
          params: {
            class_name: selectedClass,
            // "X-Academic-Year": academicYr,
            "X-Academic-Year": "2022-2023",
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Academic-Year": "2022-2023",
          },
        });

        const data = response.data;

        // Transforming data into the structure needed for the pie charts
        const transformedData = data.reduce((acc, curr) => {
          if (!acc[curr.class_section]) {
            acc[curr.class_section] = [];
          }
          acc[curr.class_section].push({
            name: curr.house_name || "No House",
            value: curr.student_counts,
          });
          return acc;
        }, {});

        setSectionsData(transformedData);

        // Extract unique house names
        const uniqueHouseNames = [
          ...new Set(data.map((item) => item.house_name || "No House")),
        ];
        setHouseNames(uniqueHouseNames);
      } catch (error) {
        setError("Error fetching class data");
        console.error("Error fetching class data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedClass]);

  const renderPieChart = (section) => (
    <ResponsiveContainer width={227} height={118}>
      <PieChart>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={sectionsData[section]}
          cx="48%"
          cy="100%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {sectionsData[section]?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div
      className={`${styles.studenChart} flex flex-col w-full   lg:h-[18.2rem]`}
    >
      <div className="flex flex-row justify-between items-center bg-gray-200 p-1">
        <span className="lg:text-lg sm:text-xs sm:font-semibold text-gray-500">
          House Chart
        </span>
        <div className="w-64 sm:w-1/2 flex flex-row justify-end items-center gap-x-2">
          <label
            htmlFor="class-select"
            className="text-sm sm:text-xs font-semibold text-gray-500"
          >
            Select Class:
          </label>
          <select
            id="class-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="block h-fit px-2 bg-gray-100 border border-gray-950 rounded-md shadow-sm hover:cursor-pointer focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-semibold"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((cls) => (
              <option key={cls} value={cls}>
                Class {cls}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && <p className="text-red-500 ">{error}</p>}
      {loading ? (
        <p className="text-center   bg-blue-700 w-5 m-auto  ">
          <LoadingSpinner />
        </p>
      ) : (
        <div
          className={`flex mt-2 rounded-lg ${styles.customScrollbar} w-full `}
        >
          {Object.keys(sectionsData).map((section) => (
            <div
              key={section}
              className="flex flex-col justify-center items-center gap-y-8 w-full px-4 box-border"
              style={{ alignItems: "center" }}
            >
              <p className="text-gray-400 font-bold text-md mb-0 pb-0">{`Section-${section}`}</p>
              {renderPieChart(section)}
              <ul className=" list-disc grid grid-cols-2 gap-x-6 mr-6 text-xs font-bold text-center">
                {sectionsData[section]?.map((entry, index) => (
                  <li
                    key={entry.name || `house-no-${index}`}
                    style={{ color: COLORS[index % COLORS.length] }}
                  >
                    {entry.name ? `${entry.name}` : "House-NO"}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HouseStudentChart;
