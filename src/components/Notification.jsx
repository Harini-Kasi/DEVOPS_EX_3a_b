import { useNotification } from "../context/NotificationContext";

export default function Notification() {
  const { notification } = useNotification();
  const { visible, type, message } = notification;

  const classes = ["notification"];
  if (!visible) classes.push("hidden");
  if (type) classes.push(type);

  return (
    <div className={classes.join(" ")}>
      <span className="notification-icon">{type === "success" ? "✓" : "⚠"}</span>
      <span className="notification-text">{message}</span>
    </div>
  );
}
