// import { useState, useEffect } from "react";
// import Style from "../Charts/StudentStyle.module.css";
// // src\componants\Dashbord\Charts\StudentStyle.module.css
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   CartesianGrid,
//   LabelList,
// } from "recharts";
// import axios from "axios";

// const StudentsChart = () => {
//   const [data, setData] = useState([]);
//   const [barCategoryGap, setBarCategoryGap] = useState("40%");
//   const [xAxisFontSize, setXAxisFontSize] = useState(7);
//   const [xAxisTickMargin, setXAxisTickMargin] = useState(5);
//   const [xAxisTickWidth, setXAxisTickWidth] = useState(1);
//   const [labelFontSize, setLabelFontSize] = useState("0.6em");

//   useEffect(() => {
//     // Set barCategoryGap based on the initial screen size
//     const updateBarCategoryGap = () => {
//       if (window.innerWidth > 768) {
//         // Assuming 768px is the breakpoint for mobile
//         setBarCategoryGap("20%");
//         setXAxisFontSize(14);
//         setXAxisTickMargin(10);
//         setXAxisTickWidth(7);
//         setLabelFontSize("0.8em");
//       } else {
//         setBarCategoryGap("15%");
//         setXAxisFontSize(".4em");
//         setXAxisTickMargin(1);
//         setXAxisTickWidth(8);
//         setLabelFontSize("0.4em");
//       }
//     };
//     // Call the function on mount
//     updateBarCategoryGap();
//     window.addEventListener("resize", updateBarCategoryGap);

//     return () => window.removeEventListener("resize", updateBarCategoryGap);
//   }, []);

//   useEffect(() => {
//     // Mock API call to fetch data
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("https://api.example.com/data");
//         setData(response.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setData([
//           {
//             class: "Nursery",
//             "Section-A": 130,
//             "Section-B": 228,
//             "Section-C": 125,
//             "Section-D": 277,
//           },
//           {
//             class: "LKG",
//             "Section-A": 321,
//             "Section-B": 292,
//             "Section-C": 261,
//             "Section-D": 281,
//           },
//           {
//             class: "UKG",
//             "Section-A": 303,
//             "Section-B": 281,
//             "Section-C": 252,
//             "Section-D": 271,
//           },
//           {
//             class: "class 1",
//             "Section-A": 301,
//             "Section-B": 218,
//             "Section-C": 215,
//             "Section-D": 217,
//           },
//           {
//             class: "class 2",
//             "Section-A": 321,
//             "Section-B": 219,
//             "Section-C": 262,
//             "Section-D": 281,
//           },
//           {
//             class: "class 3",
//             "Section-A": 301,
//             "Section-B": 218,
//             "Section-C": 251,
//             "Section-D": 271,
//           },
//           {
//             class: "class 4",
//             "Section-A": 301,
//             "Section-B": 228,
//             "Section-C": 215,
//             "Section-D": 127,
//           },
//           {
//             class: "class 5",
//             "Section-A": 132,
//             "Section-B": 292,
//             "Section-C": 226,
//             "Section-D": 128,
//           },
//           {
//             class: "class 6",
//             "Section-A": 320,
//             "Section-B": 218,
//             "Section-C": 225,
//             "Section-D": 217,
//           },
//           {
//             class: "class 7",
//             "Section-A": 309,
//             "Section-B": 128,
//             "Section-C": 215,
//             "Section-D": 217,
//           },
//           {
//             class: "class 8",
//             "Section-A": 312,
//             "Section-B": 219,
//             "Section-C": 226,
//             "Section-D": 228,
//           },
//           {
//             class: "class 9",
//             "Section-A": 310,
//             "Section-B": 228,
//             "Section-C": 225,
//             "Section-D": 217,
//           },
//           {
//             class: "class 10",
//             "Section-A": 130,
//             "Section-B": 228,
//             "Section-C": 215,
//             "Section-D": 217,
//           },
//           {
//             class: "class 11",
//             "Section-A": 312,
//             "Section-B": 219,
//             "Section-C": 226,
//             "Section-D": 128,
//           },
//           {
//             class: "class 12",
//             "Section-A": 130,
//             "Section-B": 128,
//             "Section-C": 125,
//             "Section-D": 127,
//           },
//         ]);
//       }
//     };

//     fetchData();
//   }, []);

//   const renderTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       const sectionData = payload[0].payload;
//       const totalStudents =
//         sectionData["Section-A"] +
//         sectionData["Section-B"] +
//         sectionData["Section-C"] +
//         sectionData["Section-D"];
//       return (
//         <div className="custom-tooltip" style={tooltipStyles}>
//           <p style={labelStyles}>{`Class: ${sectionData.class}`}</p>
//           {payload.map((entry, index) => (
//             <p
//               key={`item-${index}`}
//               style={{ ...itemStyles, color: entry.color }}
//             >{`${entry.name}: ${entry.value}`}</p>
//           ))}
//           <p style={totalStyles}>{`Total Students: ${totalStudents}`}</p>
//         </div>
//       );
//     }

//     return null;
//   };

//   const tooltipStyles = {
//     boxSizing: "border-box",
//     backgroundColor: "#fff",
//     fontWeight: "bold",
//     boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.33)",
//     borderRadius: "5px",
//     padding: "10px",
//     paddingBottom: "0px",
//     width: "100%",
//     fontSize: ".7em",
//   };

//   const labelStyles = {
//     fontWeight: "bold",
//     marginBottom: "5px",
//   };

//   const itemStyles = {
//     margin: 0,
//   };

//   const totalStyles = {
//     marginTop: "10px",
//     fontWeight: "bold",
//     fontSize: "1em",
//   };

//   return (
//     <ResponsiveContainer
//       width="100%"
//       style={{
//         margin: "auto",
//       }}
//     >
//       <BarChart
//         data={data}
//         margin={{
//           top: 20,
//           right: 20,
//           left: 20,
//           bottom: 20,

//           // width={900}
//           // // height={300}
//           // data={data}
//           // margin={{
//           //   top: 5,
//           //   right: 30,
//           //   left: 20,
//           //   bottom: 5,
//         }}
//         barCategoryGap={barCategoryGap}
//       >
//         <XAxis
//           dataKey="class"
//           // tick={{ fontSize: 14 }}
//           tick={{ fontSize: xAxisFontSize }}
//           interval={0}
//           tickMargin={xAxisTickMargin}
//           tickSize={xAxisTickWidth}
//           // tickMargin={5}
//         />
//         <YAxis />
//         <Tooltip content={renderTooltip} />
//         <Legend />
//         <Bar dataKey="Section-A" stackId="a" fill="#00FFFF">
//           <LabelList
//             className="abclist"
//             dataKey="Section-A"
//             fill="white"
//             style={{ fontSize: labelFontSize }}
//           />
//         </Bar>
//         <Bar dataKey="Section-B" stackId="a" fill="#34d399">
//           <LabelList
//             dataKey="Section-B"
//             fill="white"
//             style={{ fontSize: labelFontSize }}
//           />
//         </Bar>
//         <Bar dataKey="Section-C" stackId="a" fill="#a78bfa">
//           <LabelList
//             dataKey="Section-C"
//             fill="white"
//             style={{ fontSize: labelFontSize }}
//           />
//         </Bar>
//         <Bar dataKey="Section-D" stackId="a" fill="#E77EE7">
//           <LabelList
//             dataKey="Section-D"
//             fill="white"
//             style={{ fontSize: labelFontSize }}
//           />
//         </Bar>
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

// export default StudentsChart;

// Second try
// import { useState, useEffect } from "react";
// import Style from "../Charts/StudentStyle.module.css";
// // src\componants\Dashbord\Charts\StudentStyle.module.css
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   CartesianGrid,
//   LabelList,
// } from "recharts";
// import axios from "axios";

// const StudentsChart = () => {
//   const [data, setData] = useState([]);
//   const [barCategoryGap, setBarCategoryGap] = useState("40%");
//   const [xAxisFontSize, setXAxisFontSize] = useState(7);
//   const [xAxisTickMargin, setXAxisTickMargin] = useState(5);
//   const [xAxisTickWidth, setXAxisTickWidth] = useState(1);
//   const [labelFontSize, setLabelFontSize] = useState("0.6em");

//   useEffect(() => {
//     // Set barCategoryGap based on the initial screen size
//     const updateBarCategoryGap = () => {
//       if (window.innerWidth > 768) {
//         // Assuming 768px is the breakpoint for mobile
//         setBarCategoryGap("20%");
//         setXAxisFontSize(14);
//         setXAxisTickMargin(10);
//         setXAxisTickWidth(7);
//         setLabelFontSize("0.8em");
//       } else {
//         setBarCategoryGap("15%");
//         setXAxisFontSize(".4em");
//         setXAxisTickMargin(1);
//         setXAxisTickWidth(8);
//         setLabelFontSize("0.4em");
//       }
//     };
//     // Call the function on mount
//     updateBarCategoryGap();
//     window.addEventListener("resize", updateBarCategoryGap);

//     return () => window.removeEventListener("resize", updateBarCategoryGap);
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         const academicYear = localStorage.getItem("academicYear");
//         if (!token || !academicYear) {
//           throw new Error("No authentication token or academic year found");
//         }

//         const response = await axios.get(
//           `http://127.0.0.1:8000/api/getClassDivisionTotalStudents`,
//           // `${API_URL}/api/getClassDivisionTotalStudents`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "X-Academic-Year": academicYear,
//             },
//           }
//         );

//         // Process the data to aggregate sections under each class
//         const apiData = response.data.reduce((acc, item) => {
//           const existingClass = acc.find(
//             (entry) => entry.class === item.class_name
//           );
//           if (existingClass) {
//             existingClass[`Section-${item.section_name}`] = parseInt(
//               item.total_students,
//               10
//             );
//           } else {
//             acc.push({
//               class: item.class_name,
//               [`Section-${item.section_name}`]: parseInt(
//                 item.total_students,
//                 10
//               ),
//             });
//           }
//           return acc;
//         }, []);

//         setData(apiData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const renderTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       const sectionData = payload[0].payload;
//       const totalStudents =
//         (sectionData["Section-A"] || 0) +
//         (sectionData["Section-B"] || 0) +
//         (sectionData["Section-C"] || 0) +
//         (sectionData["Section-D"] || 0);
//       return (
//         <div className="custom-tooltip" style={tooltipStyles}>
//           <p style={labelStyles}>{`Class: ${sectionData.class}`}</p>
//           {payload.map((entry, index) => (
//             <p
//               key={`item-${index}`}
//               style={{ ...itemStyles, color: entry.color }}
//             >{`${entry.name}: ${entry.value}`}</p>
//           ))}
//           <p style={totalStyles}>{`Total Students: ${totalStudents}`}</p>
//         </div>
//       );
//     }

//     return null;
//   };

//   const tooltipStyles = {
//     boxSizing: "border-box",
//     backgroundColor: "#fff",
//     fontWeight: "bold",
//     boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.33)",
//     borderRadius: "5px",
//     padding: "10px",
//     paddingBottom: "0px",
//     width: "100%",
//     fontSize: ".7em",
//   };

//   const labelStyles = {
//     fontWeight: "bold",
//     marginBottom: "5px",
//   };

//   const itemStyles = {
//     margin: 0,
//   };

//   const totalStyles = {
//     marginTop: "10px",
//     fontWeight: "bold",
//     fontSize: "1em",
//   };

//   return (
//     <ResponsiveContainer
//       width="100%"
//       style={{
//         margin: "auto",
//       }}
//     >
//       <BarChart
//         data={data}
//         margin={{
//           top: 20,
//           right: 20,
//           left: 20,
//           bottom: 20,
//         }}
//         barCategoryGap={barCategoryGap}
//       >
//         <XAxis
//           dataKey="class"
//           tick={{ fontSize: xAxisFontSize }}
//           interval={0}
//           tickMargin={xAxisTickMargin}
//           tickSize={xAxisTickWidth}
//         />
//         <YAxis />
//         <Tooltip content={renderTooltip} />
//         <Legend />
//         <Bar dataKey="Section-A" stackId="a" fill="#00FFFF">
//           <LabelList
//             className="abclist"
//             dataKey="Section-A"
//             fill="white"
//             style={{ fontSize: labelFontSize }}
//           />
//         </Bar>
//         <Bar dataKey="Section-B" stackId="a" fill="#34d399">
//           <LabelList
//             dataKey="Section-B"
//             fill="white"
//             style={{ fontSize: labelFontSize }}
//           />
//         </Bar>
//         <Bar dataKey="Section-C" stackId="a" fill="#a78bfa">
//           <LabelList
//             dataKey="Section-C"
//             fill="white"
//             style={{ fontSize: labelFontSize }}
//           />
//         </Bar>
//         <Bar dataKey="Section-D" stackId="a" fill="#E77EE7">
//           <LabelList
//             dataKey="Section-D"
//             fill="white"
//             style={{ fontSize: labelFontSize }}
//           />
//         </Bar>
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

// export default StudentsChart;

// third try
import { useState, useEffect } from "react";
import Style from "../Charts/StudentStyle.module.css";
// src\componants\Dashbord\Charts\StudentStyle.module.css
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import axios from "axios";

const StudentsChart = () => {
  const [data, setData] = useState([]);
  const [barCategoryGap, setBarCategoryGap] = useState("40%");
  const [xAxisFontSize, setXAxisFontSize] = useState(7);
  const [xAxisTickMargin, setXAxisTickMargin] = useState(5);
  const [xAxisTickWidth, setXAxisTickWidth] = useState(1);
  const [labelFontSize, setLabelFontSize] = useState("0.6em");
  const API_URL = import.meta.env.VITE_API_URL; // Base URL for your API
  useEffect(() => {
    // Set barCategoryGap based on the initial screen size
    const updateBarCategoryGap = () => {
      if (window.innerWidth > 768) {
        // Assuming 768px is the breakpoint for mobile
        setBarCategoryGap("20%");
        setXAxisFontSize(14);
        setXAxisTickMargin(10);
        setXAxisTickWidth(7);
        setLabelFontSize("0.8em");
      } else {
        setBarCategoryGap("15%");
        setXAxisFontSize(".4em");
        setXAxisTickMargin(1);
        setXAxisTickWidth(8);
        setLabelFontSize("0.4em");
      }
    };
    // Call the function on mount
    updateBarCategoryGap();
    window.addEventListener("resize", updateBarCategoryGap);

    return () => window.removeEventListener("resize", updateBarCategoryGap);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const academicYear = localStorage.getItem("academicYear");
        if (!token || !academicYear) {
          throw new Error("No authentication token or academic year found");
        }

        const response = await axios.get(
          `${API_URL}/api/getClassDivisionTotalStudents`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Academic-Year": academicYear,
            },
          }
        );

        // Process the data to aggregate sections under each class
        const apiData = response.data.reduce((acc, item) => {
          const existingClass = acc.find(
            (entry) => entry.class === item.class_name
          );
          const students = isNaN(parseInt(item.total_students, 10))
            ? 0
            : parseInt(item.total_students, 10);

          if (existingClass) {
            existingClass[`Section-${item.section_name}`] = students;
          } else {
            acc.push({
              class: item.class_name,
              [`Section-${item.section_name}`]: students,
            });
          }
          return acc;
        }, []);

        // Sort data by class name
        const classOrder = [
          "Nursery",
          "LKG",
          "UKG",
          "class 1",
          "class 2",
          "class 3",
          "class 4",
          "class 5",
          "class 6",
          "class 7",
          "class 8",
          "class 9",
          "class 10",
          "class 11",
          "class 12",
        ];
        const sortedData = apiData.sort(
          (a, b) => classOrder.indexOf(a.class) - classOrder.indexOf(b.class)
        );

        setData(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const renderTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const sectionData = payload[0].payload;
      const totalStudents =
        (sectionData["Section-A"] || 0) +
        (sectionData["Section-B"] || 0) +
        (sectionData["Section-C"] || 0) +
        (sectionData["Section-D"] || 0);
      return (
        <div className="custom-tooltip" style={tooltipStyles}>
          <p style={labelStyles}>{`Class: ${sectionData.class}`}</p>
          {payload.map((entry, index) => (
            <p
              key={`item-${index}`}
              style={{ ...itemStyles, color: entry.color }}
            >{`${entry.name}: ${entry.value}`}</p>
          ))}
          <p style={totalStyles}>{`Total Students: ${totalStudents}`}</p>
        </div>
      );
    }

    return null;
  };

  const tooltipStyles = {
    boxSizing: "border-box",
    backgroundColor: "#fff",
    fontWeight: "bold",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.33)",
    borderRadius: "5px",
    padding: "10px",
    paddingBottom: "0px",
    width: "100%",
    fontSize: ".7em",
  };

  const labelStyles = {
    fontWeight: "bold",
    marginBottom: "5px",
  };

  const itemStyles = {
    margin: 0,
  };

  const totalStyles = {
    marginTop: "10px",
    fontWeight: "bold",
    fontSize: "1em",
  };

  return (
    <>
      <ResponsiveContainer
        width="100%"
        height="93%"
        style={{
          margin: "auto",
        }}
      >
        <div className="flex flex-row justify-between items-center bg-gray-200 p-1 rounded-t-lg">
          <span className="lg:text-lg sm:text-xs sm:font-semibold text-gray-500">
            Class-wise Student Distribution
          </span>
        </div>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 20,
            bottom: 20,
          }}
          barCategoryGap={barCategoryGap}
        >
          <XAxis
            dataKey="class"
            tick={{ fontSize: xAxisFontSize }}
            interval={0}
            tickMargin={xAxisTickMargin}
            tickSize={xAxisTickWidth}
          />
          <YAxis />
          <Tooltip content={renderTooltip} />
          <Legend />
          <Bar dataKey="Section-A" stackId="a" fill="#00FFFF">
            <LabelList
              className="abclist"
              dataKey="Section-A"
              fill="white"
              style={{ fontSize: labelFontSize }}
            />
          </Bar>
          <Bar dataKey="Section-B" stackId="a" fill="#34d399">
            <LabelList
              dataKey="Section-B"
              fill="white"
              style={{ fontSize: labelFontSize }}
            />
          </Bar>
          <Bar dataKey="Section-C" stackId="a" fill="#a78bfa">
            <LabelList
              dataKey="Section-C"
              fill="white"
              style={{ fontSize: labelFontSize }}
            />
          </Bar>
          <Bar dataKey="Section-D" stackId="a" fill="#E77EE7">
            <LabelList
              dataKey="Section-D"
              fill="white"
              style={{ fontSize: labelFontSize }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default StudentsChart;
