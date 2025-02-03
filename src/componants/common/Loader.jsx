import React from "react";
import { ThreeCircles } from "react-loader-spinner";

const Loader = () => (
  <div className="flex justify-center items-center h-full">
    <ThreeCircles
      visible={true}
      height="50"
      width="50"
      // color="#A04997"
      innerCircleColor="#974F9D"
      outerCircleColor="#C03078"
      middleCircleColor="#2392EE"
      // colors={["#FF69B4", "#0000FF", "#FF0000"]}
      ariaLabel="three-circles-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  </div>
);

export default Loader;

// import React from "react";
// import { Oval } from "react-loader-spinner";

// const Loader = () => (
//   <div className="flex justify-center items-center h-full relative">
//     {/* Pink Circle */}
//     <div className="absolute">
//       <Oval
//         visible={true}
//         height={100}
//         width={100}
//         color="#FF69B4"
//         ariaLabel="pink-circle-loading"
//       />
//     </div>

//     {/* Blue Circle */}
//     <div className="absolute">
//       <Oval
//         visible={true}
//         height={80}
//         width={80}
//         color="#0000FF"
//         ariaLabel="blue-circle-loading"
//       />
//     </div>

//     {/* Red Circle */}
//     <div className="absolute">
//       <Oval
//         visible={true}
//         height={60}
//         width={60}
//         color="#FF0000"
//         ariaLabel="red-circle-loading"
//       />
//     </div>
//   </div>
// );

// export default Loader;
