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
var ReservationID = "";
var PrePaymentValue = 0;
var TotalEveryCost = 1;
var CheckInDate = "";
var OldDate = "";
var NewDate = "";
var RoomNameValue = "";

var DiscountTwoWeeks = 10;
var DiscountFourWeeks = 20;
const KitchenCostPerDay = 100;
const RoomServiceCostPerDay = 10;
const StandardRoomPrice = 350;
const DeluxeRoomPrice = 400;
const FamilySuiteRoomPrice = 600;
const ExecutiveRoomPrice = 500;

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

            ReservationID = childSnapshot.key; // Use childSnapshot.key here

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
            RoomNameValue = reservationData.roomName;
            document.getElementById("RoomService").innerText =
              reservationData.RoomService ? "Yes" : "No";
            document.getElementById("Kitchen").innerText =
              reservationData.kitchen ? "Yes" : "No";
            document.getElementById("SpecialRequest").innerText =
              reservationData.specialRequests || "N/A";

            PrePaymentValue = parseFloat(reservationData.PartialPayment);

            document.getElementById("PrePayment").innerText =
              reservationData.PartialPayment || "0";

            var RoomServiceBillings = document.getElementById(
              "RoomServiceBillings"
            );
            CheckInDate = reservationData.checkIn;
            OldDate = reservationData.checkOut;
            var KitchenBillings = document.getElementById("KitchenBillings");
            var RoomServiceCost = 0;
            var NumberOfDays = reservationData.days;
            var SumOfBill = 0;
            var DiscountAmount = 0;

            var TwoWeeks = 14;
            var FourWeeks = 28;
            var PrePayment = reservationData.PartialPayment;
            if (reservationData.RoomService) {
              RoomServiceCost = RoomServiceCostPerDay;
              RoomServiceBillings.innerText = RoomServiceCost * NumberOfDays;
              SumOfBill = SumOfBill + RoomServiceCost * NumberOfDays;
            } else {
              RoomServiceCost = 0;
              RoomServiceBillings.innerText = 0;
              SumOfBill = SumOfBill + RoomServiceCost;
            }

            var KitchenCost = 0;
            if (reservationData.kitchen) {
              KitchenCost = KitchenCostPerDay;
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
              RoomTypeCost = StandardRoomPrice;
            } else if (reservationData.roomType === "Deluxe") {
              RoomTypeCost = DeluxeRoomPrice;
            } else if (reservationData.roomType === "Family") {
              RoomTypeCost = FamilySuiteRoomPrice;
            } else if (reservationData.roomType === "Executive") {
              RoomTypeCost = ExecutiveRoomPrice;
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
              DiscountAmount || "0";
            document.getElementById("SumOfBill").innerText = SumOfBill || "0";

            document.getElementById("Total").innerText =
              SumOfBill - DiscountAmount - PrePayment || "0";
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

const CheckoutButton = document.getElementById("CheckOutBtn");
CheckoutButton.addEventListener("click", () => {
  const checkinBillings = document.getElementById("Total");

  TotalEveryCost = parseFloat(checkinBillings.textContent);

  if (ReservationID == "") {
    alert("Please select a reservation to check out");
  } else {
    if (TotalEveryCost == 0) {
      alert("Check out complete");
      const roomName = RoomNameValue;

      // Update room status to "Cleaning"
      const roomRef = database.ref(`rooms/${roomName}`);
      roomRef
        .update({
          Status: "Cleaning",
        })
        .then(() => {
          alert(`Room ${roomName} status updated to "Cleaning".`);
        })
        .catch((error) => {
          console.error("Error updating room status: ", error);
          alert("Failed to update room status. Please try again.");
        });
    } else {
      const PaymentsPageLink =
        "../HTMLPages/HTMLPages/LivePayments.html?ReservationID=" +
        ReservationID;
      window.open(PaymentsPageLink, "_self");
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("dateModal");
  const openModalBtn = document.getElementById("ChangeDateBtn");
  const closeModalBtn = document.getElementById("closeModal");
  const saveDateChangeBtn = document.getElementById("saveDateChange");

  // const currentCheckin = document.getElementById("currentCheckin");
  const currentCheckout = document.getElementById("currentCheckout");
  const checkinBillings = document.getElementById("CheckinBillings");
  const checkoutBillings = document.getElementById("CheckoutBillings");

  // const newCheckinInput = document.getElementById("newCheckin");
  const newCheckoutInput = document.getElementById("newCheckout");

  // Show modal on button click
  openModalBtn.addEventListener("click", () => {
    currentCheckin.textContent = checkinBillings.textContent;
    currentCheckout.textContent = checkoutBillings.textContent;

    modal.style.display = "flex";
  });

  // Close modal
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Save date changes
  saveDateChangeBtn.addEventListener("click", () => {
    // const newCheckinDate = newCheckinInput.value;
    const newCheckoutDate = newCheckoutInput.value;

    if (newCheckoutDate) {
      const reservationRef = database.ref("reservations/" + ReservationID);

      // Split OriginalDate into date and time components
      const [DateComponent, TimeComponent] = OldDate.split("T");

      // Combine UpdateDate with the time component to create NewDate
      NewDate = `${newCheckoutDate}T${TimeComponent}`;

      const checkinvalue = new Date(CheckInDate);
      const checkoutvalue = new Date(NewDate);

      const timeDifference = checkoutvalue.getTime() - checkinvalue.getTime();
      const numberOfDays = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days and round up

      if (numberOfDays <= 0) {
        alert("Check-out date must be later than check-in date.");
        location.reload();
      }

      // Update the PartialPayment field in Firebase
      reservationRef
        .update({ checkOut: NewDate, days: numberOfDays })
        .then(() => {
          alert("New checkout date set: " + newCheckoutDate + " Refreshing...");
          modal.style.display = "none";
          location.reload();
        })
        .catch((error) => {
          console.error("Error updating Checkout Date: ", error);
        });
    } else {
      alert("Please select new check-out date.");
    }
  });

  // Close modal if clicked outside content
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});

const printReceiptBtn = document.getElementById("PrintReceiptBtn");

printReceiptBtn.addEventListener("click", () => {
  if (ReservationID === "") {
    alert("Please select a reservation to print a receipt.");
    return;
  }

  const fullName = document.getElementById("FullName").innerText;
  const checkIn = document.getElementById("Checkin").innerText;
  const checkOut = document.getElementById("Checkout").innerText;
  const roomType = document.getElementById("RoomType").innerText;
  const Kitchen = document.getElementById("Kitchen").innerText;

  const totalCost = document.getElementById("Total").innerText;

  // Navigate to receipt preview page with query parameters
  const receiptPreviewUrl = `../HTMLPages/ReceiptPreview.html?fullName=${encodeURIComponent(
    fullName
  )}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(
    checkOut
  )}&roomType=${encodeURIComponent(roomType)}&totalCost=${encodeURIComponent(
    totalCost
  )}&Kitchen=${encodeURIComponent(Kitchen)}&ReservationID=${encodeURIComponent(
    Kitchen
  )}
  )}`;

  window.open(receiptPreviewUrl, "_self");
});
