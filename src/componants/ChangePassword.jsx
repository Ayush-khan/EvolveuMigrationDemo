import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../Layouts/NavBar";
import { RiCloseLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./common/LoadingSpinner";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reEnterNewPassword, setReEnterNewPassword] = useState("");
  const [motherName, setMotherName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const validate = () => {
    const errors = {};
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/;
    if (!currentPassword)
      errors.currentPassword = "Current password is required";
    if (!newPassword) errors.newPassword = "New password is required";
    else if (!passwordRegex.test(newPassword))
      errors.newPassword =
        "Password must be 8 to 20 characters long, contain a number and a special character (!, @, #, $, ^, &, *)";
    if (!reEnterNewPassword)
      errors.reEnterNewPassword = "Re-enter new password is required";
    if (!motherName) errors.motherName = "Mother's name is required";
    if (newPassword !== reEnterNewPassword)
      errors.reEnterNewPassword = "New passwords do not match";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(
        `${API_URL}/api/update_password`,
        {
          answer_one: motherName,
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: reEnterNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Your password is updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setReEnterNewPassword("");
        setMotherName("");
        setErrors({});
      } else {
        if (response.data.field) {
          setErrors({ [response.data.field]: response.data.message });
        } else {
          toast.error(response.data.message || "Error updating password");
        }
      }
    } catch (error) {
      toast.error(error.response?.data.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <div
      className=""
      style={{
        height: "100vh",
        background: "linear-gradient(to bottom, #E91E63, #2196F3)",
      }}
    > */}
      {/* <NavBar /> */}
      {/* {loading && <LoadingSpinner />} */}
      <div className="sm:container lg:w-[45%] lg:h-auto box-border mx-auto p-4 pt-6 mt-10 lg:mt-2 mb-4 bg-white">
        <div className="card-header flex justify-between items-center">
          <h1 className="text-lg text-gray-500 font-bold mb-4">
            Change Password
          </h1>
          <RiCloseLine
            className="float-end relative -top-7 -right-4 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
            onClick={() => {
              navigate("/dashboard");
            }}
          />
        </div>
        <form onSubmit={handleSubmit} className=" ">
          <div className="flex flex-col mb-2">
            <label className=" text-sm mb-1" htmlFor="mother-name">
              What is your mother's name?
            </label>
            <input
              type="text"
              id="mother-name"
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              className=" hover:outline-none outline-offset-2 outline-1 border-none shadow-inner bg-gray-100 p-2 pl-10 text-sm mb-2 text-gray-700"
            />
            {errors.motherName && (
              <p className="text-red-500 text-xs -mb-2 -mt-2">
                {errors.motherName}
              </p>
            )}
          </div>
          <div className="flex flex-col mb-2">
            <label className=" text-sm mb-1" htmlFor="current-password">
              Current password
            </label>
            <input
              type="password"
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className=" hover:outline-none outline-offset-2 outline-1 border-none shadow-inner bg-gray-100 p-2 pl-10 text-sm mb-2 text-gray-700"
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-xs -mb-2 -mt-2">
                {errors.currentPassword}
              </p>
            )}
          </div>
          <div className="flex flex-col mb-2">
            <label className=" text-sm mb-1" htmlFor="new-password">
              New password
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className=" hover:outline-none outline-offset-2 outline-1 border-none shadow-inner bg-gray-100 p-2 pl-10 text-sm mb-2 text-gray-700"
            />
          </div>{" "}
          {errors.newPassword && (
            <p className="text-red-500 text-xs -mb-1 -mt-4">
              {errors.newPassword}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Password must be 8 to 20 characters long, contain a number and a
            special character (!, @, #, $, ^, &, *)
          </p>
          <div className="flex flex-col mb-2">
            <label className=" text-sm mb-1" htmlFor="re-enter-new-password">
              Re-enter new password
            </label>
            <input
              type="password"
              id="re-enter-new-password"
              value={reEnterNewPassword}
              onChange={(e) => setReEnterNewPassword(e.target.value)}
              className=" hover:outline-none outline-offset-2 outline-1 border-none shadow-inner bg-gray-100 p-2 pl-10 text-sm mb-2 text-gray-700"
            />
            {errors.reEnterNewPassword && (
              <p className="text-red-500 text-xs -mb-2 -mt-2">
                {errors.reEnterNewPassword}
              </p>
            )}
          </div>
          <button
            type="submit"
            className=" flex justify-center items-center lg:w-28 relative left-[70%] lg:left-[80%] bg-blue-500 hover:bg-blue-700 text-white text-center font-bold py-2 px-4 rounded mb-2"
          >
            {loading ? <LoadingSpinner /> : "Update"}
          </button>
        </form>
        <ToastContainer />
      </div>
      {/* </div> */}
    </>
  );
}

export default ChangePassword;
