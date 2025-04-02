import React from "react";

const CommonTable = ({ title, headers, data, onSubmit }) => {
  return (
    <div className="relative w-[95%] bg-white shadow-xl rounded-lg border border-pink-500 mx-auto mt-3">
      <div className="overflow-x-auto p-4">
        <div className="p-2 px-3 bg-gray-100 flex justify-between items-center rounded-t-lg">
          <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl">
            {title}
          </h3>
          <button
            className="text-xl text-red-600 hover:cursor-pointer hover:bg-red-100 p-1 rounded"
            onClick={() => window.history.back()} // Navigate back or handle custom logic
          >
            ✕
          </button>
        </div>
        <div
          className="relative w-full h-1 mb-3 mx-auto"
          style={{ backgroundColor: "#C03078" }}
        ></div>

        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead className="bg-gray-200">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="border p-2 font-semibold text-center"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-gray-50">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border border-gray-300 p-2 text-center"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end p-2 relative">
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            onClick={onSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonTable;
