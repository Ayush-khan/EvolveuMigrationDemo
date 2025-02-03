// // src/components/Dropdown.jsx
// import React, { useState } from "react";

// const Dropdown = ({ item, navigate }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleDropdown = () => setIsOpen(!isOpen);

//   return (
//     <div className="relative">
//       <button
//         onClick={toggleDropdown}
//         className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600"
//       >
//         {item.name}
//       </button>
//       {isOpen && item.sub_menus && (
//         <div className="absolute left-0 mt-2 bg-white border border-gray-200 shadow-lg">
//           {item.sub_menus.map((subItem) =>
//             subItem.sub_menus && subItem.sub_menus.length > 0 ? (
//               <Dropdown
//                 key={subItem.menu_id}
//                 item={subItem}
//                 navigate={navigate}
//               />
//             ) : (
//               <a
//                 key={subItem.menu_id}
//                 href={subItem.url || "#"}
//                 className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
//                 onClick={() => subItem.url && navigate(subItem.url)}
//               >
//                 {subItem.name}
//               </a>
//             )
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dropdown;

// src/components/Dropdown.jsx
import React from "react";
import { Dropdown } from "rsuite";
import "rsuite/dist/rsuite.min.css"; // Ensure you import rsuite styles

const DropdownMenu = ({ items, onSelect }) => {
  const renderMenuItems = (items) => {
    return items.map((item) => (
      <Dropdown.Item
        key={item.menu_id}
        onClick={() => item.url && onSelect(item.url)}
        className="dropdown-item"
      >
        {item.name}
        {item.sub_menus && item.sub_menus.length > 0 && (
          <Dropdown.Menu className="sub-dropdown">
            {renderMenuItems(item.sub_menus)}
          </Dropdown.Menu>
        )}
      </Dropdown.Item>
    ));
  };

  return (
    <Dropdown.Menu className="custom-dropdown">
      {renderMenuItems(items)}
    </Dropdown.Menu>
  );
};

export default DropdownMenu;
