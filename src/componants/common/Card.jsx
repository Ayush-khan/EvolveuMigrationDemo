import styles from "../../CSS/DashbordCss/Card.module.css";
import { FaArrowRightLong } from "react-icons/fa6";
const Card = ({ title, value, color, icon }) => {
  return (
    <div className="w-full bg-white flex items-center justify-around  shadow-card h-28 rounded-lg">
      <div className="flex items-center justify-between flex-col w-1/2 ">
        {icon && (
          <div className={`${styles.icon} text-6xl text-blue-500`}>{icon}</div>
        )}

        <div
          className={styles["card-title"]}
          style={{ fontSize: "12px", fontWeight: "400" }}
        >
          {title}
        </div>
      </div>
      <div className="w-1 h-10 border-l "></div>
      <div
        className={styles["small-desc"]}
        style={{
          width: "50%",
          display: "flex",
          justifyContent: "center",
          fontWeight: "500",
        }}
      >
        {/* <div> {TotalValue} </div> */}
        {value}
      </div>
    </div>
  );
};

export default Card;
