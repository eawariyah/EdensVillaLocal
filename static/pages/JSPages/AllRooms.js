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
//   document.getElementById('searchInput').addEventLizstener('input', searchReservations);

  const CloseButton = document.getElementById("close");
  CloseButton.addEventListener("click", () => {
    window.history.back();
  });
  
  function searchReservations() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
  
    database.ref('rooms').once('value', (snapshot) => {
      reservationList.innerHTML = ''; // Clear previous data
  
      snapshot.forEach((reservation) => {
        const reservationData = reservation.val();
        const reservationId = reservation.key.toLowerCase();
        const roomType = reservationData.roomType.toLowerCase();
        const roomName = reservationData.roomName.toLowerCase();
  
        // Convert non-string fields to string if needed
        const price = reservationData.price.toString(); // Convert number to string
        const Status = reservationData.Status.toLowerCase();
        const balcony = reservationData.balcony.toString(); // Convert boolean/number to string
        const dimensions = reservationData.dimensions.toString(); // Convert dimensions (if number) to string
  
        // Check if search query matches any of the fields
        if (
          reservationId.includes(searchQuery) ||
          roomType.includes(searchQuery) ||
          roomName.includes(searchQuery) ||
          price.includes(searchQuery) ||
          Status.includes(searchQuery) ||
          balcony.includes(searchQuery) ||
          dimensions.includes(searchQuery)
        ) {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${reservationData.roomType}</td>
            <td>${reservationData.roomName}</td>
            <td>${reservationData.price}</td>
            <td>${reservationData.Status}</td>
            <td>${reservationData.balcony}</td>        
            <td>${reservationData.dimensions}</td>
            <td>
              <button onclick="editReservation('${reservation.key}')">Edit</button>
              <button style="background-color: red; font-weight: bold;" onclick="deleteReservation('${reservation.key}')">Delete</button>
            </td>
          `;
          reservationList.appendChild(row);
        }
      });
    });
  }
  
  
  function displayReservations() {
      searchReservations();
  
      reservationList.innerHTML = ''; // Clear previous data
  
      database.ref('rooms').once('value', (snapshot) => {
          snapshot.forEach((reservation) => {
              const reservationData = reservation.val();
              const row = document.createElement('tr');
              row.innerHTML = `
                  
                            <td>${reservationData.roomType}</td>
                            <td>${reservationData.roomName}</td>
                            <td>${reservationData.price}</td>
                            <td>${reservationData.Status}</td>
                            <td>${reservationData.balcony}</td>        
                            <td>${reservationData.dimensions}</td>
                            
                            

                  <td>
                      <button onclick="editReservation('${reservation.key}')">Edit</button>
                      <button onclick="deleteReservation('${reservation.key}')">Delete</button>
                  </td>
              `;
              reservationList.appendChild(row);
          });
      });
  }
  
  function editReservation(reservationId) {
      const newFullName = prompt(`Enter new full name for reservation ${reservationId}:`);
      const newCheckin = prompt(`Enter new check-in date for reservation ${reservationId}:`);
      const newCheckout = prompt(`Enter new check-out date for reservation ${reservationId}:`);
  
      if (newFullName !== null && newCheckin !== null && newCheckout !== null) {
          // Update the reservation details in the database
          database.ref(`reservations/${reservationId}`).update({
              fullName: newFullName,
              checkIn: newCheckin,
              checkOut: newCheckout,
          }).then(() => {
              alert(`Reservation updated successfully for ${reservationId}`);
              displayReservations();
          }).catch((error) => {
              console.error('Error updating reservation:', error);
              alert('An error occurred while updating the reservation. Please try again.');
          });
      }
  }
  
  function deleteReservation(reservationId) {
      if (confirm(`Are you sure you want to delete reservation ${reservationId}?`)) {
          // Remove the reservation from the database
          database.ref(`reservations/${reservationId}`).remove().then(() => {
              alert(`Reservation ${reservationId} deleted successfully`);
              displayReservations();
          }).catch((error) => {
              console.error('Error deleting reservation:', error);
              alert('An error occurred while deleting the reservation. Please try again.');
          });
      }
  }
  
  // Initial display of reservations
  displayReservations();
  
  function exportToExcel() {
    // Fetch all reservation data from Firebase
    database.ref('rooms').once('value', (snapshot) => {
        const reservations = [];
        
        snapshot.forEach((reservation) => {
            const reservationData = reservation.val();
            reservations.push({
                roomType: reservationData.roomType,
                roomName: reservationData.roomName,
                price: reservationData.price,
                Status: reservationData.Status,
                balcony: reservationData.balcony,
                dimensions: reservationData.dimensions,
                
            });
        });

        // Convert the data to worksheet
        const worksheet = XLSX.utils.json_to_sheet(reservations);

        // Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reservations");

        // Export the workbook as an Excel file
        XLSX.writeFile(workbook, "RoomsData.xlsx");
    });
}
