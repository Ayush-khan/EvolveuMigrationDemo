// import { useEffect, useState } from "react";
// import axios from "axios";
// import { IoIosArrowForward } from "react-icons/io";
// import NavBar from "../../Layouts/NavBar";
// import { RxCross1 } from "react-icons/rx";
// import { useNavigate } from "react-router-dom";
// function StaffBirthdayTabList() {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const [staffBirthday, setStaffBirthday] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   useEffect(() => {
//     const fetchStaffBirthday = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         const academicYr = localStorage.getItem("academicYear");

//         if (!token || !academicYr) {
//           throw new Error("No authentication token or academic year found");
//         }

//         const response = await axios.get(`${API_URL}/api/staffbirthdaylist`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "X-Academic-Year": academicYr,
//           },
//         });

//         setStaffBirthday(response.data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStaffBirthday();
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <>
//       {" "}
//       <div
//         className="  "
//         style={{
//           height: "100vh",
//           background: "   linear-gradient(to bottom, #E91E63, #2196F3)",
//         }}
//       >
//         <NavBar />
//         <div className=" mt-6">
//           <div className="bg-white w-fit m-auto  box-border    shadow-xl sm:rounded-lg ">
//             <div className="p-1 ">
//               <h3 className=" flex justify-start items-center gap-1  font-bold  lg:text-xl sm:text-sm text-gray-400  ">
//                 Staff Birthday List{" "}
//                 <span>
//                   <IoIosArrowForward className="text-lg  text-center" />
//                 </span>
//               </h3>
//               <RxCross1
//                 className="float-end relative -top-7 right-2 text-2xl text-red-600 hover:cursor-pointer hover:bg-red-100"
//                 onClick={() => {
//                   navigate("/dashboard");
//                 }}
//               />
//               <hr></hr>
//               <div className="overflow-x-auto">
//                 <div className="min-w-full bg-white rounded-lg overflow-hidden shadow-xs">
//                   <table className="min-w-full leading-normal">
//                     <thead>
//                       <tr className="bg-gray-200">
//                         <th
//                           scope="col"
//                           className="px-5 py-2  border border-gray-950   text-xs font-semibold text-gray-900 uppercase tracking-wider"
//                         >
//                           Name
//                         </th>
//                         <th
//                           scope="col"
//                           className="px-5 py-2  border border-gray-950 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider"
//                         >
//                           Date of Birth
//                         </th>
//                         <th
//                           scope="col"
//                           className="px-5 py-2  border border-gray-950 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider"
//                         >
//                           Gender
//                         </th>
//                         <th
//                           scope="col"
//                           className="px-5 py-2  border border-gray-950 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider"
//                         >
//                           Email
//                         </th>
//                         {/* <th
//                           scope="col"
//                           className="px-5 py-2  border border-gray-950 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider"
//                         >
//                           Religion
//                         </th> */}
//                         {/* <th
//                           scope="col"
//                           className="px-5 py-2  border border-gray-950 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider"
//                         >
//                           Designation
//                         </th> */}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {staffBirthday.map((staff) => (
//                         <tr
//                           key={staff.teacher_id}
//                           className="hover:bg-gray-100"
//                         >
//                           <td className="px-5 py-2 border border-gray-950 bg-white text-sm">
//                             <p className="text-gray-900 text-start whitespace-no-wrap">
//                               {staff.name}
//                             </p>
//                           </td>
//                           <td className="px-5 py-2 border border-gray-950 bg-white text-sm">
//                             <p className="text-gray-900 whitespace-no-wrap">
//                               {staff.birthday}
//                             </p>
//                           </td>
//                           <td className="px-5 py-2 border border-gray-950 bg-white text-sm">
//                             <p className="text-gray-900 whitespace-no-wrap">
//                               {staff.sex}
//                             </p>
//                           </td>
//                           {/* <td className="px-5 py-2 border border-gray-950 bg-white text-sm">
//                             <p className="text-gray-900 whitespace-no-wrap">
//                               {staff.sex}
//                             </p>
//                           </td> */}
//                           <td className="px-5 py-2 border border-gray-950 bg-white text-sm">
//                             <p className="text-gray-900 whitespace-no-wrap">
//                               {staff.email}
//                             </p>
//                           </td>
//                           {/* <td className="px-5 py-2 border border-gray-950 bg-white text-sm">
//                             <p className="text-gray-900 whitespace-no-wrap">
//                               {staff.designation}
//                             </p>
//                           </td> */}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default StaffBirthdayTabList;

// secondtryimport { useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowForward } from "react-icons/io";
// import { RxCross1, RxCrosshair1 } from "react-icons/rx";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import NavBar from "../../Layouts/NavBar";
import { useState, useEffect } from "react";
function StaffBirthdayTabList() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [staffBirthday, setStaffBirthday] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaffBirthday = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const academicYr = localStorage.getItem("academicYear");

        if (!token || !academicYr) {
          throw new Error("No authentication token or academic year found");
        }

        const response = await axios.get(`${API_URL}/api/staffbirthdaylist`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Academic-Year": academicYr,
          },
        });
        console.log("resposne of the birthday list is", response);
        // Ensure the data is an array
        if (response.data && Array.isArray(response.data.staffBirthday)) {
          setStaffBirthday(response.data.staffBirthday);
        } else {
          throw new Error("Unexpected response data format");
        }
        // setStaffBirthday(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffBirthday();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {/* <div
      className="  "
      style={{
        height: "100vh",
        background: "   linear-gradient(to bottom, #E91E63, #2196F3)",
      }}
    > */}

      <div className="container mt-4 ">
        <div className="  card mx-auto lg:w-3/4  shadow-lg ">
          {/* <div className="card mx-auto w-3/4"> */}
          <div className="card-header flex justify-between items-center">
            <h5 className="text-gray-700 mt-1  text-md lg:text-lg">
              Staff Birthday List
            </h5>

            <RxCross1
              className="float-end relative  right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
              onClick={() => {
                navigate("/dashboard");
              }}
            />
          </div>

          <div className="card-body w-full">
            <div className=" h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden ">
              <div className="bg-white rounded-lg  shadow-xs ">
                <table className="min-w-full leading-normal table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className=" px-0.5 text-center lg:px-1 py-2  border border-gray-950 text-sm font-semibold text-gray-900  tracking-wider">
                        S.No
                      </th>
                      <th className="text-start px-2  lg:px-2 py-2   border border-gray-950 text-sm font-semibold text-gray-900  tracking-wider">
                        Name
                      </th>
                      {/* <th className="sm:px-0.5 lg:px-2 py-2 text-center border border-gray-950 text-sm font-semibold text-gray-900  tracking-wider">
                        Date Of Birth
                      </th> */}
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900  tracking-wider">
                        Mobile
                      </th>
                      <th className="px-2  lg:px-3 lg:text-start py-2 border border-gray-950 text-sm font-semibold text-gray-900  tracking-wider">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffBirthday.map((staff, index) => (
                      <tr
                        key={staff.teacher_id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-100"
                        } hover:bg-gray-50  `}
                      >
                        <td className=" sm:px-0.5 text-center lg:px-1   border  border-gray-950   text-sm">
                          <p className="text-gray-900 whitespace-no-wrap text-center relative top-2 ">
                            {index + 1}
                          </p>
                        </td>
                        <td className="text-start px-2 lg:px-2  border border-gray-950  text-sm">
                          <p className="text-gray-900 whitespace-no-wrap relative top-2">
                            {staff.name}
                          </p>
                        </td>
                        {/* <td className="sm:px-0.5 text-center lg:px-3 py-2 text-center border border-gray-950  text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {staff.birthday}
                          </p>
                        </td> */}
                        <td className="px-2 text-center lg:px-3  border border-gray-950  text-sm">
                          <p className="text-gray-900 whitespace-no-wrap relative top-2">
                            {staff.phone}
                          </p>
                        </td>
                        <td
                          className="text-start sm:text-start px-2 lg:px-3  border border-gray-950 text-sm  "
                          style={{ textAlign: "middle" }}
                        >
                          <p className="text-gray-900 whitespace-no-wrap relative top-2 ">
                            {staff.email}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}

export default StaffBirthdayTabList;
