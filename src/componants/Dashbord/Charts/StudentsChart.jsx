// Arranged the classs for accending order and make changes in the secions PCM and PCB etc baranches
// SECOND TRY FOR IMPLEMENTING THE CLASS FOR 11 AND 12 LIKE PCM AND MATHS
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import axios from "axios";
import Loader from "../../common/Loader";

const StudentsChart = () => {
  const API_URL = import.meta.env.VITE_API_URL; // Base URL for your API
  const [data, setData] = useState([]);
  const [barCategoryGap, setBarCategoryGap] = useState("40%");
  const [xAxisFontSize, setXAxisFontSize] = useState(7);
  const [xAxisTickMargin, setXAxisTickMargin] = useState(5);
  const [xAxisTickWidth, setXAxisTickWidth] = useState(1);
  const [labelFontSize, setLabelFontSize] = useState("0.6em");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updateBarCategoryGap = () => {
      if (window.innerWidth > 768) {
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

    updateBarCategoryGap();
    window.addEventListener("resize", updateBarCategoryGap);

    return () => window.removeEventListener("resize", updateBarCategoryGap);
  }, []);

  // useEffect(() => {
  //   setLoading(true);

  //   const fetchData = async () => {
  //     try {
  //       const token = localStorage.getItem("authToken");
  //       const academicYear = localStorage.getItem("academicYear");
  //       if (!token) {
  //         throw new Error("No authentication token found");
  //       }

  //       const response = await axios.get(
  //         `${API_URL}/api/getClassDivisionTotalStudents`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "X-Academic-Year": academicYear,
  //           },
  //         }
  //       );
  //       console.log("The response response of charts", response.data);

  //       // Process the data to aggregate sections under each class

  //       const apiData = response?.data.reduce((acc, item) => {
  //         const existingClass = acc.find(
  //           (entry) => entry.class === item.class_name
  //         );
  //         const students = isNaN(parseInt(item.total_students, 10))
  //           ? 0
  //           : parseInt(item.total_students, 10);

  //         if (existingClass) {
  //           existingClass[`Section-${item.section_name}`] = students;
  //         } else {
  //           acc.push({
  //             class: item.class_name,
  //             [`Section-${item.section_name}`]: students,
  //           });
  //         }
  //         return acc;
  //       }, []);

  //       // Sort data by class name
  //       const classOrder = [
  //         "Nursery",
  //         "LKG",
  //         "UKG",
  //         "1",
  //         "2",
  //         "3",
  //         "4",
  //         "5",
  //         "6",
  //         "7",
  //         "8",
  //         "9",
  //         "10",
  //         "11",
  //         "12",
  //       ];
  //       const sortedData = apiData.sort(
  //         (a, b) => classOrder.indexOf(a.class) - classOrder.indexOf(b.class)
  //       );

  //       setData(sortedData);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const academicYear = localStorage.getItem("academicYear");
        if (!token) {
          throw new Error("No authentication token found");
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

        console.log("The response response of charts", response.data);

        if (!response?.data?.length) {
          // Handle empty data case
          console.warn("API returned no data.");
          setData([]); // Set an empty array if there's no data
          return;
        }

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
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
        ];
        const sortedData = apiData.sort(
          (a, b) => classOrder.indexOf(a.class) - classOrder.indexOf(b.class)
        );

        setData(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const sectionData = payload[0].payload;
      const totalStudents = Object.keys(sectionData)
        .filter((key) => key.startsWith("Section-"))
        .reduce((total, key) => total + (sectionData[key] || 0), 0);

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

  // Extract all section keys dynamically
  const sectionKeys = [
    ...new Set(
      data.flatMap((entry) =>
        Object.keys(entry).filter((key) => key.startsWith("Section-"))
      )
    ),
  ];

  return (
    <>
      {" "}
      {loading ? (
        <p className="text-center relative top-[50%] w-10  m-auto  ">
          <Loader />
        </p>
      ) : (
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
            {sectionKeys.map((section, index) => (
              <Bar
                key={section}
                dataKey={section}
                stackId="a"
                fill={colors[index % colors.length]}
              >
                <LabelList
                  dataKey={section}
                  fill="white"
                  style={{ fontSize: labelFontSize }}
                />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

const colors = [
  "#00FFFF",
  "#34d399",
  "#a78bfa",
  "#E77EE7",
  "#FF5733",
  "#C70039",
];

export default StudentsChart;
