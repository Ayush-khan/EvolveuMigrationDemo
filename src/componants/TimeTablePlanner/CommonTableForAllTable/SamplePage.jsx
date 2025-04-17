import CommonTable from "./CommonTableForTableOnly";

const SamplePage = () => {
  const headers = [
    "Sr No. ",
    "Period",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const data = [
    ["1", "John Doe", "30", "IT"],
    ["2", "Jane Smith", "25", "HR"],
    ["3", "Alice Johnson", "28", "Finance"],
  ];

  const handleSave = () => {
    console.log("Save button clicked");
  };

  return (
    <div className="">
      <CommonTable
        title="Time Table Planner"
        headers={headers}
        data={data}
        onSubmit={handleSave}
      />
    </div>
  );
};

export default SamplePage;
