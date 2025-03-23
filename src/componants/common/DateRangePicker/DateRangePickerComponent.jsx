import React, { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import { DateRange } from "react-date-range";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
} from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const DateRangePickerComponent = ({ onDateChange }) => {
  const today = new Date();
  const formattedToday = format(today, "yyyy-MM-dd");

  const [showPicker, setShowPicker] = useState(false);
  const [dateRange, setDateRange] = useState([
    { startDate: today, endDate: today, key: "selection" },
  ]);

  const [tempDateRange, setTempDateRange] = useState(dateRange);
  const [selectedPreset, setSelectedPreset] = useState("Today");

  const presetOptions = [
    {
      label: "Today",
      // range: [today, today]
    },
    {
      label: "Yesterday",
      //   range: [new Date(today.setDate(today.getDate() - 1)), new Date(today)],
    },
    { label: "This Week", range: [startOfWeek(today), endOfWeek(today)] },
    {
      label: "This Month",
      //   range: [new Date(today.getFullYear(), today.getMonth(), 1), today],
    },
    {
      label: "Last Month",
      //   range: [
      //     new Date(today.getFullYear(), today.getMonth() - 1, 1),
      //     new Date(today.getFullYear(), today.getMonth(), 0),
      //   ],
    },
    {
      label: "This Quarter",
      //   range: [startOfQuarter(today), endOfQuarter(today)],
    },
    {
      label: "This Half Year",
      //   range: [
      //     new Date(today.getFullYear(), today.getMonth() < 6 ? 0 : 6, 1),
      //     new Date(today.getFullYear(), today.getMonth() < 6 ? 5 : 11, 30),
      //   ],
    },
    {
      label: "This Year",
      // range: [startOfYear(today), endOfYear(today)]
    },
    { label: "Custom Range", range: null },
  ];

  useEffect(() => {
    onDateChange(formattedToday, formattedToday);
  }, []);

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset.label);

    if (preset.label === "Custom Range") {
      setTempDateRange(dateRange);
    } else {
      setTempDateRange([
        {
          startDate: preset.range[0],
          endDate: preset.range[1],
          key: "selection",
        },
      ]);
    }
  };

  const handleApply = () => {
    const searchFrom = format(tempDateRange[0].startDate, "yyyy-MM-dd");
    const searchTo = format(tempDateRange[0].endDate, "yyyy-MM-dd");

    setDateRange(tempDateRange);
    onDateChange(searchFrom, searchTo);
    setShowPicker(false);
  };

  const formatDate = (date) => format(date, "MMMM d, yyyy");

  return (
    <div className="relative ">
      <div
        className="border border-gray-300 rounded-lg px-4 py-2 cursor-pointer shadow-md bg-white flex items-center gap-2 hover:ring-2 hover:ring-blue-500 transition-all duration-200"
        onClick={() => setShowPicker(!showPicker)}
      >
        <span className="text-gray-500 font-medium">📅</span>
        <span className="text-gray-800">
          {`${formatDate(dateRange[0]?.startDate)} - ${formatDate(
            dateRange[0]?.endDate
          )}`}
        </span>
      </div>

      {showPicker && (
        <div className="absolute top-12 text-black left-0 bg-white border border-gray-300 rounded-lg shadow-lg z-1 w-full md:w-[70%]">
          <div className="flex flex-col p-3 gap-2">
            {presetOptions.map((preset, index) => (
              <button
                key={index}
                className={`px-3 py-1 text-md rounded-md transition-all duration-300 ${
                  selectedPreset === preset.label
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-blue-100 hover:text-blue-500 hover:font-medium"
                }`}
                onClick={() => handlePresetSelect(preset)}
              >
                {preset.label}
              </button>
            ))}
          </div>
          {selectedPreset === "Custom Range" && (
            <div
              className="
            absolute top-0 left-full 
            bg-white border border-gray-300 rounded-lg shadow-md 
            w-0  
            [&_.rdrDay]:!bg-transparent 
            [&_.rdrDay]:!shadow-none 
            [&_.rdrDayHovered]:!bg-transparent 
            [&_.rdrDayHovered]:!shadow-none
          "
            >
              <DateRange
                onChange={(item) => setTempDateRange([item.selection])}
                // ranges={tempDateRange}
                moveRangeOnFirstSelection={false}
                editableDateInputs={true}
                showSelectionPreview={true}
              />
              {/* With custom inputs of today this weak last weak this month last month */}
              {/* <DateRangePicker
                onChange={(item) => setTempDateRange([item.selection])}
                // ranges={tempDateRange}
                moveRangeOnFirstSelection={false}
                editableDateInputs={true}
                showSelectionPreview={true}
                // staticRanges={[]} // Removes predefined ranges like 'Today', 'Yesterday', etc.
                // inputRanges={[]} // Removes custom input ranges
              /> */}
            </div>
          )}
          {/* {selectedPreset === "Custom Range" && (
            <div className="[&_.rdrDay]:!bg-transparent [&_.rdrDay]:!shadow-none [&_.rdrDayHovered]:!bg-transparent [&_.rdrDayHovered]:!shadow-none">
              <DateRangePicker
                onChange={(item) => setTempDateRange([item.selection])}
                ranges={tempDateRange}
                moveRangeOnFirstSelection={false}
                editableDateInputs={true}
              />
            </div>
          )} */}

          <div className="flex justify-end p-2 border-t border-gray-200 gap-2">
            <button
              className="bg-green-400 text-white px-4 py-2 rounded-md hover:bg-green-500 font-medium"
              onClick={handleApply}
            >
              Apply
            </button>
            <button
              className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-red-500 font-medium "
              onClick={() => setShowPicker(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePickerComponent;
