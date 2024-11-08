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

  const CloseButton = document.getElementById("close");
  CloseButton.addEventListener("click", () => {
    window.history.back();
  });

// Function to display rooms with "cleaning" status
function displayCleaningRooms() {
    const tableBody = document.querySelector('#cleaningRoomsTable tbody');
    tableBody.innerHTML = ''; // Clear previous data

    // Fetch all rooms from Firebase
    database.ref('rooms').once('value', (snapshot) => {
        snapshot.forEach((room) => {
            const roomData = room.val();
            const roomId = room.key;

            // Check if the room's status is "cleaning"
            if (roomData.Status.toLowerCase() === 'cleaning') {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${roomData.roomType}</td>
                    <td>${roomData.roomName}</td>
                    <td>${roomData.price}</td>
                    <td>${roomData.Status}</td>
                    <td><button onclick="setRoomAvailable('${roomId}')">Set Available</button></td>
                `;
                tableBody.appendChild(row);
            }
        });
    });
}

// Function to set a room's status to "Available"
function setRoomAvailable(roomId) {
    database.ref('rooms/' + roomId).update({
        Status: 'Available'
    }).then(() => {
        alert(`Room ${roomId} status updated to Available`);
        displayCleaningRooms(); // Refresh the table after update
    }).catch((error) => {
        console.error('Error updating room status:', error);
        alert('An error occurred while updating the room status.');
    });
}

// Call the function to display rooms in "cleaning" status when the page loads
displayCleaningRooms();
