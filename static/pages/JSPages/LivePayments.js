const today = new Date(); // Get today's date
const DateIsoFormat = today.toISOString().slice(0, 16);
var ClientName = "";
var PrePayment = 0;
var CheckInDate = "";
var OldDate = "";
var NewDate = "";
var RoomServiceValued = "";
var KitchenValued = "";
var RequestDiscountValued = "";

const CloseButton = document.getElementById("close");
CloseButton.addEventListener("click", () => {
  window.history.back();
});

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Get the 'name' parameter from the URL
const ReservationID = getQueryParam("ReservationID");

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
function displayReservation() {
  const reservationRef = database.ref("reservations/" + ReservationID);

  reservationRef
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        const reservationData = snapshot.val();

        // console.log("Reservation Details:", reservationData);

        // Populate the HTML elements with reservationData
        document.getElementById("FullName").innerText =
          reservationData.fullName || "N/A";
        ClientName = reservationData.fullName;

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
          return date.toLocaleDateString("en-US", options).replace(",", " at");
        }

        // Apply the formatted date to the HTML elements
        document.getElementById("Checkin").innerText = reservationData.checkIn
          ? formatDateTime(reservationData.checkIn)
          : "N/A";
        document.getElementById("CheckinBillings").innerText =
          reservationData.checkIn
            ? formatDateTime(reservationData.checkIn)
            : "N/A";
        document.getElementById("Checkout").innerText = reservationData.checkOut
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

        RoomServiceValued = reservationData.RoomService;
        if (RoomServiceValued == "true") {
          document.getElementById("RoomService").innerText = "Yes";
        } else {
          document.getElementById("RoomService").innerText = "No";
        }
        KitchenValued = reservationData.Kitchen;
        if (KitchenValued == "true") {
          document.getElementById("Kitchen").innerText = "Yes";
        } else {
          document.getElementById("Kitchen").innerText = "No";
        }
        RequestDiscountValued = reservationData.RequestDiscount;
        if (RequestDiscountValued == "true") {
          document.getElementById("RequestDiscount").innerText = "Yes";
        } else {
          document.getElementById("RequestDiscount").innerText = "No";
        }

        document.getElementById("SpecialRequest").innerText =
          reservationData.specialRequests || "N/A";

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
        var DiscountTwoWeeks = 10;
        var DiscountFourWeeks = 20;
        var TwoWeeks = 14;
        var FourWeeks = 28;
        PrePayment = reservationData.PartialPayment;
        if (reservationData.RoomService == "true") {
          RoomServiceCost = 10;
          RoomServiceBillings.innerText = RoomServiceCost * NumberOfDays;
          SumOfBill = SumOfBill + RoomServiceCost * NumberOfDays;
        } else {
          RoomServiceCost = 0;
          RoomServiceBillings.innerText = 0;
          SumOfBill = SumOfBill + RoomServiceCost;
        }

        var KitchenCost = 0;
        if (reservationData.kitchen == "true") {
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
        } else if (reservationData.roomType === "Family") {
          RoomTypeCost = 600;
        } else if (reservationData.roomType === "Executive") {
          RoomTypeCost = 500;
        }
        document.getElementById("RoomTypeBillingsValue").innerText =
          RoomTypeCost * NumberOfDays;
        SumOfBill = SumOfBill + RoomTypeCost * NumberOfDays;
        if (
          NumberOfDays >= TwoWeeks &&
          reservationData.RequestDiscount == "true" &&
          NumberOfDays < FourWeeks
        ) {
          DiscountAmount = (DiscountTwoWeeks / 100) * SumOfBill;
        } else if (NumberOfDays >= FourWeeks) {
          DiscountAmount = (DiscountFourWeeks / 100) * SumOfBill;
        } else {
          DiscountAmount = 0;
        }
        document.getElementById("Discount").innerText = DiscountAmount || "0";
        document.getElementById("SumOfBill").innerText = SumOfBill || "0";

        document.getElementById("Total").innerText =
          SumOfBill - DiscountAmount - PrePayment || "0";
        document.getElementById("AmountLeftToPay").innerText =
          SumOfBill - DiscountAmount - PrePayment || "0";
      } else {
        console.log("No reservation found with the provided ID.");
      }
    })
    .catch((error) => {
      console.error("Error fetching reservation:", error);
    });
}

function PayMomo() {
  // Get the value from the PayNow input
  const partialPayment = document.getElementById("PayNowInput").value;

  // Check if there is a valid PartialPayment value
  if (partialPayment) {
    // Reference the specific reservation using ReservationID
    const reservationRef = database.ref("reservations/" + ReservationID);
    const NewPartialPrepayment =
      parseFloat(partialPayment) + parseFloat(PrePayment);

    // Update the PartialPayment field in Firebase
    reservationRef
      .update({ PartialPayment: parseFloat(NewPartialPrepayment) })
      .then(() => {
        alert("Payment recorded successfully.");
        const CashPaymentData = {
          fullName: ClientName,
          PaymentDate: DateIsoFormat,
          PaymentMethod: "Momo",
          PaymentAmount: partialPayment,
        };
        const newReservationRef = database.ref("Payments").push();
        newReservationRef
          .set(CashPaymentData)
          .then(() => {
            location.reload();
          })
          .catch((error) => {
            console.error("Error submitting reservation: ", error);
          });
      })
      .catch((error) => {
        console.error("Error updating payment: ", error);
      });
  } else {
    alert("Please enter a payment amount.");
  }
}

function PayCash() {
  // Get the value from the PayNow input
  const partialPayment = document.getElementById("PayNowInput").value;

  // Check if there is a valid PartialPayment value
  if (partialPayment) {
    // Reference the specific reservation using ReservationID
    const reservationRef = database.ref("reservations/" + ReservationID);
    const NewPartialPrepayment =
      parseFloat(partialPayment) + parseFloat(PrePayment);

    // Update the PartialPayment field in Firebase
    reservationRef
      .update({ PartialPayment: parseFloat(NewPartialPrepayment) })
      .then(() => {
        alert("Payments updated successfully.");
        const CashPaymentData = {
          fullName: ClientName,
          PaymentDate: DateIsoFormat,
          PaymentMethod: "Cash",
          PaymentAmount: partialPayment,
        };
        const newReservationRef = database.ref("Payments").push();
        newReservationRef
          .set(CashPaymentData)
          .then(() => {
            location.reload();
          })
          .catch((error) => {
            console.error("Error submitting reservation: ", error);
          });
      })
      .catch((error) => {
        console.error("Error updating payment: ", error);
      });
  } else {
    alert("Please enter a payment amount.");
  }
}

// Add event listeners to the Momo and Cash buttons
document.getElementById("MomoBtn").addEventListener("click", PayMomo);
document.getElementById("CashBtn").addEventListener("click", PayCash);

// Call the function to display reservation data
displayReservation();

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
          alert("New checkout date set: " + newCheckoutDate + "Refreshing...");
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

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("DiscountdateModal");
  const openModalBtn = document.getElementById("CustomerRequestDiscountBtn");
  const closeModalBtn = document.getElementById("DiscountcloseModal");
  const saveDateChangeBtn = document.getElementById("DiscountsaveDateChange");

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
  // saveDateChangeBtn.addEventListener("click", () => {
  //   // const newCheckinDate = newCheckinInput.value;
  //   const newCheckoutDate = newCheckoutInput.value;

  //   if (newCheckoutDate) {
  //     const reservationRef = database.ref("reservations/" + ReservationID);

  //     // Split OriginalDate into date and time components
  //     const [DateComponent, TimeComponent] = OldDate.split("T");

  //     // Combine UpdateDate with the time component to create NewDate
  //     NewDate = `${newCheckoutDate}T${TimeComponent}`;

  //     const checkinvalue = new Date(CheckInDate);
  //     const checkoutvalue = new Date(NewDate);

  //     const timeDifference = checkoutvalue.getTime() - checkinvalue.getTime();
  //     const numberOfDays = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days and round up

  //     if (numberOfDays <= 0) {
  //       alert("Check-out date must be later than check-in date.");
  //       location.reload();
  //     }

  //     // Update the PartialPayment field in Firebase
  //     reservationRef
  //       .update({ checkOut: NewDate, days: numberOfDays })
  //       .then(() => {
  //         alert("New checkout date set: " + newCheckoutDate + "Refreshing...");
  //         modal.style.display = "none";
  //         location.reload();
  //       })
  //       .catch((error) => {
  //         console.error("Error updating Checkout Date: ", error);
  //       });
  //   } else {
  //     alert("Please select new check-out date.");
  //   }
  // });

  // Close modal if clicked outside content
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
