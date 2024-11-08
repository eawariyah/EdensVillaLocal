const CloseButton = document.getElementById("close");
  CloseButton.addEventListener("click", () => {
    window.history.back();
  });
const firebaseConfig = {
    apiKey: "AIzaSyAgXyyibV7I04EzHE_nhxdWGAOKaYWGp0E",
    authDomain: "fruitripenessdetectionsystem.firebaseapp.com",
    databaseURL: "https://fruitripenessdetectionsystem-default-rtdb.firebaseio.com",
    projectId: "fruitripenessdetectionsystem",
    storageBucket: "fruitripenessdetectionsystem.appspot.com",
    messagingSenderId: "103968652296",
    appId: "1:103968652296:web:79a1bfc1495062779165bd",
    measurementId: "G-7HR89GF4K9",
  };
  
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  
  const reservationTable = document.getElementById('clientTable');
  const reservationList = document.getElementById('clientList');
  document.getElementById('searchInput').addEventListener('input', searchReservations);


  
  function searchReservations() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    
    // Fetch rooms with "Unavailable" status
    database.ref('rooms').orderByChild('Status').equalTo('Unavailable').once('value', (roomsSnapshot) => {
        const unavailableRooms = [];
        roomsSnapshot.forEach((room) => {
            unavailableRooms.push(room.key.toLowerCase()); // Add room names to the array
        });

        // Now, fetch reservations and filter them by matching roomName
        database.ref('reservations').once('value', (snapshot) => {
            reservationList.innerHTML = ''; // Clear previous data

            snapshot.forEach((reservation) => {
                const reservationData = reservation.val();
                const roomName = reservationData.roomName.toLowerCase();
                
                if (unavailableRooms.includes(roomName)) { // Only show reservations for unavailable rooms
                    const reservationId = reservation.key.toLowerCase();
                    const fullName = reservationData.fullName.toLowerCase();
                    const checkIn = reservationData.checkIn.toLowerCase();
                    const checkOut = reservationData.checkOut.toLowerCase();
                    const roomType = reservationData.roomType.toLowerCase();
                    const specialRequests = reservationData.specialRequests.toLowerCase();
                    const kitchen = reservationData.kitchen.toLowerCase();
                    const idType = reservationData.idType.toLowerCase();
                    const phone = reservationData.phone.toLowerCase();
                    const email = reservationData.email.toLowerCase();

                    // Check if search query matches any field in the reservation
                    if (reservationId.includes(searchQuery) || fullName.includes(searchQuery) || checkIn.includes(searchQuery) || checkOut.includes(searchQuery) || roomType.includes(searchQuery) || specialRequests.includes(searchQuery) || kitchen.includes(searchQuery) || idType.includes(searchQuery) || phone.includes(searchQuery) || email.includes(searchQuery)) {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td><img src=${reservationData.imagePath} alt="Image 1" /></td>
                            <td>${reservationData.checkIn}</td>
                            <td>${reservationData.fullName}</td>
                            <td>${reservationData.phone}</td>
                            <td>${reservationData.roomName}</td>
                            <td>${reservationData.days}</td>        
                            <td>${reservationData.cost}</td>
                            <td>${reservationData.checkOut}</td>
                            <td>${reservationData.email}</td>
                            <td>${reservationData.idType}</td>
                            <td>${reservationData.LaundryService}</td>
                            <td>${reservationData.kitchen}</td>
                            <td>${reservationData.roomType}</td>
                            <td>${reservationData.specialRequests}</td>
                            <td>
                                <button onclick="checkoutClient('${reservation.key}')">CheckoutClient</button>
                            </td>
                        `;
                        reservationList.appendChild(row);
                    }
                }
            });
        });
    });
}

  
function displayReservations() {
    reservationList.innerHTML = ''; // Clear previous data

    // Fetch rooms with "Unavailable" status
    database.ref('rooms').orderByChild('Status').equalTo('Unavailable').once('value', (roomsSnapshot) => {
        const unavailableRooms = [];
        roomsSnapshot.forEach((room) => {
            unavailableRooms.push(room.key.toLowerCase()); // Add room names to the array
        });

        // Now fetch reservations and filter them by matching roomName
        database.ref('reservations').once('value', (snapshot) => {
            snapshot.forEach((reservation) => {
                const reservationData = reservation.val();
                const roomName = reservationData.roomName.toLowerCase();
                
                if (unavailableRooms.includes(roomName)) { // Only show reservations for unavailable rooms
                    const row = document.createElement('tr');
                    row.innerHTML = `
                       
                            <td><img src=${reservationData.imagePath} alt="Image 1" /></td>
                            <td>${reservationData.checkIn}</td>
                            <td>${reservationData.fullName}</td>
                            <td>${reservationData.phone}</td>
                            <td>${reservationData.roomName}</td>
                            <td>${reservationData.days}</td>        
                            <td>${reservationData.cost}</td>
                            <td>${reservationData.checkOut}</td>
                            <td>${reservationData.email}</td>
                            <td>${reservationData.idType}</td>
                            <td>${reservationData.LaundryService}</td>
                            <td>${reservationData.kitchen}</td>
                            <td>${reservationData.roomType}</td>
                            <td>${reservationData.specialRequests}</td>
                            <td>
                                <button onclick="checkoutClient('${reservation.key}')">CheckoutClient</button>
                            </td>    
                    `;
                    reservationList.appendChild(row);
                }
            });
        });
    });
}

function ExtendStay(reservationId) {
    // Prompt the user to enter the new checkout date in the format DD-MM-YYYY
    const newCheckoutDateInput = prompt(`Enter the new check-out date for reservation ${reservationId} in the format DD-MM-YYYY:`);

    // Validate the date format using a regular expression
    const datePattern = /^\d{2}-\d{2}-\d{4}$/;
    if (!datePattern.test(newCheckoutDateInput)) {
        alert("Wrong date input! Please enter the date in the format DD-MM-YYYY.");
        return;
    }

    // Convert the new date from DD-MM-YYYY to a Date object in the required format
    const [day, month, year] = newCheckoutDateInput.split('-');
    const newCheckoutDate = new Date(`${year}-${month}-${day}`);

    // Fetch reservation details from Firebase
    database.ref(`reservations/${reservationId}`).once('value', (reservationSnapshot) => {
        const reservationData = reservationSnapshot.val();
        const originalCheckoutDate = new Date(reservationData.checkOut);

        // Fetch prices from Firebase
        database.ref('Prices').once('value', (priceSnapshot) => {
            const prices = priceSnapshot.val();

            // Initialize the updated bill
            let UpdatedBill = 0;

            // Check if kitchen service is selected
            if (reservationData.kitchen === "true") {
                UpdatedBill += prices.KitchenPrice;
            }

            // Check if laundry service is selected
            if (reservationData.LaundryService === "true") {
                UpdatedBill += prices.LaundryServicePrice;
            }

            // Add the room type price to the updated bill
            switch (reservationData.roomType) {
                case "Standard":
                    UpdatedBill += prices.SingleStandardPrice;
                    break;
                case "Deluxe":
                    UpdatedBill += prices.DeluxePrice;
                    break;
                case "Family":
                    UpdatedBill += prices.FamilySuitePrice;
                    break;
                case "Executive":
                    UpdatedBill += prices.ExecutiveSuitePrice;
                    break;
                default:
                    alert("Invalid room type found in reservation!");
                    return;
            }

            // Calculate the number of additional days
            const timeDiff = newCheckoutDate - originalCheckoutDate; // Difference in milliseconds
            const extraDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert to days

            if (extraDays <= 0) {
                alert("New checkout date must be after the original checkout date.");
                return;
            }

            // Calculate the new cost for the extended stay
            const additionalCost = UpdatedBill * extraDays;

            // Update the reservation in Firebase
            database.ref(`reservations/${reservationId}`).update({
                checkOut: newCheckoutDate.toISOString(), // Store the new checkout date in ISO format
                cost: reservationData.cost + additionalCost // Update the cost with the additional amount
            })
            .then(() => {
                // Show success message
                alert(`Date and Cost Updated!\nNew Checkout Date: ${newCheckoutDate.toISOString()}\nAdditional Cost: ${additionalCost}`);
            })
            .catch((error) => {
                console.error("Error updating reservation:", error);
            });
        });
    });
}



function checkoutClient(reservationId) {
    // Fetch the reservation details based on reservationId
    database.ref(`reservations/${reservationId}`).once('value', (snapshot) => {
        const reservationData = snapshot.val();
        
        if (reservationData) {
            const roomName = reservationData.roomName;
            const checkInTime = reservationData.checkIn;
            
            // Update room status to "Cleaning"
            const roomRef = database.ref(`rooms/${roomName}`);
            roomRef.update({
                Status: "Cleaning"
            }).then(() => {
                alert(`Room ${roomName} status updated to "Cleaning".`);
                
                // Get the current date and time as the officialCheckout
                const officialCheckoutTime = new Date().toISOString();
                
                // Create a new entry in ReservationHistory under the reservationId
                const reservationHistoryRef = database.ref(`reservations/${reservationId}/ReservationHistory/1`);
                reservationHistoryRef.set({
                    checkIn: checkInTime,
                    officialCheckout: officialCheckoutTime,
                    checkout: true
                }).then(() => {
                    alert(`Checkout time recorded: ${officialCheckoutTime}`);
                }).catch((error) => {
                    console.error("Error updating reservation history: ", error);
                    alert("Failed to update checkout time. Please try again.");
                });

            }).catch((error) => {
                console.error("Error updating room status: ", error);
                alert("Failed to update room status. Please try again.");
            });
        } else {
            alert("Reservation not found.");
        }
    }).catch((error) => {
        console.error("Error fetching reservation: ", error);
        alert("Failed to fetch reservation details. Please try again.");
    });
}
  
  // Initial display of reservations
  displayReservations();
  