import axios from "axios";
import { IoIosArrowForward } from "react-icons/io";
// import { RxCross1, RxCrosshair1 } from "react-icons/rx";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import NavBar from "../../Layouts/NavBar";
import { useState, useEffect } from "react";
function TickitingCountList() {
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
        const rollId = localStorage.getItem("roleId");

        // if (!token || !rollId) {
        //   throw new Error("No authentication token or academic year found");
        // }

        if (!token) {
          throw new Error("No authentication token or academic year found");
        }
        const response = await axios.get(`${API_URL}/api/ticketlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Academic-Year": academicYr,
            "Role-Id": rollId,
          },
        });
        console.log("resposne of the birthday list is", response);
        setStaffBirthday(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffBirthday();
  }, []);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;
  // date formate funcions
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = String(date.getFullYear()).slice(-2); // Get the last two digits of the year

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return { formattedDate, formattedTime };
  }
  return (
    <>
      {/* <div
      className="  "
      style={{
        height: "100vh",
        background: "   linear-gradient(to bottom, #E91E63, #2196F3)",
      }}
    > */}
      {/* <NavBar /> */}
      <div className="container mt-4 ">
        <div className="  card mx-auto lg:w-3/4  shadow-lg ">
          {/* <div className="card mx-auto w-3/4"> */}
          <div className="card-header flex justify-between items-center">
            <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
              Ticketing List
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
            <div className=" h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden ">
              <div className="bg-white rounded-lg  shadow-xs ">
                <table className="min-w-full leading-normal table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-0.5 lg:px-1 py-2 text-center  border border-gray-950 text-sm font-semibold text-gray-900  tracking-wider">
                        S.No
                      </th>
                      <th className=" px-0.5 lg:px-2 py-2 text-center  border border-gray-950 text-sm font-semibold text-gray-900  tracking-wider">
                        Name
                      </th>
                      {/* <th className="lg:px-2 py-2 text-center border border-gray-950 text-sm font-semibold text-gray-900  tracking-wider">
                        Date Of Birth
                      </th> */}
                      <th className=" px-0.5 lg:px-3 py-2 text-center border border-gray-950 text-sm font-semibold text-gray-900  tracking-wider">
                        Title
                      </th>
                      <th className="px-0.5 lg:px-3 py-2 border text-center border-gray-950 text-sm font-semibold text-gray-900  tracking-wider">
                        Rised On
                      </th>
                      <th className=" px-0.5 lg:px-4 py-2 border text-start border-gray-950 text-sm font-semibold text-gray-900  tracking-wider">
                        Discription
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
                      staffBirthday.map((staff, index) => {
                        const { formattedDate, formattedTime } = formatDate(
                          staff.raised_on
                        );
                        return (
                          <tr
                            key={staff.teacher_id}
                            className={`${
                              index % 2 === 0 ? "bg-white" : "bg-gray-100"
                            } hover:bg-gray-50  `}
                          >
                            <td className="px-0.5 lg:px-1 text-center  border  border-gray-950   text-sm">
                              <p className="text-gray-900 whitespace-no-wrap text-center relative top-2 ">
                                {index + 1}
                              </p>
                            </td>

                            <td className="px-0.5 lg:px-2  border border-gray-950  text-sm ">
                              <p
                                className="text-gray-900 whitespace-no-wrap  relative top-2"
                                style={{ textTransform: "capitalize" }}
                              >
                                {staff.first_name.charAt(0).toUpperCase() +
                                  staff.first_name.slice(1).toLowerCase()}{" "}
                                {staff.mid_name.charAt(0).toUpperCase() +
                                  staff.mid_name.slice(1).toLowerCase()}
                                {staff.last_name.charAt(0).toUpperCase() +
                                  staff.last_name.slice(1).toLowerCase()}
                                {/* {staff.last_name.slice(0).toLowerCase()} */}
                              </p>
                            </td>
                            {/* <td className="lg:px-3 py-2 text-center border border-gray-950  text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {staff.birthday}
                          </p>
                        </td> */}
                            <td className="px-0.5 lg:px-3  text-start border border-gray-950  text-sm">
                              <p className="text-gray-900 whitespace-no-wrap relative top-2">
                                {staff.title}
                              </p>
                            </td>
                            <td className="px-0.5 lg:px-3 text-center border border-gray-950   text-sm">
                              <p className="text-gray-900 whitespace-no-wrap relative top-2">
                                {formattedDate}{" "}
                                <span className=" font-semibold text-blue-500 ">
                                  {formattedTime}
                                </span>
                                {/* {staff.description} */}
                              </p>
                            </td>
                            <td className="px-0.5 lg:px-4  border border-gray-950  text-sm">
                              <p className="text-gray-900 whitespace-no-wrap relative top-2">
                                {staff.description}
                              </p>
                            </td>
                          </tr>
                        );
                      })
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
      {/* </div> */}
    </>
  );
}

export default TickitingCountList;
