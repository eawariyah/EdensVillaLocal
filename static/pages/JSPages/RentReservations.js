const fields = [
  "FirstName",
  "LastName",
  "companyInput",
  "email",
  "phone",
  "IDType",
  "checkin",
  "checkout",
  "RoomService",
  "Kitchen",
  "roomType",
  "roomName",
];

fields.forEach((field) => {
  document.getElementById(field).addEventListener("input", async (event) => {
    const value = event.target.value;
    if (value) {
      try {
        const response = await fetch("/inputValue", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ field, value }),
        });
        const data = await response.json();
        console.log(`${field} updated:`, data.status); // Optionally log the response
      } catch (error) {
        console.error(`Error sending ${field} input:`, error);
      }
    }
  });
});

const storage = firebase.storage();
const video = document.getElementById("video");
var imageLocation = "";
const canvas = document.getElementById("canvas");
const captureButton = document.getElementById("capture");
const context = canvas.getContext("2d");

var FullNameValue = "";
var CheckoutDateValue = "";
var NumberOfDays = 0;

var DiscountAmount = 0;
const DiscountTwoWeeks = 10;
const DiscountFourWeeks = 20;
const TwoWeeks = 14;
const FourWeeks = 28;

var RunningPrice = 0;

var RequestDiscountBoolean = false;

const RoomServicePrice = 10;
const KitchenPrice = 100;

const StandardPrice = 350;
const DeluxePrice = 400;
const FamilyPrice = 600;
const ExecutivePrice = 500;

// Initialize the variables
var RoomDataComplete = {};
var AvailableRoomsForRoomType = [];

// Function to select available rooms based on RoomType
function AvailableRoomSelect(RoomType) {
  AvailableRoomsForRoomType = []; // Clear previous data

  // Iterate through RoomDataComplete to find matching rooms
  for (const roomId in RoomDataComplete) {
    const room = RoomDataComplete[roomId];
    if (room.roomType === RoomType && room.Status === "Available") {
      AvailableRoomsForRoomType.push(room.roomName); // Add roomName to the list
    }
  }

  return AvailableRoomsForRoomType; // Return the list of available rooms
}

// Example: Fetch room data from the database and populate RoomDataComplete
function fetchRoomDataFromDatabase() {
  database
    .ref("rooms")
    .once("value")
    .then((snapshot) => {
      RoomDataComplete = snapshot.val() || {}; // Populate RoomDataComplete
      console.log("Room data loaded:", RoomDataComplete);
    })
    .catch((error) => {
      console.error("Error fetching room data:", error);
    });
}

// Example usage
fetchRoomDataFromDatabase();

// Event listener for room type selection
document.getElementById("roomType").addEventListener("input", () => {
  const RoomTypeValue = document.getElementById("roomType").value;

  // Get available rooms for the selected RoomType
  const availableRooms = AvailableRoomSelect(RoomTypeValue);

  console.log("Available Rooms for selected RoomType:", availableRooms);

  // Update roomName dropdown
  const roomSelect = document.getElementById("roomName");

  // Clear previous options
  roomSelect.innerHTML = "";

  // Populate dropdown with available rooms
  availableRooms.forEach((room) => {
    const option = document.createElement("option");
    option.value = room;
    option.textContent = room;
    roomSelect.appendChild(option);
  });
});

// Managing Company Checkbox
document.getElementById("companyInput").style.display = "none";

document
  .getElementById("companyCheckbox")
  .addEventListener("input", (event) => {
    const CompanyCheckbox = event.target.checked;

    if (CompanyCheckbox) {
      document.getElementById("nameInput").style.display = "none";
      document.getElementById("companyInput").style.display = "flex";
      document.getElementById("companyInput").required = true;
      document.getElementById("FirstName").required = false;
      document.getElementById("LastName").required = false;
    } else {
      document.getElementById("companyInput").style.display = "none";
      document.getElementById("nameInput").style.display = "flex";
      document.getElementById("FirstName").required = true;
      document.getElementById("LastName").required = true;
      document.getElementById("companyInput").required = false;
    }
  });

// Listen for changes in the inputs to keep FullNameValue updated
document.getElementById("companyInput").addEventListener("input", () => {
  FullNameValue = document.getElementById("companyInput").value;
});

document.getElementById("FirstName").addEventListener("input", () => {
  FullNameValue =
    document.getElementById("FirstName").value +
    " " +
    document.getElementById("LastName").value;
});

document.getElementById("LastName").addEventListener("input", () => {
  FullNameValue =
    document.getElementById("FirstName").value +
    " " +
    document.getElementById("LastName").value;
});

//Checkout Calculator
document.getElementById("DaysInput").style.display = "none";
document.getElementById("ShowDate").style.display = "none";
document.getElementById("NumberOfDaysBetween").style.display = "none";

document
  .getElementById("DaysInputCheckbox")
  .addEventListener("input", (event) => {
    const DaysInputCheckbox = event.target.checked;

    if (DaysInputCheckbox) {
      document.getElementById("checkout").style.display = "none";
      document.getElementById("DaysInput").style.display = "flex";
      document.getElementById("ShowDate").style.display = "flex";
      document.getElementById("DaysInput").required = true;
      document.getElementById("checkout").required = false;
    } else {
      document.getElementById("DaysInput").style.display = "none";
      document.getElementById("checkout").style.display = "flex";
      document.getElementById("ShowDate").style.display = "none";
      document.getElementById("DaysInput").required = false;
      document.getElementById("checkout").required = true;
    }
  });

document.getElementById("checkin").addEventListener("input", () => {
  CalculateDays();
});
document.getElementById("checkout").addEventListener("input", () => {
  CalculateDays(document.getElementById("checkout").value);
  CheckoutDateValue = document.getElementById("checkout").value;
  document.getElementById("NumberOfDaysBetween").style.display = "flex";
});
document.getElementById("DaysInput").addEventListener("input", () => {
  CalculateDays(
    CalculateDaysFromNumber(document.getElementById("DaysInput").value)
  );
  document.getElementById("NumberOfDaysBetween").style.display = "flex";
});

DiscountDisplay = document.getElementById("DiscountDisplayDiv");
DiscountDisplay.style.display = "none";

ShowRequestDiscount = document.getElementById("RequestDiscount");
ShowRequestDiscount.style.display = "none";
ShowRequestDiscount.required = false;

ShowRequestDiscountLabel = document.getElementById("RequestDiscountLabel");
ShowRequestDiscountLabel.style.display = "none";

function CalculateDays(CheckoutDate) {
  const checkin = new Date(document.getElementById("checkin").value);
  const checkout = new Date(CheckoutDate);

  // Ensure valid dates and room type
  if (isNaN(checkin.getTime()) || isNaN(checkout.getTime())) {
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
  NumberOfDays = numberOfDays;
  document.getElementById("NumberOfDaysBetweenValue").textContent =
    NumberOfDays;

  if (NumberOfDays >= TwoWeeks && NumberOfDays < FourWeeks) {
    DiscountAmount = DiscountTwoWeeks;
    document.getElementById("DiscountPercent").textContent = DiscountTwoWeeks;
    document.getElementById("DiscountDays").textContent = NumberOfDays;
    ShowRequestDiscount = document.getElementById("RequestDiscount");
    ShowRequestDiscount.style.display = "flex";
    ShowRequestDiscount.required = false;

    ShowRequestDiscountLabel = document.getElementById("RequestDiscountLabel");
    ShowRequestDiscountLabel.style.display = "flex";

    DiscountDisplay.style.display = "flex";
  } else if (NumberOfDays >= FourWeeks) {
    DiscountAmount = DiscountFourWeeks;
    document.getElementById("DiscountPercent").textContent = DiscountFourWeeks;
    document.getElementById("DiscountDays").textContent = NumberOfDays;
    ShowRequestDiscount.style.display = "flex";
    ShowRequestDiscount.required = false;
    ShowRequestDiscountFlag = document.getElementById("RequestDiscount").value;
    if (ShowRequestDiscountFlag == "true") {
      RequestDiscountBoolean = true;
    } else {
      RequestDiscountBoolean = false;
    }

    ShowRequestDiscountLabel = document.getElementById("RequestDiscountLabel");
    ShowRequestDiscountLabel.style.display = "flex";
    DiscountDisplay.style.display = "flex";
  } else {
    DiscountDisplay.style.display = "none";
    ShowRequestDiscount.style.display = "none";
    ShowRequestDiscount.required = false;

    ShowRequestDiscountLabel.style.display = "none";
  }

  // alert(NumberOfDays);
}

function CalculateDaysFromNumber() {
  const checkin = new Date(document.getElementById("checkin").value);
  const HowManyDays = parseInt(document.getElementById("DaysInput").value, 10);

  if (isNaN(HowManyDays) || isNaN(checkin.getTime())) {
    console.error(
      "Invalid input. Ensure check-in date and number of days are valid."
    );
    return null;
  }

  // Add the number of days to the check-in date
  const CheckoutDateFromNumber = new Date(checkin);
  CheckoutDateFromNumber.setDate(checkin.getDate() + HowManyDays);

  // Convert the checkout date back to the desired format
  const CheckoutDateFromNumberValue =
    CheckoutDateFromNumber.toISOString().slice(0, 16);

  CheckoutDateValue = CheckoutDateFromNumberValue;
  document.getElementById("ShowDateValue").textContent = CheckoutDateFromNumber;

  return CheckoutDateFromNumberValue;
}

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

document.getElementById("RoomServiceDisplayDiv").style.display = "none";
var RoomServiceFlag = "";
var RoomServicePriceSelectedAlreadyFlag = false;
document.getElementById("RoomService").addEventListener("input", () => {
  RoomServiceFlag = document.getElementById("RoomService").value;
  if (RoomServiceFlag == "true") {
    RunningPrice = RunningPrice + RoomServicePrice;
    RoomServicePriceSelectedAlreadyFlag = true;
    document.getElementById("RoomServiceDisplay").textContent =
      RoomServicePrice;
    document.getElementById("RoomServiceDisplayDiv").style.display = "flex";
  } else {
    document.getElementById("RoomServiceDisplayDiv").style.display = "none";
    if (RoomServicePriceSelectedAlreadyFlag) {
      RunningPrice = RunningPrice - RoomServicePrice;
      RoomServicePriceSelectedAlreadyFlag = false;
    }
  }
});

document.getElementById("KitchenDisplayDiv").style.display = "none";
var KitchenFlag = "";
var KitchenPriceSelectedAlreadyFlag = false;
document.getElementById("Kitchen").addEventListener("input", () => {
  KitchenFlag = document.getElementById("Kitchen").value;
  if (KitchenFlag == "true") {
    RunningPrice = RunningPrice + KitchenPrice;
    KitchenPriceSelectedAlreadyFlag = true;
    document.getElementById("KitchenDisplay").textContent = KitchenPrice;
    document.getElementById("KitchenDisplayDiv").style.display = "flex";
  } else {
    document.getElementById("KitchenDisplayDiv").style.display = "none";
    if (KitchenPriceSelectedAlreadyFlag) {
      RunningPrice = RunningPrice - KitchenPrice;
      KitchenPriceSelectedAlreadyFlag = false;
    }
  }
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
});

document.getElementById("RequestDiscountDisplayDiv").style.display = "none";
var RequestDiscountFlag = "";
var RequestDiscountPriceSelectedAlreadyFlag = false;
document.getElementById("RequestDiscount").addEventListener("input", () => {
  RequestDiscountFlag = document.getElementById("RequestDiscount").value;
  if (RequestDiscountFlag == "true") {
    document.getElementById("TotalRun").textContent =
      RunningPrice * NumberOfDays;

    document.getElementById("DiscountValue").textContent =
      (DiscountAmount / 100) * (RunningPrice * NumberOfDays);

    document.getElementById("TotalRunSum").textContent =
      RunningPrice * NumberOfDays -
      (DiscountAmount / 100) * (RunningPrice * NumberOfDays);

    RequestDiscountPriceSelectedAlreadyFlag = true;

    document.getElementById("RequestDiscountDisplay").textContent =
      RequestDiscountPrice;
    document.getElementById("RequestDiscountDisplayDiv").style.display = "flex";
  } else {
    document.getElementById("RequestDiscountDisplayDiv").style.display = "none";
    document.getElementById("TotalRun").textContent =
      RunningPrice * NumberOfDays;

    document.getElementById("DiscountValue").textContent = 0;

    document.getElementById("TotalRunSum").textContent =
      RunningPrice * NumberOfDays;
    if (RequestDiscountPriceSelectedAlreadyFlag) {
      RunningPrice = RunningPrice - RequestDiscountPrice;
      RequestDiscountPriceSelectedAlreadyFlag = false;
    }
  }
});

document
  .getElementById("reservation-form")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form from submitting the traditional way
    const reservationData = {
      fullName: FullNameValue,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      idType: document.getElementById("IDType").value,
      checkIn: document.getElementById("checkin").value,
      checkOut: CheckoutDateValue,
      RoomService: document.getElementById("RoomService").value,
      kitchen: document.getElementById("Kitchen").value,
      roomType: document.getElementById("roomType").value,
      roomName: document.getElementById("roomName").value,
      specialRequests: document.getElementById("requests").value,
      RequestDiscount: RequestDiscountBoolean,
      cost: RunningPrice,
      days: NumberOfDays,
      imagePath: imageLocation,
      PartialPayment: 0,
    };

    // Store data in Firebase Realtime Database
    const newReservationRef = database.ref("RentReservations").push();
    newReservationRef
      .set(reservationData)
      .then(() => {
        alert("Reservation submitted successfully!");
        document.getElementById("reservation-form").reset();

        const reservationID = newReservationRef.key;
        const PaymentsPageLink =
          "../HTMLPages/LivePayments.html?ReservationID=" + reservationID;
        // After reservation submission, update the room status to "Unavailable"
        const roomName = reservationData.roomName;
        const roomRef = database.ref("rooms/" + roomName);

        roomRef
          .update({ Status: "Unavailable" })
          .then(() => {
            alert(
              "Reservation submitted and room status updated successfully!"
            );
            var ToPaymentsPage = document.getElementById("LivePayments").value;

            if (ToPaymentsPage == "true") {
              window.open(PaymentsPageLink, "_self");
            } else {
              window.history.back();
            }

            // location.reload();
          })
          .catch((error) => {
            console.error("Error updating room status: ", error);
          });
      })
      .catch((error) => {
        console.error("Error submitting reservation: ", error);
      });
  });
