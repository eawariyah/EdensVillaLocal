// Firebase configuration
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

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const CloseButton = document.getElementById("close");
CloseButton.addEventListener("click", () => {
  window.history.back();
});
var Staff = ["Blessing", "Fadilatu"];
const RoomsDB = [];

var RoomServiceRooms = [];
var RoomTasks = {
  // Monday: ["TestA", "TestA", "TestA", "TestA", "TestA", "TestA"],
  // Tuesday: ["TestB", "TestB", "TestB", "TestB", "TestB", "TestB"],
  // Wednesday: ["TestC", "TestC", "TestC", "TestC", "TestC", "TestC"],
  // Thursday: ["TestD", "TestD", "TestD", "TestD", "TestD", "TestD"],
  // Friday: ["TestE", "TestE", "TestE", "TestE", "TestE", "TestE"],
  // Saturday: ["TestF", "TestF", "TestF"],
  // Sunday: ["TestG", "TestG", "TestG"],
};

function fetchFromFirebase() {
  firebase
    .database()
    .ref("taskData")
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        Tasks = data.Tasks || []; // Fallback to empty array if no data
        RoomTasks = data.DayTasks || {};

        // Re-render the UI with the fetched data
        // renderTasks();
        // renderDayTasks();
        generateTable();

        // console.log("Fetched Tasks:", Tasks);
        // console.log(RoomTasks);
      } else {
        console.log("No data found in Firebase.");
      }
    })
    .catch((error) =>
      console.error("Error fetching data from Firebase:", error)
    );
}

// Array to track the current index for each day
const taskIndexTracker = {
  Monday: 0,
  Tuesday: 0,
  Wednesday: 0,
  Thursday: 0,
  Friday: 0,
  Saturday: 0,
  Sunday: 0,
};

function AssignJob(day) {
  // console.log(RoomTasks);

  const tasks = RoomTasks[day]; // Get the tasks for the specified day

  // Check if there are tasks available for the day
  if (tasks.length === 0) {
    return "No Tasks Assigned";
  }

  // Get the current task based on the index
  const task = tasks[taskIndexTracker[day]];

  // Update the index to the next task, looping back to 0 if at the end of tasks array
  taskIndexTracker[day] = (taskIndexTracker[day] + 1) % tasks.length;

  return task;
}

// Initialize the counter for job assignment
AssignJob.counter = 0;

// Function to generate the table dynamically
// Function to generate the table dynamically
function generateTable() {
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
      Wednesday: `Staff 1: ${AssignJob("Wednesday")}`, // Fixed this line
      Thursday: `Staff 1: ${AssignJob("Thursday")}`,
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
      Saturday: ``,
      Sunday: ``,
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
      Wednesday: `Staff 1: ${AssignJob("Wednesday")}`, // Fixed this line
      Thursday: `Staff 1: ${AssignJob("Thursday")}`,
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
      Saturday: ``,
      Sunday: ``,
    },
    {
      time: `11:30 - 12:30`,
      Monday: `Staff 1: ${AssignJob("Monday")}`,
      Tuesday: `Staff 1: ${AssignJob("Tuesday")}`,
      Wednesday: `Staff 1: ${AssignJob("Wednesday")}`, // Fixed this line
      Thursday: `Staff 1: ${AssignJob("Thursday")}`,
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
      Saturday: ``,
      Sunday: ``,
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
      Saturday: ``,
      Sunday: ``,
    },
    {
      time: `4:00 - 4:30`,
      Monday: `Staff 1: EV5, EV4, EV3`,
      Tuesday: `Staff 1: EV5, EV4, EV3`,
      Wednesday: `Staff 1: EV5, EV4, EV3`,
      Thursday: `Staff 1: EV5, EV4, EV3`,
      Friday: `Staff 1: EV5, EV4, EV3`,
      Saturday: `Staff 1: EV5, EV4, EV3`,
      Sunday: `Staff 2: EV2, EV1, Pick Compound and Dustbins`,
    },
    {
      time: ``,
      Monday: `Staff 2: EV2, EV1, Pick Compound and Dustbins`,
      Tuesday: `Staff 2: EV2, EV1, Pick Compound and Dustbins`,
      Wednesday: `Staff 2: EV2, EV1, Pick Compound and Dustbins`,
      Thursday: `Staff 2: EV2, EV1, Pick Compound and Dustbins`,
      Friday: `Staff 2: EV2, EV1, Pick Compound and Dustbins`,
      Saturday: ``,
      Sunday: ``,
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

fetchFromFirebase();
// generateTable();
