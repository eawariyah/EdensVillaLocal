const CloseButton = document.getElementById("close");
CloseButton.addEventListener("click", () => {
  window.history.back();
});

const RoomType = [
  "Deluxe Suite",
  "Deluxe Suite",
  "Family Suite",
  "Family Suite",
  "Standard Suite",
  "Standard Suite",
  "Deluxe Suite",
  "Deluxe Suite",
  "Family Suite",
  "Family Suite",
  "Standard Suite",
  "Standard Suite",
  "Deluxe Suite",
  "Deluxe Suite",
  "Family Suite",
  "Family Suite",
  "Standard Suite",
  "Standard Suite",
  "Deluxe Suite",
  "Deluxe Suite",
  "Family Suite",
  "Family Suite",
  "Standard Suite",
  "Standard Suite",
  "Deluxe Suite",
  "Deluxe Suite",
  "Executive Suite",
  "Executive Suite",
  "Standard Suite",
  "Standard Suite",
];

const rooms = [
  "EV5C10",
  "EV5D10",
  "EV5A05",
  "EV5B05",
  "EV5C09",
  "EV5D09",
  "EV4C08",
  "EV4D08",
  "EV4A04",
  "EV4B04",
  "EV4C07",
  "EV4D07",
  "EV3C06",
  "EV3D06",
  "EV3A03",
  "EV3B03",
  "EV3C05",
  "EV3D05",
  "EV2D04",
  "EV2C04",
  "EV2A02",
  "EV2B02",
  "EV2C03",
  "EV2D03",
  "EV1D02",
  "EV1C02",
  "EV1A01",
  "EV1B01",
  "EV1C01",
  "EV1D01",
];

// Initialize the RoomStatusRealTime object
const RoomStatusRealTime = {};

// Function to fetch real-time room status

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let currentWeekOffset = 0;
let weeksToShow = 1;
const firebaseConfig = {
  apiKey: "AIzaSyAgXyyibV7I04EzHE_nhxdWGAOKaYWGp0E",
  authDomain: "fruitripenessdetectionsystem.firebaseapp.com",
  databaseURL:
    "https://fruitripenessdetectionsystem-default-rtdb.firebaseio.com",
  projectId: "fruitripenessdetectionsystem",
  storageBucket: "fruitripenessdetectionsystem.appspot.com",
  messagingSenderId: "103968652296",
  appId: "1:103968652296:web:79a1bfc1495062779165bd",
  measurementId: "G-7HR89GF4K9",
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function fetchRoomStatusRealTime(callback) {
  database
    .ref("rooms")
    .once("value")
    .then((snapshot) => {
      const roomsData = snapshot.val(); // Get all room data

      // Clear existing RoomStatusRealTime data
      for (const key in RoomStatusRealTime) {
        delete RoomStatusRealTime[key];
      }

      // Populate RoomStatusRealTime with roomName and Status
      for (const roomId in roomsData) {
        const room = roomsData[roomId];
        RoomStatusRealTime[room.roomName] = room.Status; // Add to RoomStatusRealTime
      }

      console.log("RoomStatusRealTime updated:", RoomStatusRealTime);

      // Execute the callback if provided
      if (callback) callback();
    })
    .catch((error) => {
      console.error("Error fetching room status:", error);
    });
}

function updateWeeksToShow() {
  const weekCount = document.getElementById("week-count").value;
  weeksToShow = parseInt(weekCount);
  renderCalendar();
}

function changeWeek(offset) {
  currentWeekOffset += offset;
  renderCalendar();
}

function renderCalendar() {
  const container = document.getElementById("calendar-container");
  container.innerHTML = "";

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() + currentWeekOffset * 7);

  for (let w = 0; w < weeksToShow; w++) {
    const table = document.createElement("table");
    const headerRow = document.createElement("tr");

    const roomHeader = document.createElement("th");
    roomHeader.textContent = "Rooms (Room Type)";
    headerRow.appendChild(roomHeader);

    for (let i = 0; i < 7; i++) {
      const dayHeader = document.createElement("th");
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + w * 7 + i);
      const day = weekDays[date.getDay()];
      const dateStr = `${day}, ${date.getDate()} ${date.toLocaleString(
        "default",
        { month: "short" }
      )}`;

      dayHeader.textContent = dateStr;
      if (isToday(date)) {
        dayHeader.classList.add("today");
      }

      headerRow.appendChild(dayHeader);
    }
    table.appendChild(headerRow);

    rooms.forEach((room, index) => {
      const row = document.createElement("tr");
      const roomCell = document.createElement("td");

      // Display room with its type
      roomCell.textContent = `${room} (${RoomType[index]})`;

      // Set background color based on RoomStatusRealTime
      const status = RoomStatusRealTime[room];
      if (status === "Unavailable") {
        roomCell.style.backgroundColor = "red";
        roomCell.style.color = "white";
      } else if (status === "Available") {
        roomCell.style.backgroundColor = "green";
        roomCell.style.color = "white";
      } else if (status === "Cleaning") {
        roomCell.style.backgroundColor = "black";
        roomCell.style.color = "white";
      }

      row.appendChild(roomCell);

      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + w * 7 + i);

        const cell = document.createElement("td");
        cell.dataset.room = room;
        cell.dataset.date = date.toISOString().split("T")[0];

        if (isToday(date)) {
          cell.classList.add("today");
        }
        row.appendChild(cell);
      }

      table.appendChild(row);
    });

    container.appendChild(table);
  }

  database.ref("reservations").once("value", (snapshot) => {
    snapshot.forEach((reservation) => {
      const reservationData = reservation.val();

      EventSection(
        reservationData.roomName,
        reservationData.checkIn,
        reservationData.checkOut,
        reservationData.fullName,
        "blue",
        "white"
      );
    });
  });
  database.ref("RentReservations").once("value", (snapshot) => {
    snapshot.forEach((reservation) => {
      const reservationData = reservation.val();

      EventSection(
        reservationData.roomName,
        reservationData.checkIn,
        reservationData.checkOut,
        reservationData.fullName,
        "#f4b084",
        "black"
      );
    });
  });
}

function isToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function EventSection(
  roomName,
  startDate,
  endDate,
  text,
  backgroundColor,
  textColor
) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startDateString = start.toISOString().split("T")[0];
  const endDateString = end.toISOString().split("T")[0];

  // Debugging logs
  //   console.log(
  //     `Applying event for room ${roomName} from ${startDateString} to ${endDateString}`
  //   );

  const cells = document.querySelectorAll("td");
  cells.forEach((cell) => {
    // Skip cells without `data-room` or `data-date`
    if (!cell.dataset.room || !cell.dataset.date) return;

    const cellRoom = cell.dataset.room;
    const cellDate = cell.dataset.date;

    // // Debugging log for each valid cell
    // console.log(`Checking cell - Room: ${cellRoom}, Date: ${cellDate}`);

    if (
      cellRoom === roomName &&
      cellDate >= startDateString &&
      cellDate <= endDateString
    ) {
      //   console.log(
      //     `Updating cell for room ${cellRoom} on ${cellDate} with text: ${text}`
      //   );
      cell.textContent = text;
      cell.style.backgroundColor = backgroundColor;
      cell.style.color = textColor;
      cell.classList.add("event");
    }
  });
}

fetchRoomStatusRealTime(() => {
  renderCalendar(); // Render calendar after data is fetched
  EventSection(
    "EV5C10",
    "2024-10-26T15:31",
    "2024-11-02T15:31",
    "Mr. Smith",
    "blue",
    "white"
  );
});
