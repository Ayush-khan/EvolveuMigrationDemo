// This is the
import styles from "../CSS/Notification.module.css";

export default function NotificationsPanel() {
  return (
    <div className={`${styles.notification} `}>
      <h6 className={styles.notificationHeading}>General Instructions:</h6>
      <ul className={styles.list}>
        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit.</li>
        <li>
          Molestiae enim laborum soluta aperiam repellat ullam temporibus illum
          modi provident natus nostrum expedita, blanditiis recusandae debitis
          at architecto cupiditate non perspiciatis fugit.
        </li>
        <li>
          Laborum, repellendus dolorum inventore omnis hic ipsam quos suscipit
          totam.
        </li>
        <li>
          Excepturi in ut alias aspernatur dicta expedita recusandae nobis eaque
          voluptates esse minus officia cum quisquam culpa, sed, totam iusto
          nulla nesciunt deserunt dolorum!
        </li>
        <li>
          Sequi, ut? Fuga obcaecati quia quo voluptatem nam impedit adipisci non
          sequi in quisquam, ipsam, cumque culpa cum!
        </li>
        <li>
          Explicabo eum nobis quisquam atque adipisci illum, commodi aliquam
          omnis, maiores soluta exercitationem, minus optio voluptate. Tenetur?
        </li>
      </ul>
    </div>
  );
}
