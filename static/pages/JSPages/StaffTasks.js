const CloseButton = document.getElementById("close");
CloseButton.addEventListener("click", () => {
  window.history.back();
});
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

// Define the task and day data
var Tasks = [];

var CustomTasks = [];

var DayTasks = {};

function fetchCleaningApartments() {
  const tasksRef = firebase.database().ref("rooms");
  tasksRef
    .once("value")
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const apartmentId = childSnapshot.key;
        const roomData = childSnapshot.val();

        if (roomData.Status === "Cleaning") {
          Tasks.push(apartmentId);
        }
      });

      // console.log("Apartments with status 'Cleaning':", Tasks);
      fetchFromFirebase();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

document.getElementById("addTaskButton").addEventListener("click", function () {
  const taskInput = document.getElementById("CustomTaskInput");
  const taskName = taskInput.value.trim();
  if (taskName) {
    CustomTasks.push(taskName);
    taskInput.value = ""; // Clear the input field
    renderCustomTasks(); // Render the custom tasks
    updateFirebase(); // Update Firebase if needed
  }
});

function renderCustomTasks() {
  const userTasksContainer = document.getElementById("UserTasks");
  userTasksContainer.innerHTML = `<h3>Add Task</h3>
                                  <input type="text" placeholder="New Task" id="CustomTaskInput" />
                                  <button id="addTaskButton">Add Task</button>`;
  CustomTasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.textContent = task;
    taskItem.setAttribute("draggable", "true");
    taskItem.addEventListener("dragstart", dragStart);
    userTasksContainer.appendChild(taskItem);
  });
}

function fetchFromFirebase() {
  firebase
    .database()
    .ref("taskData")
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Tasks = data.Tasks || []; // Fallback to empty array if no data
        DayTasks = data.DayTasks || {};

        // Re-render the UI with the fetched data
        renderTasks();
        renderDayTasks();

        // console.log("Fetched Tasks:", Tasks);
        // console.log("Fetched DayTasks:", DayTasks);
      } else {
        console.log("No data found in Firebase.");
      }
    })
    .catch((error) =>
      console.error("Error fetching data from Firebase:", error)
    );
}

function renderTasks() {
  const tasksContainer = document.getElementById("tasks");
  tasksContainer.innerHTML = "<h3>Rooms to clean</h3>";
  Tasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.textContent = task;
    taskItem.setAttribute("draggable", "true");
    taskItem.addEventListener("dragstart", dragStart);
    tasksContainer.appendChild(taskItem);
  });
}

// Update renderDayTasks function to accept dragged tasks from CustomTasks
function renderDayTasks() {
  const dayTasksContainer = document.getElementById("dayTasks");
  // dayTasksContainer.innerHTML = "<h3>Day Tasks</h3>";
  for (const day in DayTasks) {
    const daySection = document.createElement("div");
    daySection.classList.add("day-section");
    daySection.setAttribute("data-day", day);
    daySection.innerHTML = `<h4>${day}</h4>`;
    daySection.addEventListener("dragover", dragOver);
    daySection.addEventListener("dragleave", dragLeave);
    daySection.addEventListener("drop", drop);

    DayTasks[day].forEach((task) => {
      const dayItem = document.createElement("div");
      dayItem.classList.add("day-item");
      dayItem.textContent = task;
      dayItem.setAttribute("draggable", "true");
      dayItem.addEventListener("dragstart", dragStart);
      daySection.appendChild(dayItem);
    });

    dayTasksContainer.appendChild(daySection);
  }
}

// Modify dragStart to handle both CustomTasks and Tasks
function dragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.textContent);
  event.dataTransfer.setData(
    "source-day",
    event.target.closest(".day-section")?.getAttribute("data-day") || ""
  );
}

function dragOver(event) {
  event.preventDefault();
  event.target.classList.add("dragover");
}

function dragLeave(event) {
  event.target.classList.remove("dragover");
}

// Update the drop function to add tasks from CustomTasks to DayTasks
function drop(event) {
  event.preventDefault();
  event.target.classList.remove("dragover");

  const draggedTask = event.dataTransfer.getData("text/plain");
  const sourceDay = event.dataTransfer.getData("source-day");
  const targetDay = event.target
    .closest(".day-section")
    .getAttribute("data-day");

  if (!DayTasks[targetDay].includes(draggedTask)) {
    DayTasks[targetDay].push(draggedTask);
  }

  // If the task is from CustomTasks, remove it from CustomTasks after moving
  if (!sourceDay && CustomTasks.includes(draggedTask)) {
    CustomTasks.splice(CustomTasks.indexOf(draggedTask), 1);
    renderCustomTasks();
  }

  renderDayTasks();
  updateFirebase();
}

function updateFirebase() {
  firebase
    .database()
    .ref("taskData")
    .set({
      Tasks: Tasks,
      DayTasks: DayTasks,
      CustomTasks: CustomTasks,
    })
    .then(() => console.log("Data successfully sent to Firebase"))
    .catch((error) => console.error("Error sending data to Firebase:", error));
}

// Initialize RemoveTask drop area
const removeTaskContainer = document.getElementById("RemoveTask");
removeTaskContainer.addEventListener("dragover", dragOverRemoveTask);
removeTaskContainer.addEventListener("drop", dropRemoveTask);

function dragOverRemoveTask(event) {
  event.preventDefault();
  event.target.classList.add("dragover");
}

function dropRemoveTask(event) {
  event.preventDefault();
  event.target.classList.remove("dragover");

  const draggedTask = event.dataTransfer.getData("text/plain");
  const sourceDay = event.dataTransfer.getData("source-day");

  if (sourceDay) {
    // Remove task from DayTasks if it came from a day section
    const dayTasks = DayTasks[sourceDay];
    const taskIndex = dayTasks.indexOf(draggedTask);
    if (taskIndex !== -1) {
      dayTasks.splice(taskIndex, 1); // Remove task from DayTasks
    }
  } else {
    // Remove task from Tasks array if it came from the main tasks section
    const taskIndex = Tasks.indexOf(draggedTask);
    if (taskIndex !== -1) {
      Tasks.splice(taskIndex, 1); // Remove task from Tasks
    }
  }

  // Re-render tasks and update Firebase
  renderTasks();
  renderDayTasks();
  updateFirebase();
}

// fetchFromFirebase();
// renderTasks();
// renderDayTasks();
function getTomorrowsDay() {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Get today's date
  const today = new Date();

  // Calculate tomorrow's date
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Get the day of the week for tomorrow
  const dayName = daysOfWeek[tomorrow.getDay()];

  // Update the HTML element
  document.getElementById("TomorrowsDay").textContent = dayName;
}

// Call the function to display tomorrow's day
getTomorrowsDay();
fetchCleaningApartments();
