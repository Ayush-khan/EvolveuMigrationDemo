// import { faBullseye } from "@fortawesome/free-solid-svg-icons/faBullseye";
// import { RxCross2 } from "react-icons/rx";

// export default function Sidebar({ isSidebar, setIsSidebar }) {
//   return (
//     <div className="absolute z-30">
//       <div
//         style={{
//           height: "540px",

//           // background:
//           //   " rgb(81,199,204) linear-gradient(360deg, rgba(81,199,204,8) 0%, rgba(228,80,130,1) 53%)",
//         }}
//         className={` w-36 bg-gray-200 mt-0.5 shadow-lg relative right-36 transform transition-all  duration-500  text-center pr-3${
//           isSidebar
//             ? " relative transform translate-x-36 transition-all duration-500"
//             : "relative transform translate-x-0 transition-all duration-500"
//         }`}
//       >
//         RecentTabs
//         <RxCross2
//           className="absolute right-2 top-2 text-2xl text-red-500 hover:cursor-pointer"
//           onClick={() => setIsSidebar(false)}
//         />
//       </div>
//     </div>
//   );
// }

// // This is updated
// import React, { useState, useEffect } from "react";
// import { RxCross2 } from "react-icons/rx";
// import { Link, useLocation } from "react-router-dom";

// export default function Sidebar({ isSidebar, setIsSidebar }) {
//   const [tabVisits, setTabVisits] = useState({});
//   const location = useLocation();

//   useEffect(() => {
//     // Retrieve visit counts from local storage on component mount
//     const storedVisits = JSON.parse(localStorage.getItem("tabVisits")) || {};
//     setTabVisits(storedVisits);
//   }, []);

//   useEffect(() => {
//     // Increment visit count when a route is visited
//     const currentPath = location.pathname;
//     if (currentPath) {
//       const updatedVisits = {
//         ...tabVisits,
//         [currentPath]: (tabVisits[currentPath] || 0) + 1,
//       };
//       setTabVisits(updatedVisits);
//       localStorage.setItem("tabVisits", JSON.stringify(updatedVisits));
//     }
//   }, [location.pathname]);

//   // Function to get the most frequent tabs
//   const getMostFrequentTabs = () => {
//     const entries = Object.entries(tabVisits);
//     entries.sort((a, b) => b[1] - a[1]);
//     return entries.map((entry) => entry[0]);
//   };

//   const mostFrequentTabs = getMostFrequentTabs();

//   return (
//     <div className="absolute z-30">
//       <div
//         // style={{ height: "540px" }}
//         className={`w-36 lg:h-[84vh] bg-gray-200 mt-0.5 shadow-lg relative right-36 transform transition-all duration-500 text-center pr-3 ${
//           isSidebar
//             ? "relative transform translate-x-36 transition-all duration-500"
//             : "relative transform translate-x-0 transition-all duration-500"
//         }`}
//       >
//         <h2>Recent Tabs</h2>
//         <ul>
//           {mostFrequentTabs.map((tab, index) => (
//             <li key={index}>
//               <Link to={tab}>{tab}</Link>
//             </li>
//           ))}
//         </ul>
//         <RxCross2
//           className="absolute right-2 top-2 text-2xl text-red-500 hover:cursor-pointer"
//           onClick={() => setIsSidebar(false)}
//         />
//       </div>
//     </div>
//   );
// }

// working code

// import { RxCross2 } from "react-icons/rx";
// import { Link, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";
// export default function Sidebar({ isSidebar, setIsSidebar }) {
//   const [tabVisits, setTabVisits] = useState([]);
//   const location = useLocation();

//   // Load tab visits from local storage on component mount
//   useEffect(() => {
//     const storedVisits = JSON.parse(localStorage.getItem("tabVisits")) || [];
//     setTabVisits(storedVisits);
//   }, []);

//   // Update tab visits whenever the location pathname changes
//   useEffect(() => {
//     const currentPath = location.pathname;
//     if (currentPath) {
//       const updatedVisits = updateTabVisits(currentPath, tabVisits);
//       setTabVisits(updatedVisits);
//       localStorage.setItem("tabVisits", JSON.stringify(updatedVisits));
//     }
//   }, [location.pathname]);

//   // Function to update the tab visits array
//   const updateTabVisits = (path, visits) => {
//     const updatedVisits = [...visits];
//     const existingIndex = updatedVisits.indexOf(path);

//     if (existingIndex !== -1) {
//       // Remove existing tab
//       updatedVisits.splice(existingIndex, 1);
//     }

//     // Add new tab to the front
//     updatedVisits.unshift(path);

//     // Ensure the array only contains the last 10 tabs
//     if (updatedVisits.length > 10) {
//       updatedVisits.pop();
//     }

//     return updatedVisits;
//   };

//   return (
//     <div className="absolute z-30">
//       <div
//         className={`w-36 lg:h-[84vh] bg-gray-200 mt-0.5 shadow-lg relative right-36 transform transition-all duration-500 text-center pr-3 ${
//           isSidebar
//             ? "relative transform translate-x-36 transition-all duration-500"
//             : "relative transform translate-x-0 transition-all duration-500"
//         }`}
//       >
//         <h2>Recent Tabs</h2>
//         <ul>
//           {tabVisits.map((tab, index) => (
//             <li key={index}>
//               <Link to={tab}>{tab}</Link>
//             </li>
//           ))}
//         </ul>
//         <RxCross2
//           className="absolute right-2 top-2 text-2xl text-red-500 hover:cursor-pointer"
//           onClick={() => setIsSidebar(false)}
//         />
//       </div>
//     </div>
//   );
// }
import { RxCross2 } from "react-icons/rx";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Sidebar({ isSidebar, setIsSidebar }) {
  const [tabVisits, setTabVisits] = useState([]);
  const location = useLocation();
  console.log("locaioncurrent", location);
  // Load tab visits from local storage on component mount
  useEffect(() => {
    const storedVisits = JSON.parse(localStorage.getItem("tabVisits")) || [];
    setTabVisits(storedVisits);
  }, []);

  // Update tab visits whenever the location pathname changes
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath) {
      const updatedVisits = updateTabVisits(currentPath, tabVisits);
      setTabVisits(updatedVisits);
      localStorage.setItem("tabVisits", JSON.stringify(updatedVisits));
    }
  }, [location.pathname]);

  // Function to update the tab visits array
  const updateTabVisits = (path, visits) => {
    const updatedVisits = [...visits];
    const existingIndex = updatedVisits.indexOf(path);

    if (existingIndex !== -1) {
      // Remove existing tab
      updatedVisits.splice(existingIndex, 1);
    }

    // Add new tab to the front
    updatedVisits.unshift(path);

    // Ensure the array only contains the last 10 tabs
    if (updatedVisits.length > 10) {
      updatedVisits.pop();
    }

    return updatedVisits;
  };
  console.log("updatevisitedpath", updateTabVisits);
  return (
    <div className="hidden md:block md:fixed z-30">
      <div
        className={` md:w-36 lg:h-[80vh] bg-gray-200 mt-0.5 shadow-lg relative right-36 transform transition-all duration-500 text-center pr-3 ${
          isSidebar
            ? "relative transform translate-x-36 transition-all duration-500"
            : "relative transform translate-x-0 transition-all duration-500"
        }`}
      >
        <h2 className="text-[1.1em] font-semibold pt-2 bg-gray-200 text-gray-900 pr-2">
          Recent Tabs
          {/* fjsd */}
        </h2>
        <div
          className=" relative w-[100%]  left-2 mb-2 h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>
        <ul className="space-y-1">
          {console.log("tabvisitednow", tabVisits)}
          {tabVisits.map((tab, index) => (
            <li
              key={index}
              className="text-sm w-[132%] relative -left-6    text-center underline-none"
            >
              <Link
                to={tab}
                className="overflow-hidden block no-underline font-semibold text-[.9em] py-2 rounded-md bg-blue-500 text-pink-200 hover:text-pink-100 hover:bg-blue-600 shadow-md hover:drop-shadow-lg hover:font-bold transition duration-300"
              >
                {tab
                  .split("/")
                  .map((segment, index, arr) => {
                    const isLastSegmentNumeric =
                      !isNaN(segment) && index === arr.length - 1;
                    return isLastSegmentNumeric
                      ? `-${segment}` // Add a dash before numeric ID
                      : `${segment.charAt(0).toUpperCase()}${segment
                          .slice(1)
                          .toLowerCase()}`;
                  })
                  .join("")}
                {/* Remove any leading dash */}
                {/* {tab.split("/").pop().charAt(0).toUpperCase() +
                  tab.split("/").pop().slice(1).toLowerCase()} */}
              </Link>
            </li>
          ))}
        </ul>

        <RxCross2
          className="absolute right-2 top-3 text-xl text-red-500 hover:cursor-pointer"
          onClick={() => setIsSidebar(false)}
        />
      </div>
    </div>
  );
}
