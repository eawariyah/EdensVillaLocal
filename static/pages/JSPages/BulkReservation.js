const CloseButton = document.getElementById("close");
CloseButton.addEventListener("click", () => {
  window.history.back();
});

document.getElementById("reservationModal").style.display = "none";

function toggleDrawer() {
  const drawer = document.querySelector(".Drawer");
  drawer.classList.toggle("open");

  if (drawer.classList.contains("open")) {
    document.getElementById("OpenDrawer").style.display = "none";
  } else {
    document.getElementById("OpenDrawer").style.display = "block";
  }
}

function openModal() {
  openNewReservationModal(); // Opens the drawer when the "New Bulk Reservation" button is clicked
}

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
const database = firebase.database(app);

let selectedReservation = null;

// Open Modal for New Bulk Reservation
function openNewReservationModal() {
  document.getElementById("reservationModal").style.display = "block";
}

// Save Bulk Reservation
function saveBulkReservation() {
  const groupName = document.getElementById("GroupName").value;
  const groupPurpose = document.getElementById("GroupPurpose").value;
  const startDay = document.getElementById("ReservationStartDay").value;
  const endDay = document.getElementById("ReservationEndDay").value;

  const newReservation = {
    groupName,
    groupPurpose,
    startDay,
    endDay,
    reservations: [],
  };

  const newRef = database.ref("bulkReservations").push();
  newRef.set(newReservation);

  document.getElementById("reservationModal").style.display = "none";
  loadReservationsOverview();
}

// Load Bulk Reservations Overview
function loadReservationsOverview() {
  const tbody = document
    .getElementById("SubReservationsOverview")
    .querySelector("tbody");
  tbody.innerHTML = "";

  database.ref("bulkReservations").on("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const reservation = childSnapshot.val();
      const tr = document.createElement("tr");
      tr.innerHTML = `
          <td style="cursor: pointer;">${reservation.groupName}</td>
          <td style="cursor: pointer;">${reservation.startDay}</td>
          <td style="cursor: pointer;">${reservation.endDay}</td>
        `;
      tr.onclick = () => loadReservationDetails(childSnapshot.key, reservation);
      tbody.appendChild(tr);
    });
  });
}

// Load Individual Reservation Details
function loadReservationDetails(key, reservation) {
  selectedReservation = key;
  document.getElementById("Name").textContent = reservation.groupName;
  document.getElementById("Purpose").textContent = reservation.groupPurpose;
  document.getElementById("StartDateValue").textContent = reservation.startDay;
  document.getElementById("EndDateValue").textContent = reservation.endDay;

  const tbody = document
    .getElementById("SubReservations")
    .querySelector("tbody");
  tbody.innerHTML = "";

  const roomOptions = rooms
    .map((room) => `<option value="${room}">${room}</option>`)
    .join("");

  reservation.reservations.forEach((res, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${index + 1}</td>
        <td><input type="text" value="${res.name}" /></td>
        <td><input type="text" value="${res.contact}" /></td>
        <td><input type="text" value="${res.role}" /></td>
        <td><input type="datetime-local" value="${res.arrival}" /></td>
        <td><input type="datetime-local" value="${res.departure}" /></td>
        <td>${calculateDays(res.arrival, res.departure)}</td>
        <td><select>${roomOptions}</select></td>
        <td>${res.roomStatus || "Available"}</td>
      `;
    tbody.appendChild(tr);
  });
}

// Add a New Row for Sub Reservation
function addRow() {
  const tbody = document
    .getElementById("SubReservations")
    .querySelector("tbody");
  const tr = document.createElement("tr");

  const roomOptions = rooms
    .map((room) => `<option value="${room}">${room}</option>`)
    .join("");

  tr.innerHTML = `
        <td>${tbody.rows.length + 1}</td>
        <td><input type="text" /></td>
        <td><input type="text" /></td>
        <td><input type="text" /></td>
        <td><input type="datetime-local" /></td>
        <td><input type="datetime-local" /></td>
        <td></td>
        <td><select>${roomOptions}</select></td>
        <td>Available</td>
      `;

  // Get all reservations from Firebase
  const roomSelect = tr.querySelector("select");
  const arrivalInput = tr.querySelector(
    "input[type='datetime-local']:first-of-type"
  );

  // Add event listener to check room availability when the room is selected or arrival date changes
  roomSelect.addEventListener("change", function () {
    checkRoomAvailability(roomSelect.value, arrivalInput.value, tr);
  });

  arrivalInput.addEventListener("change", function () {
    checkRoomAvailability(roomSelect.value, arrivalInput.value, tr);
  });

  tbody.appendChild(tr);
}

// Function to check room availability based on arrival date
async function checkRoomAvailability(room, arrival, tr) {
  try {
    // Reference to reservations filtered by roomName
    const roomRef = database
      .ref("reservations")
      .orderByChild("roomName")
      .equalTo(room);

    // Await snapshot to ensure asynchronous consistency
    const snapshot = await roomRef.once("value");

    // Flag to track availability
    let isAvailable = true;
    const arrivalDate = new Date(arrival);

    // Check each reservation for conflicts
    snapshot.forEach((childSnapshot) => {
      const res = childSnapshot.val();
      const checkIn = new Date(res.checkIn);
      const checkOut = new Date(res.checkOut);

      if (arrivalDate >= checkIn && arrivalDate < checkOut) {
        // Room is occupied for the given date range
        tr.cells[8].style.backgroundColor = "red";
        tr.cells[8].style.color = "white";
        tr.cells[8].textContent = "Occupied by " + res.fullName;
        isAvailable = false;
        return true; // Exit the forEach loop once a conflict is found
      }
    });

    // Update the cell if no conflicts were found
    if (isAvailable) {
      tr.cells[8].textContent = "Available";
      tr.cells[8].style.backgroundColor = "green";
      tr.cells[8].style.color = "white";
    }
  } catch (error) {
    console.error("Error checking room availability:", error);
    alert("There was an error checking the room availability.");
  }
}

// Calculate Days Between Arrival and Departure
function calculateDays(arrival, departure) {
  const start = new Date(arrival);
  const end = new Date(departure);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Save Rows to Firebase
function saveRows() {
  const rows = Array.from(
    document.getElementById("SubReservations").querySelector("tbody").rows
  );
  const reservations = rows.map((row) => {
    return {
      name: row.cells[1].querySelector("input").value,
      contact: row.cells[2].querySelector("input").value,
      role: row.cells[3].querySelector("input").value,
      arrival: row.cells[4].querySelector("input").value,
      departure: row.cells[5].querySelector("input").value,
      roomStatus: row.cells[8].textContent,
    };
  });

  if (selectedReservation) {
    database
      .ref(`bulkReservations/${selectedReservation}/reservations`)
      .set(reservations);
  }
}

// Initialize
loadReservationsOverview();
