import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable/DataTable"; // Adjust the import path as needed
import API_URLS from "../../utils/api";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import dayjs from "dayjs";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState("");
  const { getItem } = useSessionStorage();

  const fetchMessages = async () => {};

  useEffect(() => {
    fetch(API_URLS.MESSAGES, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((newData) => {
        const formattedData = newData.map((notification) => ({
          ...notification,
          creationTime: dayjs(notification.creationTime)
            .format("DD-MM-YYYY HH:mm:ss")
            .toLocaleString("sr-RS", {
              timeZone: "Europe/Belgrade",
            }),
        }));
        setNotifications(formattedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleAddNotification = () => {
    if (newNotification.trim()) {
      // Function to add 2 hours to the current date and return ISO string
      const addTwoHoursUsingSetHours = (date) => {
        date.setHours(date.getHours() + 2);
        return date.toISOString();
      };

      const messageBody = {
        content: newNotification.trim(),
        employeeId: Number.parseInt(getItem("id")),
        creationTime: addTwoHoursUsingSetHours(new Date()), // Use the function here
      };

      console.log(JSON.stringify(messageBody));
      fetch(API_URLS.MESSAGES, {
        headers: {
          Authorization: `Bearer ${getItem("token")}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(messageBody),
      })
        .then((response) => response.json())
        .catch((error) => console.error("Error fetching data:", error));
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 0 },
    { field: "content", headerName: "Poruka", flex: 1 },
    { field: "creationTime", headerName: "Datum", width: 200 },
    { field: "employeeUsername", headerName: "Kreirao", width: 120 },
  ];

  const sortModel = [
    {
      field: "creationTime",
      sort: "asc",
    },
  ];

  return (
    <div className="flex justify-between p-4">
      {/* Left Div: Add New Notification */}
      <div className="flex flex-col w-1/3 p-4 border-r border-gray-300">
        <h2 className="text-xl font-bold mb-4">Add New Notification</h2>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="notification"
        >
          Notification Text
        </label>
        <textarea
          id="notification"
          className="w-full px-3 py-2 mb-4 text-gray-700 border rounded-lg focus:outline-none"
          value={newNotification}
          onChange={(e) => setNewNotification(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleAddNotification}
        >
          Add Notification
        </button>
      </div>

      {/* Right Div: Notifications Table */}
      <div className="flex flex-col w-2/3 p-4">
        <h2 className="text-xl font-bold mb-4">Recent Notifications</h2>
        <DataTable
          columns={columns}
          rows={notifications}
          initialState={{
            sorting: {
              sortModel: [{ field: "creationTime", sort: "desc" }],
            },
          }}
          onFilterModelChange={() => {}}
          onRowSelectionModelChange={() => {}}
        />
      </div>
    </div>
  );
};

export default Notification;
