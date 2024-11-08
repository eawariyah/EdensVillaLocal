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

// Fetch all reservations from the database and display specific fields
function displayReservations() {
  const reservationsRef = database.ref("reservations");
  const container = document.querySelector(".AllGuestsSub");
  container.innerHTML = ""; // Clear container for fresh data

  reservationsRef
    .once("value", (snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const reservationData = childSnapshot.val();

          const listItem = document.createElement("button");
          listItem.classList.add("reservation-button");

          // Display only required fields in each list item
          listItem.innerHTML = `
          <strong>${reservationData.fullName}</strong><br>
          Check-In: ${reservationData.checkIn}<br>
          Check-Out: ${reservationData.checkOut}<br>
          Days: ${reservationData.days}<br>
          Room Type: ${reservationData.roomType}<br>
          Bill: $${reservationData.cost}
        `;

          // Click event to populate HTML elements with reservation details
          listItem.addEventListener("click", function () {
            // console.log("Reservation Details:", reservationData);

            // Populate the HTML elements with reservationData
            document.getElementById("FullName").innerText =
              reservationData.fullName || "N/A";

            document.getElementById("GuestImage").src =
              reservationData.imagePath || "";

            document.getElementById("PhoneNumber").innerText =
              reservationData.phone || "N/A";
            document.getElementById("Email").innerText =
              reservationData.email || "N/A";
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
              return date
                .toLocaleDateString("en-US", options)
                .replace(",", " at");
            }

            // Apply the formatted date to the HTML elements
            document.getElementById("Checkin").innerText =
              reservationData.checkIn
                ? formatDateTime(reservationData.checkIn)
                : "N/A";
            document.getElementById("CheckinBillings").innerText =
              reservationData.checkIn
                ? formatDateTime(reservationData.checkIn)
                : "N/A";
            document.getElementById("Checkout").innerText =
              reservationData.checkOut
                ? formatDateTime(reservationData.checkOut)
                : "N/A";
            document.getElementById("CheckoutBillings").innerText =
              reservationData.checkOut
                ? formatDateTime(reservationData.checkOut)
                : "N/A";

            document.getElementById("Days").innerText =
              reservationData.days || "N/A";
            document.getElementById("DaysBillings").innerText =
              reservationData.days || "N/A";
            document.getElementById("DaysBillings2").innerText =
              reservationData.days || "N/A";
            document.getElementById("DaysBillings3").innerText =
              reservationData.days || "N/A";
            document.getElementById("RoomType").innerText =
              reservationData.roomType || "N/A";
            document.getElementById("RoomTypeBillings").innerText =
              reservationData.roomType || "N/A";
            document.getElementById("Room").innerText =
              reservationData.roomName || "N/A";
            document.getElementById("RoomService").innerText =
              reservationData.RoomService ? "Yes" : "No";
            document.getElementById("Kitchen").innerText =
              reservationData.kitchen ? "Yes" : "No";
            document.getElementById("SpecialRequest").innerText =
              reservationData.specialRequests || "N/A";

            document.getElementById("PrePayment").innerText =
              reservationData.PartialPayment || "N/A";

            var RoomServiceBillings = document.getElementById(
              "RoomServiceBillings"
            );
            var KitchenBillings = document.getElementById("KitchenBillings");
            var RoomServiceCost = 0;
            var NumberOfDays = reservationData.days;
            var SumOfBill = 0;
            var DiscountAmount = 0;
            var DiscountTwoWeeks = 10;
            var DiscountFourWeeks = 20;
            var TwoWeeks = 14;
            var FourWeeks = 28;
            var PrePayment = reservationData.PartialPayment;
            if (reservationData.RoomService) {
              RoomServiceCost = 10;
              RoomServiceBillings.innerText = RoomServiceCost * NumberOfDays;
              SumOfBill = SumOfBill + RoomServiceCost * NumberOfDays;
            } else {
              RoomServiceCost = 0;
              RoomServiceBillings.innerText = 0;
              SumOfBill = SumOfBill + RoomServiceCost;
            }

            var KitchenCost = 0;
            if (reservationData.kitchen) {
              KitchenCost = 10;
              KitchenBillings.innerText = KitchenCost * NumberOfDays;
              SumOfBill = SumOfBill + KitchenCost * NumberOfDays;
            } else {
              KitchenCost = 0;
              KitchenBillings.innerText = 0;
              SumOfBill = SumOfBill + KitchenCost;
            }

            var RoomServiceBillings = document.getElementById(
              "RoomServiceBillings"
            );

            var RoomTypeCost = 0;
            if (reservationData.roomType === "Standard") {
              RoomTypeCost = 350;
            } else if (reservationData.roomType === "Deluxe") {
              RoomTypeCost = 400;
            } else if (reservationData.roomType === "FamilySuite") {
              RoomTypeCost = 600;
            } else if (reservationData.roomType === "ExecutiveSuite") {
              RoomTypeCost = 500;
            }
            document.getElementById("RoomTypeBillingsValue").innerText =
              RoomTypeCost * NumberOfDays;
            SumOfBill = SumOfBill + RoomTypeCost * NumberOfDays;
            if (NumberOfDays >= TwoWeeks) {
              DiscountAmount = (DiscountTwoWeeks / 100) * SumOfBill;
            } else if (NumberOfDays >= FourWeeks) {
              DiscountAmount = (DiscountFourWeeks / 100) * SumOfBill;
            } else {
              DiscountAmount = 0;
            }
            document.getElementById("Discount").innerText =
              DiscountAmount || "N/A";
            document.getElementById("SumOfBill").innerText = SumOfBill || "N/A";

            document.getElementById("Total").innerText =
              SumOfBill - DiscountAmount - PrePayment || "N/A";
          });

          container.appendChild(listItem);
        });
      } else {
        console.log("No data available in reservations.");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Filter list based on search input
function filterReservations() {
  const searchInput = document
    .querySelector("input[type='search']")
    .value.toLowerCase();
  const reservationButtons = document.querySelectorAll(".reservation-button");

  reservationButtons.forEach((button) => {
    const name = button.querySelector("strong").innerText.toLowerCase();
    if (name.includes(searchInput)) {
      button.style.display = "block";
    } else {
      button.style.display = "none";
    }
  });
}

// Attach event listener for the search input
document
  .querySelector("input[type='search']")
  .addEventListener("input", filterReservations);

// Call the display function on page load to populate the data
displayReservations();
