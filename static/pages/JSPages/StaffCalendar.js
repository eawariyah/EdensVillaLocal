var Staff = ["Blessing", "Fadilatu"];
const RoomsDB = [
  "EV4A04",
  "EV4B04",
  "EV4C07",
  "EV4C08",
  "EV4D07",
  "EV4D08",
  "EV5A05",
  "EV5B05",
  "EV5C09",
  "EV5C10",
  "EV5D09",
  "EV5D10",
];

var RoomServiceRooms = [
  "EV4A04",
  "EV4B04",
  "EV4C07",
  "EV4C08",
  "EV4D07",
  "EV4D08",
];
var RoomTasks = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

let currentIndex = 0; // Keeps track of room assignment for each day

function AssignJob(day) {
  // Fill RoomTasks for each day with up to 6 rooms
  if (RoomTasks[day].length === 0 && currentIndex < RoomsDB.length) {
    for (let i = 0; i < 6 && currentIndex < RoomsDB.length; i++) {
      RoomTasks[day].push(RoomsDB[currentIndex]);
      currentIndex++;
    }
  }

  // Retrieve and return the next room for the specified day
  return RoomTasks[day].shift() || "No more rooms"; // If no more rooms, return message
}
const scheduleData = [
  {
    time: `8:00 - 8:30`,
    Monday: `Arrival Time`,
    Tuesday: `Arrival Time`,
    Wednesday: `Arrival Time`,
    Thursday: `Arrival Time`,
    Friday: `Arrival Time`,
    Saturday: `Arrival Time`,
    Sunday: `Arrival Time`,
  },
  {
    time: `8:30 - 9:30`,
    Monday: `Staff 1: ${AssignJob("Monday")}`,
    Tuesday: `Staff 1: ${AssignJob("Tuesday")}`,
    Wednesday: `Staff 1: ${AssignJob("Wednesday")}`,
    Wednesday: `Staff 1: ${AssignJob("Thursday")}`,
    Friday: `Staff 1: ${AssignJob("Friday")}`,
    Saturday: `Staff 1: ${AssignJob("Saturday")}`,
    Sunday: `Staff 2: ${AssignJob("Sunday")}`,
  },
  {
    time: ``,
    Monday: `Staff 2: ${AssignJob("Monday")}`,
    Tuesday: `Staff 2: ${AssignJob("Tuesday")}`,
    Wednesday: `Staff 2: ${AssignJob("Wednesday")}`,
    Thursday: `Staff 2: ${AssignJob("Thursday")}`,
    Friday: `Staff 2: ${AssignJob("Friday")}`,
    Saturday: `Staff 1: ${AssignJob("Saturday")}`,
    Sunday: `Staff 2: ${AssignJob("Sunday")}`,
  },
  {
    time: `9:30 - 10:30`,
    Monday: `Breakfast Break`,
    Tuesday: `Breakfast Break`,
    Wednesday: `Breakfast Break`,
    Thursday: `Breakfast Break`,
    Friday: `Breakfast Break`,
    Saturday: `Breakfast Break`,
    Sunday: `Breakfast Break`,
  },
  {
    time: `10:30 - 11:30`,
    Monday: `Staff 1: ${AssignJob("Monday")}`,
    Tuesday: `Staff 1: ${AssignJob("Tuesday")}`,
    Wednesday: `Staff 1: ${AssignJob("Wednesday")}`,
    Wednesday: `Staff 1: ${AssignJob("Thursday")}`,
    Friday: `Staff 1: ${AssignJob("Friday")}`,
    Saturday: `Staff 1: ${AssignJob("Saturday")}`,
    Sunday: `Staff 2: ${AssignJob("Sunday")}`,
  },
  {
    time: ``,
    Monday: `Staff 2: ${AssignJob("Monday")}`,
    Tuesday: `Staff 2: ${AssignJob("Tuesday")}`,
    Wednesday: `Staff 2: ${AssignJob("Wednesday")}`,
    Thursday: `Staff 2: ${AssignJob("Thursday")}`,
    Friday: `Staff 2: ${AssignJob("Friday")}`,
    Saturday: `Staff 1: ${AssignJob("Saturday")}`,
    Sunday: `Staff 2: ${AssignJob("Sunday")}`,
  },
  {
    time: `11:30 - 12:30`,
    Monday: `Staff 1: ${AssignJob("Monday")}`,
    Tuesday: `Staff 1: ${AssignJob("Tuesday")}`,
    Wednesday: `Staff 1: ${AssignJob("Wednesday")}`,
    Wednesday: `Staff 1: ${AssignJob("Thursday")}`,
    Friday: `Staff 1: ${AssignJob("Friday")}`,
    Saturday: ``,
    Sunday: ``,
  },
  {
    time: ``,
    Monday: `Staff 2: ${AssignJob("Monday")}`,
    Tuesday: `Staff 2: ${AssignJob("Tuesday")}`,
    Wednesday: `Staff 2: ${AssignJob("Wednesday")}`,
    Thursday: `Staff 2: ${AssignJob("Thursday")}`,
    Friday: `Staff 2: ${AssignJob("Friday")}`,
    Saturday: ``,
    Sunday: ``,
  },
  {
    time: `12:30 - 2:00`,
    Monday: `Lunch Break`,
    Tuesday: `Lunch Break`,
    Wednesday: `Lunch Break`,
    Thursday: `Lunch Break`,
    Friday: `Lunch Break`,
    Saturday: `Lunch Break`,
    Sunday: `Lunch Break`,
  },
  {
    time: `2:00 - 3:00`,
    Monday: `Staff 1: Room Service`,
    Tuesday: `Staff 1: Room Service`,
    Wednesday: `Staff 1: Room Service`,
    Thursday: `Staff 1: Room Service`,
    Friday: `Staff 1: Room Service`,
    Saturday: `Staff 1: Room Service`,
    Sunday: `Staff 2: Room Service`,
  },
  {
    time: ``,
    Monday: `Staff 2: Room Service`,
    Tuesday: `Staff 2: Room Service`,
    Wednesday: `Staff 2: Room Service`,
    Thursday: `Staff 2: Room Service`,
    Friday: `Staff 2: Room Service`,
    Saturday: `Staff 1: Room Service`,
    Sunday: `Staff 2: Room Service`,
  },
  {
    time: `3:00 - 4:00`,
    Monday: `Staff 1: Room Service`,
    Tuesday: `Staff 1: Room Service`,
    Wednesday: `Staff 1: Room Service`,
    Thursday: `Staff 1: Room Service`,
    Friday: `Staff 1: Room Service`,
    Saturday: `Staff 1: Room Service`,
    Sunday: `Staff 2: Room Service`,
  },
  {
    time: ``,
    Monday: `Staff 2: Room Service`,
    Tuesday: `Staff 2: Room Service`,
    Wednesday: `Staff 2: Room Service`,
    Thursday: `Staff 2: Room Service`,
    Friday: `Staff 2: Room Service`,
    Saturday: `Staff 1: Room Service`,
    Sunday: `Staff 2: Room Service`,
  },
  {
    time: `4:00 - 4:30`,
    Monday: `Staff 1: EV5, EV4, EV3`,
    Tuesday: `Staff 1: EV5, EV4, EV3`,
    Wednesday: `Staff 1: EV5, EV4, EV3`,
    Thursday: `Staff 1: EV5, EV4, EV3`,
    Friday: `Staff 1: EV5, EV4, EV3`,
    Saturday: `Staff 1: EV5, EV4, EV3`,
    Sunday: `Staff 1: EV5, EV4, EV3`,
  },
  {
    time: ``,
    Monday: `Staff 2: EV2, EV1, Pick Compound and Dustbins`,
    Tuesday: `Staff 2: EV2, EV1, Pick Compound and Dustbins`,
    Wednesday: `Staff 2: EV2, EV1, Pick Compound and Dustbins`,
    Thursday: `Staff 2: EV2, EV1, Pick Compound and Dustbins`,
    Friday: `Staff 2: EV2, EV1, Pick Compound and Dustbins`,
    Saturday: `Staff 2: EV2, EV1, Pick Compound and Dustbins`,
    Sunday: `Staff 2: EV2, EV1, Pick Compound and Dustbins`,
  },
  {
    time: `4:30 - 5:00`,
    Monday: `Closing Time`,
    Tuesday: `Closing Time`,
    Wednesday: `Closing Time`,
    Thursday: `Closing Time`,
    Friday: `Closing Time`,
    Saturday: `Closing Time`,
    Sunday: `Closing Time`,
  },
];

// Function to generate the table dynamically
// Function to generate the table dynamically
function generateTable() {
  const table = document.getElementById("scheduleTable");

  // Create table header
  const headerRow = document.createElement("tr");
  const days = [
    "Time",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  days.forEach((day) => {
    const th = document.createElement("th");
    th.textContent = day;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Create table rows dynamically from scheduleData
  scheduleData.forEach((rowData) => {
    const row = document.createElement("tr");

    Object.keys(rowData).forEach((key) => {
      const cell = document.createElement("td");

      // Replace "Staff 1" with "Blessing" and "Staff 2" with "Fadilatu"
      let cellContent = rowData[key];
      cellContent = cellContent.replace("Staff 1", Staff[0]);
      cellContent = cellContent.replace("Staff 2", Staff[1]);

      cell.textContent = cellContent;

      // Apply special classes for colored time blocks
      if (rowData[key] === "Arrival Time") cell.classList.add("arrival");
      else if (rowData[key] === "8:00 - 8:30") cell.classList.add("arrival");
      else if (rowData[key] === "Breakfast Break")
        cell.classList.add("breakfast");
      else if (rowData[key] === "9:30 - 10:30") cell.classList.add("breakfast");
      else if (rowData[key] === "Lunch Break") cell.classList.add("lunch");
      else if (rowData[key] === "12:30 - 2:00") cell.classList.add("lunch");
      else if (rowData[key] === "Closing Time") cell.classList.add("closing");
      else if (rowData[key] === "4:30 - 5:00") cell.classList.add("closing");

      row.appendChild(cell);
    });
    table.appendChild(row);
  });
}

generateTable();
