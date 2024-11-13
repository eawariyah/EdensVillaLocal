// const CloseButton = document.getElementById("close");
// CloseButton.addEventListener("click", () => {
//   window.history.back();
// });
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

const RoomStatus = {
  EV5C10: "Available",
  EV5D10: "Available",
  EV5A05: "Cleaning",
  EV5B05: "Available",
  EV5C09: "Available",
  EV5D09: "Available",
  EV4C08: "Unavailable",
  EV4D08: "Available",
  EV4A04: "Available",
  EV4B04: "Available",
  EV4C07: "Unavailable",
  EV4D07: "Available",
  EV3C06: "Available",
  EV3D06: "Available",
  EV3A03: "Available",
  EV3B03: "Available",
  EV3C05: "Unavailable",
  EV3D05: "Available",
  EV2D04: "Available",
  EV2C04: "Cleaning",
  EV2A02: "Available",
  EV2B02: "Available",
  EV2C03: "Available",
  EV2D03: "Available",
  EV1D02: "Available",
  EV1C02: "Cleaning",
  EV1A01: "Available",
  EV1B01: "Cleaning",
  EV1C01: "Available",
  EV1D01: "Available",
};

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
    roomHeader.textContent = "Rooms";
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

    rooms.forEach((room) => {
      const row = document.createElement("tr");
      const roomCell = document.createElement("td");
      roomCell.textContent = room;

      // Set background color based on RoomStatus
      const status = RoomStatus[room];
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
  database.ref("futurereservations").once("value", (snapshot) => {
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
  database.ref("reservations").once("value", (snapshot) => {
    snapshot.forEach((reservation) => {
      const reservationData = reservation.val();

      EventSection(
        reservationData.roomName,
        reservationData.checkIn,
        reservationData.checkOut,
        reservationData.fullName,
        "white",
        "blue"
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

// Initialize calendar and add sample event
renderCalendar();
EventSection(
  "EV5C10",
  "2024-10-26T15:31",
  "2024-11-02T15:31",
  "Mr. Smith",
  "blue",
  "white"
);

const ViewHistoryButton = document.getElementById("viewHistory");
ViewHistoryButton.addEventListener("click", () => {
  window.open("../HTMLPages/viewClientHistory.html", "_blank");
});

const CloseButton = document.getElementById("close");
CloseButton.addEventListener("click", () => {
  window.history.back();
});

const CheckoutButton = document.getElementById("checkoutButton");
CheckoutButton.addEventListener("click", () => {
  window.open("../HTMLPages/CheckoutPage.html", "_blank");
});

const renewButton = document.getElementById("renew");
renewButton.addEventListener("click", () => {
  window.open("../HTMLPages/renew.html", "_blank");
});

const TimeTableButton = document.getElementById("TimeTable");
TimeTableButton.addEventListener("click", () => {
  window.open("../HTMLPages/TimeTable.html", "_blank");
});

var ActualCheckoutDate = "";
var roomCost = 0;
var validDays = 0;
var calculatedDays = 0;
var companyChecked = false;
var DaysInputChecked = false;
var imageLocation = "";

var RunningPrice = 0;

const RoomServicePrice = 10;
const KitchenPrice = 100;

const StandardPrice = 350;
const DeluxePrice = 400;
const FamilyPrice = 600;
const ExecutivePrice = 500;

var DiscountAmount = 0;
const DiscountTwoWeeks = 10;
const DiscountFourWeeks = 20;
const TwoWeeks = 14;
const FourWeeks = 28;

const RoomServiceDisplay = document.getElementById("RoomServiceDisplayDiv");
const DiscountDisplay = document.getElementById("DiscountDisplayDiv");
const SecondDiscountDisplay = document.getElementById("DiscountBlock");

RoomServiceDisplay.style.display = "none"; // Hide the company name input if unchecked
DiscountDisplay.style.display = "none"; // Hide the company name input if unchecked
SecondDiscountDisplay.style.display = "none"; // Hide

let roomServiceAdded = false; // Flag to track if RoomServicePrice has already been added

document.getElementById("RoomService").addEventListener("input", (event) => {
  const RoomService = event.target.value;

  if (RoomService === "true" && !roomServiceAdded) {
    RunningPrice += RoomServicePrice;
    RoomServiceDisplay.style.display = "flex";
    document.getElementById("RoomServiceDisplay").textContent =
      RoomServicePrice;

    roomServiceAdded = true; // Set the flag to prevent double addition
  } else if (RoomService !== "true" && roomServiceAdded) {
    RunningPrice -= RoomServicePrice; // Remove RoomServicePrice if unchecked
    document.getElementById("RoomServiceDisplay").textContent = "0";
    roomServiceAdded = false; // Reset the flag
  }

  document.getElementById("TotalRun").textContent =
    RunningPrice * calculatedDays;
  document.getElementById("DiscountValue").textContent =
    (DiscountAmount / 100) * (RunningPrice * calculatedDays);
  document.getElementById("TotalRunSum").textContent =
    RunningPrice * calculatedDays -
    (DiscountAmount / 100) * (RunningPrice * calculatedDays);
});

const KitchenDisplay = document.getElementById("KitchenDisplayDiv");
KitchenDisplay.style.display = "none"; // Hide the company name input if unchecked

let kitchenAdded = false; // Flag to track if KitchenPrice has already been added

document.getElementById("Kitchen").addEventListener("input", (event) => {
  const Kitchen = event.target.value;

  if (Kitchen === "true" && !kitchenAdded) {
    RunningPrice += KitchenPrice;
    KitchenDisplay.style.display = "flex";
    document.getElementById("KitchenDisplay").textContent = KitchenPrice;

    kitchenAdded = true; // Set the flag so it won't add KitchenPrice again
  } else if (Kitchen !== "true" && kitchenAdded) {
    RunningPrice -= KitchenPrice; // Remove KitchenPrice if unchecked
    document.getElementById("KitchenDisplay").textContent = "0";
    kitchenAdded = false; // Reset the flag
  }

  document.getElementById("TotalRun").textContent =
    RunningPrice * calculatedDays;
  document.getElementById("DiscountValue").textContent =
    (DiscountAmount / 100) * (RunningPrice * calculatedDays);
  document.getElementById("TotalRunSum").textContent =
    RunningPrice * calculatedDays -
    (DiscountAmount / 100) * (RunningPrice * calculatedDays);
});

const RoomTypeDisplay = document.getElementById("RoomTypeDisplayDiv");
RoomTypeDisplay.style.display = "none"; // Hide initially

let previousRoomPrice = 0; // Track the last room type price added

document.getElementById("roomType").addEventListener("input", (event) => {
  const RoomType = event.target.value;

  // Remove the previous room price from RunningPrice
  RunningPrice -= previousRoomPrice;

  // Update RunningPrice and display based on selected room type
  if (RoomType === "Standard") {
    previousRoomPrice = StandardPrice;
    RoomTypeDisplay.style.display = "flex";

    document.getElementById("RoomTypeDisplay").textContent = StandardPrice;
  } else if (RoomType === "Deluxe") {
    previousRoomPrice = DeluxePrice;
    RoomTypeDisplay.style.display = "flex";

    document.getElementById("RoomTypeDisplay").textContent = DeluxePrice;
  } else if (RoomType === "Family") {
    previousRoomPrice = FamilyPrice;
    RoomTypeDisplay.style.display = "flex";

    document.getElementById("RoomTypeDisplay").textContent = FamilyPrice;
  } else if (RoomType === "Executive") {
    previousRoomPrice = ExecutivePrice;
    RoomTypeDisplay.style.display = "flex";

    document.getElementById("RoomTypeDisplay").textContent = ExecutivePrice;
  } else {
    // Default case for invalid selections
    previousRoomPrice = 0;
    document.getElementById("RoomTypeDisplay").textContent = "0";
  }

  // Add the current room type price to RunningPrice
  RunningPrice += previousRoomPrice;

  document.getElementById("TotalRun").textContent =
    RunningPrice * calculatedDays;
  document.getElementById("DiscountValue").textContent =
    (DiscountAmount / 100) * (RunningPrice * calculatedDays);
  document.getElementById("TotalRunSum").textContent =
    RunningPrice * calculatedDays -
    (DiscountAmount / 100) * (RunningPrice * calculatedDays);
});

const companyNameInput = document.getElementById("companyInput"); // Corrected to 'companyInput'
companyNameInput.style.display = "none"; // Hide the company name input if unchecked

document
  .getElementById("companyCheckbox")
  .addEventListener("change", function () {
    const NameInput = document.getElementById("nameInput");
    const companyNameInput = document.getElementById("companyInput"); // Corrected to 'companyInput'
    const firstNameInput = document.getElementById("FirstName");
    const lastNameInput = document.getElementById("LastName");

    if (this.checked) {
      companyNameInput.style.display = "flex"; // Show the company name input if checked
      companyNameInput.required = true;
      NameInput.style.display = "none";
      companyChecked = true;
    } else {
      companyNameInput.style.display = "none"; // Hide the company name input if unchecked
      companyNameInput.required = false;
      NameInput.style.display = "flex";
      firstNameInput.required = true;
      lastNameInput.required = true;
      companyChecked = false;
    }
  });

const DaysInputDivField = document.getElementById("DaysInputDiv"); // Corrected to 'companyInput'

const DaysInputField = document.getElementById("DaysInput"); // Corrected to 'companyInput'

DaysInputField.style.display = "none"; // Hide the company name input if unchecked
DaysInputDivField.style.display = "none";

document
  .getElementById("DaysInputCheckbox")
  .addEventListener("change", function () {
    const checkoutInput = document.getElementById("checkout");
    const DaysInputEntry = document.getElementById("DaysInput"); // Corrected to 'companyInput'
    const DaysInputDiv = document.getElementById("DaysInputDiv");

    if (this.checked) {
      DaysInputDiv.style.display = "flex";
      DaysInputEntry.style.display = "flex"; // Show the company name input if checked
      DaysInputEntry.required = true;
      checkoutInput.style.display = "none";
      checkoutInput.required = false;
      DaysInputChecked = true;
    } else {
      DaysInputDiv.style.display = "none";
      DaysInputEntry.style.display = "none"; // Hide the company name input if unchecked
      DaysInputEntry.required = false;
      checkoutInput.style.display = "flex";
      checkoutInput.required = true;
      DaysInputChecked = false;
    }
  });

function updateCheckoutDate() {
  // Get check-in date value
  const checkinDate = document.getElementById("checkin").value;
  // Get the number of days from the DaysInput
  const daysToAdd = parseInt(document.getElementById("DaysInput").value, 10);

  // Check if checkinDate and daysToAdd are valid
  if (!checkinDate || isNaN(daysToAdd)) {
    document.getElementById("CalendarDays").textContent = "Invalid input";
    return;
  }

  // Convert checkinDate to a Date object
  const checkinDateTime = new Date(checkinDate);

  // Add the number of days
  checkinDateTime.setDate(checkinDateTime.getDate() + daysToAdd);

  // Format the result as a readable date string
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const checkoutDateStr = checkinDateTime.toLocaleDateString("en-US", options);

  const checkoutDateIsoFormat = checkinDateTime.toISOString().slice(0, 16);

  ActualCheckoutDate = checkoutDateIsoFormat;
  calculateAmount();
  CalculateDays();
  // Update the CalendarDays <p> element
  document.getElementById("CalendarDays").textContent = checkoutDateStr;
}

// Add event listeners to trigger the update function when values change
document
  .getElementById("checkin")
  .addEventListener("change", updateCheckoutDate);
document
  .getElementById("DaysInput")
  .addEventListener("input", updateCheckoutDate);

// const firebaseConfig = {
//   apiKey: "AIzaSyAgXyyibV7I04EzHE_nhxdWGAOKaYWGp0E",
//   authDomain: "fruitripenessdetectionsystem.firebaseapp.com",
//   databaseURL:
//     "https://fruitripenessdetectionsystem-default-rtdb.firebaseio.com",
//   projectId: "fruitripenessdetectionsystem",
//   storageBucket: "fruitripenessdetectionsystem.appspot.com",
//   messagingSenderId: "103968652296",
//   appId: "1:103968652296:web:79a1bfc1495062779165bd",
//   measurementId: "G-7HR89GF4K9",
// };

// Initialize Firebase
// const app = firebase.initializeApp(firebaseConfig);
// const database = firebase.database();
const storage = firebase.storage();

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureButton = document.getElementById("capture");
const context = canvas.getContext("2d");

// Access the user's camera
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    console.error("Error accessing camera: ", err);
  });

// Capture an image when the button is clicked
captureButton.addEventListener("click", () => {
  // Draw the video frame to the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert the canvas image to a Blob
  canvas.toBlob((blob) => {
    // Create a reference to the location where you want to upload the image
    const storageRef = storage.ref("images/" + Date.now() + ".png"); // Unique name

    // Upload the Blob to Firebase Storage
    storageRef
      .put(blob)
      .then(() => {
        // Get the download URL
        return storageRef.getDownloadURL();
      })
      .then((url) => {
        console.log("Image available at:", url); // URL of the uploaded image
        imageLocation = url;
        // You can now use this URL as needed
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  }, "image/png");
});

// Handle form submission
document
  .getElementById("reservation-form")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form from submitting the traditional way
    var fullName = "";

    if (companyChecked) {
      fullName = document.getElementById("companyInput").value;
    } else {
      const firstName = document.getElementById("FirstName").value;
      const lastName = document.getElementById("LastName").value;
      fullName = (firstName + " " + lastName).toLowerCase();
    }

    var checkoutDateFinal = document.getElementById("checkout").value;
    var RealCheckoutDate = "";
    if (checkoutDateFinal == "") {
      RealCheckoutDate = ActualCheckoutDate;
    } else {
      RealCheckoutDate = checkoutDateFinal;
    }
    // alert(RealCheckoutDate);

    // Get form values
    const reservationData = {
      fullName: fullName,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      idType: document.getElementById("IDType").value,
      checkIn: document.getElementById("checkin").value,
      checkOut: RealCheckoutDate,
      RoomService: document.getElementById("RoomService").value,
      kitchen: document.getElementById("Kitchen").value,
      roomType: document.getElementById("roomType").value,
      roomName: document.getElementById("roomName").value,
      specialRequests: document.getElementById("requests").value,
      cost: RunningPrice,
      days: calculatedDays,
      imagePath: imageLocation,
      PartialPayment: 0,
    };

    // Store data in Firebase Realtime Database
    const newReservationRef = database.ref("futurereservations").push();
    newReservationRef
      .set(reservationData)
      .then(() => {
        alert("Reservation submitted successfully!");
        document.getElementById("reservation-form").reset();
        const reservationID = newReservationRef.key;
        const PaymentsPageLink =
          "../HTMLPages/FuturePayments.html?ReservationID=" + reservationID;
        // After reservation submission, update the room status to "Unavailable"
        const roomName = reservationData.roomName;
        const roomRef = database.ref("rooms/" + roomName);
        var ToPaymentsPage = document.getElementById("LivePayments").value;

        if (ToPaymentsPage == "true") {
          window.open(PaymentsPageLink, "_self");
        } else {
          window.history.back();
        }
      })
      .catch((error) => {
        console.error("Error submitting reservation: ", error);
      });
  });

let roomData = {}; // Store room data after fetching

// Function to fetch and cache room data on page load
function fetchRoomData() {
  database
    .ref("rooms")
    .once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const room = childSnapshot.val();

        // Group rooms by roomType
        if (!roomData[room.roomType]) {
          roomData[room.roomType] = [];
        }
        roomData[room.roomType].push(room);
        updateRoomColor(room.roomName, room.Status);
      });
    })
    .catch((error) => {
      console.error("Error fetching rooms:", error);
    });
}

// console.log(roomData);

function CalculateDays() {
  var checkout = new Date();
  const checkin = new Date(document.getElementById("checkin").value);
  const primarycheckout = new Date(document.getElementById("checkout").value);
  const alternatecheckout = new Date(ActualCheckoutDate);
  if (isNaN(primarycheckout.getTime())) {
    checkout = alternatecheckout;
  } else {
    checkout = primarycheckout;
  }
  // Ensure valid dates and room type
  if (isNaN(checkin.getTime()) || isNaN(checkout.getTime()) || !roomType) {
    // alert("Please select valid check-in, check-out dates and room type.");
    return;
  }

  // Calculate the number of days (Check-out date minus Check-in date)
  const timeDifference = checkout.getTime() - checkin.getTime();
  const numberOfDays = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days and round up

  if (numberOfDays <= 0) {
    alert("Check-out date must be later than check-in date.");
    return;
  }

  calculatedDays = numberOfDays;
  if (calculatedDays >= TwoWeeks) {
    DiscountAmount = DiscountTwoWeeks;
    document.getElementById("DiscountPercent").textContent = DiscountTwoWeeks;
    DiscountDisplay.style.display = "flex";
    SecondDiscountDisplay.style.display = "flex";
    document.getElementById("DiscountDays").textContent = TwoWeeks;
  }
  if (calculatedDays >= FourWeeks) {
    DiscountAmount = DiscountFourWeeks;
    document.getElementById("DiscountPercent").textContent = DiscountFourWeeks;
    DiscountDisplay.style.display = "flex";
    SecondDiscountDisplay.style.display = "flex";
    document.getElementById("DiscountDays").textContent = FourWeeks;
  }
}

function calculateAmount() {
  var checkout = new Date();
  const checkin = new Date(document.getElementById("checkin").value);
  const primarycheckout = new Date(document.getElementById("checkout").value);
  const alternatecheckout = new Date(ActualCheckoutDate);

  if (isNaN(primarycheckout.getTime())) {
    checkout = alternatecheckout;
  } else {
    checkout = primarycheckout;
  }

  const roomType = document.getElementById("roomType").value;

  const Kitchen = document.getElementById("Kitchen").value;
  const RoomService = document.getElementById("RoomService").value;

  // Ensure valid dates and room type
  if (isNaN(checkin.getTime()) || isNaN(checkout.getTime()) || !roomType) {
    // alert("Please select valid check-in, check-out dates and room type.");
    return;
  }

  // Calculate the number of days (Check-out date minus Check-in date)
  const timeDifference = checkout.getTime() - checkin.getTime();
  const numberOfDays = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days and round up

  if (numberOfDays <= 0) {
    alert("Check-out date must be later than check-in date.");
    return;
  }

  // Fetch the room price for the selected roomType
  const roomPrices = {}; // Declare room prices
  if (roomData[roomType] && roomData[roomType][0]) {
    const room = roomData[roomType][0]; // Assume the first room has the correct price for that roomType
    roomPrices[roomType] = room.price;
  } else {
    alert("Room price not found for the selected room type.");
    return;
  }

  const roomPrice = roomPrices[roomType];

  // Calculate the total amount
  var totalAmount = numberOfDays * roomPrice;

  validDays = numberOfDays;

  if (RoomService === "true") {
    totalAmount += RoomServicePr;
  }
  if (Kitchen === "true") {
    totalAmount += KitchenPrice;
  }

  roomCost = totalAmount;
  document.getElementById("days").textContent = numberOfDays;
  document.getElementById("amount").textContent = totalAmount.toFixed(2); // Format amount to 2 decimal places
}

document.getElementById("checkin").addEventListener("change", calculateAmount);
document.getElementById("checkout").addEventListener("change", calculateAmount);

document.getElementById("checkout").addEventListener("change", calculateAmount);
document.getElementById("roomType").addEventListener("change", calculateAmount);

document.getElementById("checkin").addEventListener("change", CalculateDays);
document.getElementById("checkout").addEventListener("change", CalculateDays);

document.getElementById("checkout").addEventListener("change", CalculateDays);
document.getElementById("roomType").addEventListener("change", CalculateDays);

function updateRoomColor(roomName, status) {
  const roomDiv = document.getElementById(roomName); // Get the room div by room name

  if (roomDiv) {
    if (status === "Available") {
      roomDiv.style.backgroundColor = "green"; // Set background color to green
    } else if (status === "Unavailable") {
      roomDiv.style.backgroundColor = "red"; // Set background color to red
    } else if (status === "Cleaning") {
      roomDiv.style.backgroundColor = "black"; // Set background color to black
    } else {
      roomDiv.style.backgroundColor = "gray"; // Default color if status is unknown
    }
  }
}

// Function to populate room names based on selected room type
// Function to populate room names based on selected room type
function populateRoomNames(selectedRoomType) {
  const roomSelect = document.getElementById("roomName");

  // Clear previous options except for the default
  roomSelect.innerHTML = '<option value="">--Select Room--</option>';

  // If there are rooms of the selected type, populate them
  if (roomData[selectedRoomType]) {
    roomData[selectedRoomType].forEach((room) => {
      // Check if the room status is "Available"
      // if (room.Status === "Available") {
      const option = document.createElement("option");
      option.value = room.roomName; // Set the room name as the value
      option.textContent = room.roomName; // Set the room name as the visible text
      roomSelect.appendChild(option);
      // }
    });
  }
}

// Event listener for roomType dropdown
document.getElementById("roomType").addEventListener("change", function () {
  const selectedRoomType = this.value; // Get the selected room type
  if (selectedRoomType) {
    populateRoomNames(selectedRoomType); // Populate room names based on selected room type
  } else {
    document.getElementById("roomName").innerHTML =
      '<option value="">--Select Room--</option>'; // Clear room names if no type is selected
  }
});

// Event listener for roomType dropdown
document.getElementById("roomType").addEventListener("change", function () {
  const selectedRoomType = this.value; // Get the selected room type
  if (selectedRoomType) {
    var drawer = document.getElementById("PriceDiv");

    drawer.style.display = "flex";
  }
});

// Fetch room data when the page loads
window.onload = fetchRoomData;
