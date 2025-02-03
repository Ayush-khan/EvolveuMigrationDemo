// PaginationAll.js
import React from "react";
import ReactPaginate from "react-paginate";
import "tailwindcss/tailwind.css";

const PaginationAll = ({ pageCount, handlePageClick }) => {
  return (
    <ReactPaginate
      previousLabel={"Previous"}
      nextLabel={"Next"}
      breakLabel={"..."}
      breakClassName={"page-item"}
      breakLinkClassName={"page-link"}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={handlePageClick}
      containerClassName={"pagination flex justify-center space-x-2"}
      pageClassName={"page-item"}
      pageLinkClassName={"page-link px-3 py-2 border rounded"}
      previousClassName={"page-item"}
      previousLinkClassName={"page-link px-3 py-2 border rounded"}
      nextClassName={"page-item"}
      nextLinkClassName={"page-link px-3 py-2 border rounded"}
      activeClassName={"active bg-blue-500 text-white"}
    />
  );
};

export default PaginationAll;
