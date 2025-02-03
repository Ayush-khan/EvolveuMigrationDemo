import styles from "../../CSS/DashbordCss/Card.module.css";
import { FaArrowRightLong } from "react-icons/fa6";
const Card = ({ title, TotalValue, presentValue, color, icon }) => {
  {
    console.log("this is totalValue=", presentValue);
  }
  return (
    <div className="w-full rounded-lg bg-white flex items-center justify-around  shadow-card h-28 ">
      <div className="flex items-center justify-between flex-col w-1/2">
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
        {/* <div
          className="flex align-item-center justify-between text-sm gap-1 flex-col mr-2"
          style={{ fontSize: "12px" }}
        >
          <div>{presentValue ? <span>Present</span> : "value"}</div>
          <div style={{ border: " 1px solid black" }}></div>
          <div>{TotalValue ? <span>Total</span> : "value"}</div>
        </div> */}
        <div
          className="flex align-item-center justify-between text-sm gap-1 flex-col  "
          style={{ fontSize: ".9em" }}
        >
          <div style={{ textAlign: "center" }}>
            {presentValue ? presentValue : "0"}
          </div>
          <div style={{ border: "1px solid gray" }}></div>
          <div style={{ textAlign: "center" }}>
            {TotalValue ? <div>{TotalValue}</div> : "value"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
