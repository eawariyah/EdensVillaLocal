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

let weeksToShow = 1; // Number of weeks to display

document.getElementById("RowsInput").addEventListener("input", (event) => {
  const rows = parseInt(event.target.value);
  if (!isNaN(rows)) {
    weeksToShow = rows;
    generateTable();
    highlightToday();
    EventSection("EV5C10", "2024-11-02T15:31", 5, "Test", "Blue", "White");
  }
});

// Function to get the dates of a specific week
function getWeekDates(startDate, weekOffset = 0) {
  const weekStart = new Date(startDate);
  weekStart.setDate(
    weekStart.getDate() + weekOffset * 7 - weekStart.getDay() + 1
  ); // Adjust to start on Monday
  const weekDates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    // Format the date as "Mon 21 Oct"
    const formattedDate = date.toLocaleDateString("en-GB", {
      weekday: "short", // Short day of the week (Mon, Tue, etc.)
      day: "2-digit", // Day of the month
      month: "short", // Short month name (Jan, Feb, etc.)
    });
    weekDates.push(formattedDate);
  }

  return weekDates;
}

function EventSection(
  roomName,
  startDate,
  endDate,
  text,
  backgroundColor,
  textColor
) {
  // Parse the start and end dates to Date objects
  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);

  // Calculate the duration (number of days) based on the start and end dates
  const colspan = Math.floor(
    (endDateTime - startDateTime) / (1000 * 60 * 60 * 24) + 1
  );

  // Find the room position (row) in the table based on the roomName
  function findRoomPosition(roomName) {
    return rooms.indexOf(roomName);
  }
  const roomIndex = findRoomPosition(roomName);

  if (roomIndex === -1) {
    console.error(`Room "${roomName}" not found.`);
    return; // Exit the function if the room is not found
  }

  // Calculate the target column based on the start date
  function findColumnByDate(startDateTime) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Set to Monday of the current week

    const dayDiff = Math.floor(
      (startDateTime - weekStart) / (1000 * 60 * 60 * 24)
    ); // Difference in days
    if (dayDiff >= 0 && dayDiff < weeksToShow * 7) {
      return dayDiff + 1; // Adjusting to column index (starting after room name column)
    }
    return -1; // Return -1 if the date is out of range
  }
  const columnIndex = findColumnByDate(startDateTime);

  if (columnIndex === -1) {
    console.error(`Date "${startDate}" is out of range.`);
    return; // Exit the function if the date is out of the displayed range
  }

  // Select the target cell in the table
  const table = document.getElementById("scheduleTable");
  const targetRow = table.rows[roomIndex + 2]; // Adjust for header and room rows
  const targetCell = targetRow.cells[columnIndex];

  // Set the colspan for the target cell
  targetCell.colSpan = colspan;

  // Clear cells that are pushed away by the colspan
  for (let i = 1; i < colspan; i++) {
    if (targetCell.nextElementSibling) {
      targetCell.nextElementSibling.remove();
    }
  }

  // Create and style the overlay for the event
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.textContent = text;
  overlay.style.backgroundColor = backgroundColor;
  overlay.style.color = textColor;

  // Append the overlay to the target cell
  targetCell.appendChild(overlay);
}

// Example usage
EventSection(
  "EV5C10",
  "2024-10-26T15:31",
  "2024-11-02T15:31",
  "Test",
  "Blue",
  "White"
);

let currentWeekOffset = 0; // Offset for navigating weeks

document.getElementById("prevWeek").addEventListener("click", () => {
  currentWeekOffset--; // Move one week back
  updateTable();
});

document.getElementById("nextWeek").addEventListener("click", () => {
  currentWeekOffset++; // Move one week forward
  updateTable();
});

// Function to update the table based on the current week offset
function updateTable() {
  generateTable();
  highlightToday();
  EventSection(
    "EV5C10",
    "2024-10-26T15:31",
    "2024-11-02T15:31",
    "Test",
    "Blue",
    "White"
  );
}

// Modified getWeekDates function to include the week offset
function getWeekDates(startDate, weekOffset = 0) {
  const weekStart = new Date(startDate);
  weekStart.setDate(
    weekStart.getDate() +
      (currentWeekOffset + weekOffset) * 7 -
      weekStart.getDay() +
      1
  ); // Adjust to start on Monday
  const weekDates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    const formattedDate = date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
    weekDates.push(formattedDate);
  }

  return weekDates;
}

// Function to generate the table
function generateTable() {
  const table = document.getElementById("scheduleTable");
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");

  // Clear any existing rows before regenerating
  thead.innerHTML = "";
  tbody.innerHTML = "";

  const dateRow = document.createElement("tr");
  const emptyHeader = document.createElement("th"); // Empty cell for the rooms column
  dateRow.appendChild(emptyHeader);

  for (let week = 0; week < weeksToShow; week++) {
    const currentDate = new Date();
    const weekDates = getWeekDates(currentDate, week);

    weekDates.forEach((date) => {
      const dateCell = document.createElement("th");
      dateCell.innerText = date;
      dateRow.appendChild(dateCell);
    });
  }
  thead.appendChild(dateRow);

  rooms.forEach((room) => {
    const row = document.createElement("tr");
    const roomCell = document.createElement("td");
    roomCell.classList.add("room-name");
    roomCell.innerText = room;
    row.appendChild(roomCell);

    for (let week = 0; week < weeksToShow; week++) {
      for (let i = 0; i < 7; i++) {
        const dayCell = document.createElement("td");
        dayCell.innerText = ""; // Placeholder for schedule events if needed
        row.appendChild(dayCell);
      }
    }
    tbody.appendChild(row);
  });
}

// Update the table initially on page load
updateTable();

function highlightToday() {
  const table = document.getElementById("scheduleTable");
  const dateHeaders = table.querySelectorAll("thead th"); // Select the date headers in the table
  const today = new Date(); // Get today's date

  // Format today's date to match the "Mon 21 Oct" format
  const formattedToday = today.toLocaleDateString("en-GB", {
    weekday: "short", // Short day of the week (Mon, Tue, etc.)
    day: "2-digit", // Day of the month
    month: "short", // Short month name (Jan, Feb, etc.)
  });

  let todayColumnIndex = -1; // Variable to store today's column index

  // Find the column that corresponds to today's date
  for (let i = 0; i < dateHeaders.length; i++) {
    if (dateHeaders[i].innerText === formattedToday) {
      todayColumnIndex = i;
      break;
    }
  }

  // If today's date was found, highlight the column
  if (todayColumnIndex !== -1) {
    // Apply highlight to all rows in today's column
    const rows = table.querySelectorAll("tbody tr"); // Select all rows in the table

    rows.forEach((row) => {
      const cell = row.cells[todayColumnIndex]; // Get the cell in today's column
      cell.style.backgroundColor = "#2a2d31"; // Highlight the cell (e.g., yellow background)
      cell.style.color = "#2a2d31"; // Highlight the cell (e.g., yellow background)
      cell.style.border = "3px solid #479ef5";
    });

    // Also highlight the date header for today
    dateHeaders[todayColumnIndex].style.backgroundColor = "#2a2d31";
    dateHeaders[todayColumnIndex].style.border = "3px solid #479ef5";
  } else {
    console.error("Today's date not found in the schedule");
  }
}

generateTable();
highlightToday(); // Highlights today's column
EventSection(
  "EV5C10",
  "2024-10-26T15:31",
  "2024-11-02T15:31",
  "Test",
  "Blue",
  "White"
);
