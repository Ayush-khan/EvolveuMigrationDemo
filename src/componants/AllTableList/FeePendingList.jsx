// secondtryimport { useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowForward } from "react-icons/io";
// import { RxCross1, RxCrosshair1 } from "react-icons/rx";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import NavBar from "../../Layouts/NavBar";
import { useState, useEffect } from "react";
function FeePendingList() {
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

        if (!token) {
          throw new Error("No authentication token or academic year found");
        }

        const response = await axios.get(`${API_URL}/api/fee_collection_list`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Academic-Year": academicYr,
          },
        });
        console.log("resposne of the birthday list is", response.data);
        if (response.data && Array.isArray(response.data)) {
          setStaffBirthday(response.data);
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
  console.log("the staffbirthlis", staffBirthday);
  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-4 ">
      <div className="  card mx-auto lg:w-3/4  shadow-lg ">
        {/* <div className="card mx-auto w-3/4"> */}
        <div className="card-header flex justify-between items-center">
          <h5 className="text-gray-700 mt-1  text-md lg:text-lg">
            Pending Fee-List
          </h5>

          <RxCross1
            className="float-end relative  right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
            onClick={() => {
              navigate("/dashboard");
            }}
          />
        </div>
        <div
          className=" relative w-[97%]   mb-3 h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>

        <div className="card-body w-full">
          <div className="bg-white rounded-lg shadow-xs  w-full md:w-[80%] mx-auto">
            <div className="bg-white rounded-lg  shadow-xs ">
              <table className="min-w-full leading-normal table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className=" px-0.5 text-center lg:px-1 py-2  border border-gray-950 text-sm font-semibold text-gray-900  tracking-wider">
                      S.No
                    </th>
                    <th className=" text-center px-2  lg:px-2 py-2   border border-gray-950 text-sm font-semibold text-gray-900  tracking-wider">
                      Installment
                    </th>
                    {/* <th className="sm:px-0.5 lg:px-2 py-2 text-center border border-gray-950 text-sm font-semibold text-gray-900  tracking-wider">
                        Date Of Birth
                      </th> */}
                    <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900  tracking-wider">
                      Pending Fee
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <div className=" absolute left-[4%] w-[100%]  text-center flex justify-center items-center mt-14">
                      <div className=" text-center text-xl text-blue-700">
                        Please wait while data is loading...
                      </div>
                    </div>
                  ) : staffBirthday.length ? (
                    staffBirthday.map((staff, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-100"
                        } hover:bg-gray-50  `}
                      >
                        <td className=" sm:px-0.5 text-center lg:px-1   border  border-gray-950   text-sm">
                          <p className="text-gray-900 whitespace-no-wrap text-center relative top-2 ">
                            {index + 1}
                          </p>
                        </td>
                        <td className="text-center px-2 lg:px-2  border border-gray-950  text-sm">
                          <p className="text-gray-900 whitespace-no-wrap relative top-2">
                            {staff.installment}
                          </p>
                        </td>
                        {/* <td className="sm:px-0.5 text-center lg:px-3 py-2 text-center border border-gray-950  text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {staff.birthday}
                          </p>
                        </td> */}
                        <td className="px-2 text-center lg:px-3  border border-gray-950  text-sm">
                          <p className="text-gray-900 whitespace-no-wrap relative top-2">
                            {staff.pending_fee}
                          </p>
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
    </div>
  );
}

export default FeePendingList;
