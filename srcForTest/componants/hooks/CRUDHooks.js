import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useCrudOperations = (apiEndpoint) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 10;

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const academicYr = localStorage.getItem("academicYear");

      if (!token || !academicYr) {
        throw new Error("No authentication token or academic year found");
      }

      const response = await axios.get(`${API_URL}${apiEndpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Academic-Year": academicYr,
        },
        withCredentials: true,
      });

      setData(response.data);
      setPageCount(Math.ceil(response.data.length / pageSize));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item, successMessage) => {
    try {
      const token = localStorage.getItem("authToken");
      const academicYr = localStorage.getItem("academicYear");

      if (!token || !academicYr) {
        throw new Error("No authentication token or academic year found");
      }

      await axios.post(`${API_URL}${apiEndpoint}`, item, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Academic-Year": academicYr,
        },
        withCredentials: true,
      });

      fetchData();
      toast.success(successMessage);
    } catch (error) {
      console.error(`Error adding item: ${error}`);
    }
  };

  const updateItem = async (id, item, successMessage) => {
    try {
      const token = localStorage.getItem("authToken");
      const academicYr = localStorage.getItem("academicYear");

      if (!token || !academicYr || !id) {
        throw new Error("ID is missing");
      }

      await axios.put(`${API_URL}${apiEndpoint}/${id}`, item, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Academic-Year": academicYr,
        },
        withCredentials: true,
      });

      fetchData();
      toast.success(successMessage);
    } catch (error) {
      console.error(`Error updating item: ${error}`);
    }
  };

  const deleteItem = async (id, successMessage) => {
    try {
      const token = localStorage.getItem("authToken");
      const academicYr = localStorage.getItem("academicYear");

      if (!token || !academicYr || !id) {
        throw new Error("ID is missing");
      }

      await axios.delete(`${API_URL}${apiEndpoint}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Academic-Year": academicYr,
        },
        withCredentials: true,
      });

      fetchData();
      toast.success(successMessage);
    } catch (error) {
      console.error(`Error deleting item: ${error}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiEndpoint]);

  return {
    data,
    loading,
    error,
    pageCount,
    currentPage,
    setCurrentPage,
    addItem,
    updateItem,
    deleteItem,
  };
};

export default useCrudOperations;
