import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable/DataTable"; // Adjust the import path as needed
import API_URLS from "../../utils/api";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import dayjs from "dayjs";
import NotificationModal from "../../components/Modal/NotificationModal"; // Adjust the import path as needed

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState("");
  const { getItem } = useSessionStorage();
  const [refresh, setRefresh] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [notificationModal, setNotificationModal] = useState(false);

  const fetchMessages = async () => {
    const URL = API_URLS.EMPLOYEES + "/" + getItem("id") + "/messages";
    try {
      const response = await fetch(URL, {
        headers: {
          Authorization: `Bearer ${getItem("token")}`,
        },
      });
      const data = await response.json();
      const formattedData = data.map((item) => ({
        ...item.message,
        creationTime: dayjs(item.message.creationTime).format(
          "DD-MM-YYYY HH:mm:ss"
        ),
        readAt: item.readAt
          ? dayjs(item.readAt).format("DD-MM-YYYY HH:mm:ss")
          : null,
      }));
      setNotifications(formattedData);
    } catch (error) {
      console.error(
        "Greška pri dohvatanju podataka o pročitanim porukama:",
        error
      );
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [refresh]);

  const readNotification = () => {};

  const handleAddNotification = async () => {
    if (newNotification.trim()) {
      const addTwoHoursUsingSetHours = (date) => {
        date.setHours(date.getHours() + 2);
        return date.toISOString();
      };

      const messageBody = {
        content: newNotification.trim(),
        employeeId: Number.parseInt(getItem("id")),
        creationTime: addTwoHoursUsingSetHours(new Date()),
      };

      try {
        await fetch(API_URLS.MESSAGES, {
          headers: {
            Authorization: `Bearer ${getItem("token")}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(messageBody),
        });
        setRefresh(!refresh);
        setNewNotification("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 0 },
    { field: "content", headerName: "Poruka", flex: 1 },
    {
      field: "creationTime",
      headerName: "Datum",
      width: 180,
    },
    { field: "employeeUsername", headerName: "Kreirao", width: 120 },
  ];

  const handleRowSelection = (selected) => {
    const row = notifications.find((row) => row.id === selected[0]);
    setSelectedRow(row);
    setNotificationModal(true);
  };

  const setNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, readAt: dayjs().format("DD-MM-YYYY HH:mm:ss") }
          : notification
      )
    );
  };

  return (
    <div className="flex justify-between p-4">
      <div className="flex flex-col w-1/3 p-4 border-r border-gray-300">
        <h2 className="text-xl font-bold mb-4">Novo obavještenje</h2>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="notification"
        >
          Sadržaj obavještenja:
        </label>
        <textarea
          id="notification"
          className="w-full h-[39rem] px-3 py-2 mb-4 text-gray-700 border rounded-lg focus:outline-none"
          value={newNotification}
          onChange={(e) => setNewNotification(e.target.value)}
        />
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleAddNotification}
        >
          Pošalji
        </button>
      </div>

      <div className="flex flex-col w-2/3 p-4 ">
        <h2 className="text-xl font-bold mb-11">Najnovija obavještenja</h2>

        <DataTable
          columns={columns}
          rows={notifications}
          getRowClassName={(params) => (!params.row.readAt ? "font-bold " : "")}
          initialState={{
            sorting: {
              sortModel: [{ field: "creationTime", sort: "desc" }],
            },
          }}
          onFilterModelChange={() => {}}
          onRowSelectionModelChange={(newSelection) => {
            handleRowSelection(newSelection);
          }}
        />
      </div>

      {notificationModal && (
        <NotificationModal
          notification={selectedRow}
          setNotification={setSelectedRow}
          onClose={() => setNotificationModal(false)}
          setNotificationRead={setNotificationRead}
        />
      )}
    </div>
  );
};

export default Notification;
