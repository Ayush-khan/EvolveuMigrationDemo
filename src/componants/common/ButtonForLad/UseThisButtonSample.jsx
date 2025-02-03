// YourFormComponent.js
import React, { useState } from "react";
import axios from "axios";
import ButtonLoading from "./ButtonLoading";
import { toast } from "react-toastify";

const YourFormComponent = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation logic...
    setLoading(true); // Start loading

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token is found");
      }

      // Make the API call and download the PDF
      const response = await axios.post(
        `${API_URL}/api/save_pdfbonafide`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        toast.success("Student information updated successfully!");

        // Initiate PDF download
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "BonafideCertificate.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while updating the Student information.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Other form fields */}
      <div className="text-right">
        <ButtonLoading
          onSubmit={handleSubmit}
          loading={loading}
          buttonText="Update"
        />
      </div>
    </form>
  );
};

export default YourFormComponent;
