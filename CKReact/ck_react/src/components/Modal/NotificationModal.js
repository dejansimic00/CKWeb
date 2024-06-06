import React, { useEffect } from "react";
import API_URLS from "../../utils/api";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import dayjs from "dayjs";
import theme from "../../styles/colors";

const NotificationModal = ({
  notification,
  onClose,
  setNotification,
  setNotificationRead,
}) => {
  const { getItem } = useSessionStorage();

  useEffect(() => {
    if (notification && !notification.readAt) {
      const URL =
        API_URLS.EMPLOYEES +
        "/" +
        getItem("id") +
        "/messages/" +
        notification.id;

      const messageBody = {
        employee_id: Number.parseInt(getItem("id")),
        message_id: notification.id,
      };

      fetch(URL, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageBody),
      })
        .then((response) => {
          if (response.ok) {
            setNotification({ ...notification, readAt: Date.now() });
            setNotificationRead(notification.id);
          } else {
            console.error("Failed to mark notification as read");
          }
        })
        .catch((err) => console.error("ERROR", err));
    }
  }, [notification]);

  if (!notification) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-white p-4 rounded shadow-lg w-1/2"
        style={{ background: theme.colors.modal_bg }}
      >
        <h2 className="text-xl font-bold mb-4">Detalji obavještenja</h2>

        <p>
          <strong>Kreirao:</strong> {notification.employeeUsername}
        </p>
        <p>
          <strong>Datum:</strong> {notification.creationTime}
        </p>

        <p>
          <strong>Poruka:</strong> {notification.content}
        </p>
        <button
          className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={onClose}
        >
          Zatvori
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
