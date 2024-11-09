// Your Firebase configuration
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

const CloseButton = document.getElementById("close");
CloseButton.addEventListener("click", () => {
  window.history.back();
});

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
var DiscountTwoWeeks = 10;

var DiscountFourWeeks = 20;
const KitchenCostPerDay = 100;
var TwoWeeks = 14;
var FourWeeks = 28;
const RoomServiceCostPerDay = 10;
const StandardRoomPrice = 350;
const DeluxeRoomPrice = 400;
const FamilySuiteRoomPrice = 600;
const ExecutiveRoomPrice = 500;

// Function to fetch data from Firebase and display in the table
function fetchReservations() {
  const reservationRef = database.ref("reservations");
  reservationRef.once("value", (snapshot) => {
    const dataBody = document.getElementById("data-body");
    dataBody.innerHTML = ""; // Clear previous data
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      const row = document.createElement("tr");
      var RoomPriceValue = 0;
      function formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        const options = {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        };
        return date.toLocaleDateString("en-US", options).replace(",", " at");
      }
      if (data.kitchen == "true") {
        RoomPriceValue = RoomPriceValue + KitchenCostPerDay;
      }

      if (data.RoomService == "true") {
        RoomPriceValue = RoomPriceValue + RoomServiceCostPerDay;
      }

      if ((data.roomType = "Standard")) {
        RoomPriceValue = StandardRoomPrice;
      } else if ((data.roomType = "Deluxe")) {
        RoomPriceValue = DeluxeRoomPrice;
      } else if ((data.roomType = "Family")) {
        RoomPriceValue = FamilySuiteRoomPrice;
      } else {
        RoomPriceValue = ExecutiveRoomPrice;
      }

      var DaysTimesAmount = RoomPriceValue * parseInt(data.days);

      var DiscountValue = 0;
      if (parseInt(data.days) >= TwoWeeks) {
        DiscountValue = (DiscountTwoWeeks / 100) * DaysTimesAmount;
      } else if (parseInt(data.days) >= FourWeeks) {
        DiscountValue = (DiscountFourWeeks / 100) * DaysTimesAmount;
      } else {
        DiscountValue = 0;
      }

      var TotalAmount = DaysTimesAmount - DiscountValue;

      row.innerHTML = `
            <td>${formatDateTime(data.checkIn) || ""}</td>
            <td>${data.fullName || ""}</td>
            <td>${data.roomName || ""}</td>
            <td>${RoomPriceValue || ""}</td>
            <td>${data.RoomService || ""}</td>
            <td>${data.kitchen || ""}</td>
            <td>${data.days || ""}</td>
            <td>${DaysTimesAmount || ""}</td>
            <td>${DiscountValue || ""}</td>
            <td>${TotalAmount || ""}</td>
            <td>${formatDateTime(data.checkOut) || ""}</td>
            <td>${data.email || ""}</td>
            <td>${data.phone || ""}</td>
            <td>${data.idType || ""}</td>

            <td>${data.roomType || ""}</td>
            <td>${data.specialRequests || ""}</td>
        `;
      dataBody.appendChild(row);
    });
  });
}

// Fetch data on page load
window.onload = fetchReservations;

// Function to download data as Excel
function downloadExcel() {
  const table = document.getElementById("data-table");
  const workbook = XLSX.utils.table_to_book(table, {
    sheet: "Reservations",
  });
  XLSX.writeFile(workbook, "ReservationData.xlsx");
}
