import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";

// Dropdown component
const TestForAllfunctionlity = () => {
  const [classesforForm, setClassesforForm] = useState([]);
  const [studentNameWithClassId, setStudentNameWithClassId] = useState([]);
  const [visibleStudents, setVisibleStudents] = useState([]); // Students to display initially
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [page, setPage] = useState(1); // Pagination page
  const limit = 100; // Number of students to load per page

  useEffect(() => {
    fetchInitialData();
    fetchStudentNameWithClassId(); // Initial fetch without section_id
  }, []);

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const classResponse = await axios.get(
        `${API_URL}/api/getallClassWithStudentCount`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClassesforForm(classResponse.data || []);
    } catch (error) {
      toast.error("Error fetching classes.");
    }
  };

  const fetchStudentNameWithClassId = async (section_id = null, page = 1) => {
    setLoadingStudents(true);
    try {
      const params = { section_id, limit, page };
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/getStudentListBySectionData`,
        { headers: { Authorization: `Bearer ${token}` }, params }
      );

      const newStudents = response?.data?.data || [];
      if (page === 1) {
        setStudentNameWithClassId(newStudents);
        setVisibleStudents(newStudents);
      } else {
        setStudentNameWithClassId((prev) => [...prev, ...newStudents]);
        setVisibleStudents((prev) => [...prev, ...newStudents]);
      }
    } catch (error) {
      toast.error("Error fetching students.");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleClassSelect = (selectedOption) => {
    setSelectedClass(selectedOption);
    setSelectedStudent(null);
    setPage(1);
    fetchStudentNameWithClassId(selectedOption.value, 1); // Fetch students with section_id
  };

  const handleStudentSelect = (selectedOption) => {
    setSelectedStudent(selectedOption);
  };

  // Load more students when scrolling
  const loadMoreStudents = useCallback(() => {
    if (!loadingStudents) {
      setPage((prevPage) => prevPage + 1);
      fetchStudentNameWithClassId(selectedClass?.value, page + 1);
    }
  }, [selectedClass, page, loadingStudents]);

  const studentOptions = useMemo(
    () =>
      visibleStudents.map((stu) => ({
        value: stu.student_id,
        label: `${stu?.first_name} ${stu?.mid_name} ${stu.last_name}`,
      })),
    [visibleStudents]
  );

  return (
    <div>
      <div>
        <label htmlFor="classSelect">Class</label>
        <Select
          id="classSelect"
          value={selectedClass}
          onChange={handleClassSelect}
          options={classesforForm.map((cls) => ({
            value: cls.section_id,
            label: `${cls?.get_class?.name} ${cls.name} (${cls.students_count})`,
          }))}
          placeholder="Select Class"
          isClearable
        />
      </div>

      <div>
        <label htmlFor="studentSelect">Student Name</label>
        <Select
          id="studentSelect"
          value={selectedStudent}
          onChange={handleStudentSelect}
          options={studentOptions}
          placeholder="Select Student"
          isClearable
          onMenuScrollToBottom={loadMoreStudents} // Load more when scrolled to bottom
        />
        {loadingStudents && (
          <div className="loading-indicator">Loading more students...</div>
        )}
      </div>
    </div>
  );
};

export default TestForAllfunctionlity;
