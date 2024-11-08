function openSettings() {
  var drawer = document.getElementById("SettingsMenu");
  if (drawer.style.display === "block") {
    drawer.style.display = "none";
  } else {
    drawer.style.display = "block";
  }
}

function openStaff() {
  var drawer = document.getElementById("StaffMenu");
  if (drawer.style.display === "block") {
    drawer.style.display = "none";
  } else {
    drawer.style.display = "block";
  }
}

document.getElementById('searchInput').addEventListener('input', searchReservations);

function searchReservations() {
  window.open("../static/pages/HTMLPages/CheckoutPage.html", "_self");
}

const CreateReservationButton = document.getElementById("CreateReservationBtn");
CreateReservationButton.addEventListener("click", () => {
  window.open("../static/pages/HTMLPages/LiveReservations.html", "_self");
});

const CreateReservationButtonTwo = document.getElementById("CreateReservationBtnTwo");
CreateReservationButtonTwo.addEventListener("click", () => {
  window.open("../static/pages/HTMLPages/LiveReservations.html", "_self");
});

const ManageRoomsButton = document.getElementById("ManageRoomsBtn");
ManageRoomsButton.addEventListener("click", () => {
  window.open("../static/pages/HTMLPages/ManageRooms.html", "_self");
});

const SettingsPage = document.getElementById("SettingsPageOpen");
SettingsPage.addEventListener("click", () => {
  window.open("./htmlfiles/settingsPage.html", "_self");
});

const MainCalendarBtn = document.getElementById("MainCalendar");
MainCalendarBtn.addEventListener("click", () => {
  window.open("../static/pages/HTMLPages/WeekCalendar.html", "_self");
});


const StaffCalendarButton = document.getElementById("StaffCalendar");
StaffCalendarButton.addEventListener("click", () => {
  window.open("../static/pages/HTMLPages/ManageStaff.html", "_self");
});

const ViewHistoryButton = document.getElementById("ViewHistoryBtn");
ViewHistoryButton.addEventListener("click", () => {
  window.open("./htmlfiles/viewClientHistory.html", "_self");
});

const CheckOutButton = document.getElementById("CheckOutBtn");
CheckOutButton.addEventListener("click", () => {
  window.open("../static/pages/HTMLPages/CheckoutPage.html", "_self");
});

const Renew = document.getElementById("ExtendStay");
Renew.addEventListener("click", () => {
  window.open("./htmlfiles/renew.html", "_self");
});




const ManageWiFi = document.getElementById("ManageWifi");
ManageWiFi.addEventListener("click", () => {
  window.open("https://bill.cloudghana.com/user.php", "_blank");
});

const SocialMedia = document.getElementById("Insta");
SocialMedia.addEventListener("click", () => {
  window.open("https://www.instagram.com/edens_villa/", "_blank");
});

const Reviews = document.getElementById("Reviews");
Reviews.addEventListener("click", () => {
  window.open("https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/reviews.html?hotel_id=11698782&lang=xu&list=with_comments&review_score=&guest_type=&guest_country=&topics=&search_term=&ses=e770cebcc0d63a248de5e3f7545c6031", "_blank");
});

const Website = document.getElementById("Website");
Website.addEventListener("click", () => {
  window.open("https://edensvilla.com", "_blank");
});

const Bookings = document.getElementById("Bookings");
Bookings.addEventListener("click", () => {
  window.open("https://www.booking.com/", "_blank");
});

const GMaps = document.getElementById("gmaps");
GMaps.addEventListener("click", () => {
  window.open("https://www.google.com/maps/place/Eden's+Villa/@6.692692,-1.676091,17z/data=!3m1!4b1!4m9!3m8!1s0xfdb97604d7a121b:0x7e55fb4cf009f522!5m2!4m1!1i2!8m2!3d6.692692!4d-1.6735161!16s%2Fg%2F11sjy4syx0?entry=ttu&g_ep=EgoyMDI0MTAwMi4xIKXMDSoASAFQAw%3D%3D", "_blank");
});

// Initialize Firebase
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

// Initialize Firebase app and database reference
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
var CurrentPeople = 0;
var CheckedOutPeople = 0;

// Function to fetch all rooms and their statuses
function fetchRooms() {
  return new Promise((resolve, reject) => {
    database.ref('rooms').once('value')
      .then((snapshot) => {
        const rooms = [];
        snapshot.forEach((childSnapshot) => {
          const room = childSnapshot.val();
          rooms.push(room);
        });
        resolve(rooms);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
        reject(error);
      });
  });
}

// Function to count rooms based on their status
function countRooms(rooms) {
  let totalRooms = 0;
  let availableRooms = 0;
  let occupiedRooms = 0;
  let notReadyRooms = 0;

  rooms.forEach(room => {
    totalRooms++;
    if (room.Status === "Available") {
      availableRooms++;
    } else if (room.Status === "Unavailable") {
      occupiedRooms++;
    } else if (room.Status === "Cleaning") {
      notReadyRooms++;
    }
  });

  return { totalRooms, availableRooms, occupiedRooms, notReadyRooms };
}

// Function to update the room counts in the HTML
function updateRoomCounts() {
  fetchRooms()
    .then(rooms => {
      const { totalRooms, availableRooms, occupiedRooms, notReadyRooms } = countRooms(rooms);

      // Update the counts in the HTML
      document.getElementById('AllRooms').textContent = totalRooms;
      document.getElementById('AvailableRooms').textContent = availableRooms;
      document.getElementById('OccupiedRooms').textContent = occupiedRooms;
      document.getElementById('CleaningRooms').textContent = notReadyRooms;
    })
    .catch((error) => {
      console.error("Error updating room counts:", error);
    });
}

// Function to fetch all reservations and checkout count in a single Firebase read
function fetchReservationsAndCheckOuts() {
  return new Promise((resolve, reject) => {
    database.ref('reservations').once('value')
      .then((snapshot) => {
        const reservations = [];
        let checkOutCount = 0;
        
        snapshot.forEach((childSnapshot) => {
          const reservation = childSnapshot.val();
          reservations.push(reservation);

          // Count checkouts at the same time
          if (reservation.ReservationHistory && reservation.ReservationHistory[1] && reservation.ReservationHistory[1].checkout === true) {
            checkOutCount++;
          }
        });

        resolve({ reservations, checkOutCount });
      })
      .catch((error) => {
        console.error("Error fetching reservations and checkouts:", error);
        reject(error);
      });
  });
}



// Function to update the total number of bookings and checkouts
function updateCounts() {
  fetchReservationsAndCheckOuts()
    .then(({ reservations, checkOutCount }) => {
      // Update reservation count
      const totalBookings = reservations.length;
      const allBookingsElement = document.getElementById('AllBookings');
      const allCheckinElement = document.getElementById('AllCheckIn');

      if (allBookingsElement) {
        allBookingsElement.textContent = totalBookings;
        allCheckinElement.textContent = totalBookings;
        CurrentPeople = totalBookings; 
      }

      // Update checkout count
      const allCheckOutElement = document.getElementById('AllCheckOut');
      if (allCheckOutElement) {
        allCheckOutElement.textContent = checkOutCount;
        CheckedOutPeople = checkOutCount;
      }

      // Update current people in the building
      updateCurrentPeople();
    })
    .catch((error) => {
      console.error("Error updating counts:", error);
    });
}

function updateCurrentPeople() {
  const PresentPeople = document.getElementById('AllNow'); // Get the <h4> element
  const TotalPeopleInBuilding = CurrentPeople - CheckedOutPeople;
  PresentPeople.textContent = TotalPeopleInBuilding;
}

function fetchReservationsAndCountByMonth() {
  return new Promise((resolve, reject) => {
      database.ref('reservations').once('value')
          .then((snapshot) => {
              const monthCount = new Array(12).fill(0); // Initialize an array for 12 months

              snapshot.forEach((childSnapshot) => {
                  const reservation = childSnapshot.val();
                  const checkInDate = new Date(reservation.checkIn);
                  const month = checkInDate.getMonth(); // Get month (0 = January, 11 = December)
                  monthCount[month]++;
              });

              resolve(monthCount);
          })
          .catch((error) => {
              console.error("Error fetching reservations:", error);
              reject(error);
          });
  });
}

// Function to render the bar chart with labels
function renderBarChart(data) {
  const svg = document.getElementById('barChart');
  const svgWidth = svg.getAttribute('width');
  const svgHeight = svg.getAttribute('height') - 25; // Deduct height for x-axis labels
  const barWidth = svgWidth / data.length - 15; // Width of each bar based on data length
  const maxValue = Math.max(...data); // Find the maximum value for scaling
  const barGap = 10; // Gap between bars
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

  // Clear the previous bars
  svg.innerHTML = '';

  // Y-axis labels (frequency)
  const yLabels = [0, Math.floor(maxValue / 2), maxValue];
  yLabels.forEach((label, i) => {
      const yPosition = svgHeight - (label / maxValue) * svgHeight;

      // Add Y-axis label text
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('class', 'y-label');
      text.setAttribute('x', 5);
      text.setAttribute('y', yPosition + 20);
      text.textContent = label;
      svg.appendChild(text);
  });

  // Create Y-axis line
  const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxis.setAttribute('x1', 30);
  yAxis.setAttribute('y1', 5);
  yAxis.setAttribute('x2', 30);
  yAxis.setAttribute('y2', svgHeight);
  yAxis.setAttribute('stroke', '#000');
  svg.appendChild(yAxis);

  // Create bars and X-axis labels
  data.forEach((count, index) => {
      const barHeight = (count / maxValue) * svgHeight * 0.95; // Scale the bar height
      const barX = index * (barWidth + barGap) + 40; // Add spacing for y-axis
      const barY = svgHeight - barHeight;

      // Create a rectangle for each bar
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute('x', barX);
      rect.setAttribute('y', barY);
      rect.setAttribute('width', barWidth);
      rect.setAttribute('height', barHeight);
      rect.setAttribute('class', 'bar');

      // Append bar to SVG
      svg.appendChild(rect);

      // Create X-axis labels (Months)
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('class', 'x-label');
      text.setAttribute('x', barX + barWidth / 4);
      text.setAttribute('y', svgHeight + 20);
      text.textContent = months[index];
      svg.appendChild(text);
  });

  // Create X-axis line
  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxis.setAttribute('x1', 30);
  xAxis.setAttribute('y1', svgHeight);
  xAxis.setAttribute('x2', svgWidth * 0.95);
  xAxis.setAttribute('y2', svgHeight);
  xAxis.setAttribute('stroke', '#000');
  svg.appendChild(xAxis);
}

// Function to update the chart with the reservation data
function updateChart() {
  fetchReservationsAndCountByMonth()
      .then((monthCount) => {
          renderBarChart(monthCount); // Render chart with reservation counts per month
      })
      .catch((error) => {
          console.error("Error updating the chart:", error);
      });
}

// Fetch reservations from Firebase and draw the multi-line chart
function fetchReservationsAndDrawChart() {
  database.ref('reservations').once('value')
      .then(snapshot => {
          const reservations = [];
          snapshot.forEach(childSnapshot => {
              reservations.push(childSnapshot.val());
          });
          drawMultiLineChart(reservations);
      })
      .catch(error => {
          console.error("Error fetching reservations:", error);
      });
}

// Function to draw the multi-line chart
function drawMultiLineChart(reservations) {
  const svg = document.getElementById('multiLineChart');
  const svgWidth = 320;
  const svgHeight = 380;
  const padding = 50;
  
  const currentDate = new Date();  // Current date
  const yesterday = new Date();
  yesterday.setDate(currentDate.getDate() - 1); // Yesterday's date
  
  const todayData = [];
  const yesterdayData = [];
  
  reservations.forEach(reservation => {
      const checkInDate = new Date(reservation.checkIn);
      if (checkInDate.toDateString() === currentDate.toDateString()) {
          todayData.push(checkInDate);
      } else if (checkInDate.toDateString() === yesterday.toDateString()) {
          yesterdayData.push(checkInDate);
      }
  });

  const timeIntervals = [10, 14, 18, 23]; // Hours for the x-axis labels (10am, 2pm, 6pm, 11pm)
  
  // Function to map times to positions in the SVG
  function mapTimeToX(hour) {
      const xScale = svgWidth - padding * 2;
      return padding + (hour - 10) / (23 - 10) * xScale;
  }

  // Function to map number of customers (frequency) to y-axis position
  function mapFrequencyToY(frequency, maxFrequency) {
      const yScale = svgHeight - padding * 2;
      return svgHeight - padding - (frequency / maxFrequency) * yScale;
  }

  // Count reservations in the defined time intervals for yesterday and today
  function countReservationsInIntervals(data) {
    const counts = [0, 0, 0, 0, 0]; // Adding one more slot for early morning (before 10am)
    data.forEach(date => {
        const hour = date.getHours();
        if (hour < 10) counts[0]++; // Early morning, before 10am
        else if (hour >= 10 && hour < 14) counts[1]++; // 10am to 2pm
        else if (hour >= 14 && hour < 18) counts[2]++; // 2pm to 6pm
        else if (hour >= 18 && hour < 23) counts[3]++; // 6pm to 11pm
        else if (hour >= 23) counts[4]++; // After 11pm
    });
    return counts;
}


  const todayCounts = countReservationsInIntervals(todayData);
  const yesterdayCounts = countReservationsInIntervals(yesterdayData);
  const maxFrequency = Math.max(...todayCounts, ...yesterdayCounts);

  // Clear existing SVG content
  svg.innerHTML = '';

  // Draw axes
  svg.innerHTML += `<line class="axis" x1="${padding}" y1="${svgHeight - padding}" x2="${svgWidth - padding}" y2="${svgHeight - padding}"></line>`;
  svg.innerHTML += `<line class="axis" x1="${padding}" y1="${padding}" x2="${padding}" y2="${svgHeight - padding}"></line>`;

  // Draw x-axis labels (time intervals)
  timeIntervals.forEach((hour, index) => {
      const x = mapTimeToX(hour);
      svg.innerHTML += `<text x="${x - 10}" y="${svgHeight - padding + 20}" class="legend">${hour}:00</text>`;
  });

  // Draw y-axis labels (frequency)
  for (let i = 0; i <= maxFrequency; i++) {
      const y = mapFrequencyToY(i, maxFrequency);
      svg.innerHTML += `<text x="${padding - 30}" y="${y + 5}" class="legend">${i}</text>`;
  }

  // Function to create a polyline for a given dataset
  function createPolyline(data, colorClass) {
      let points = '';
      data.forEach((count, index) => {
          const x = mapTimeToX(timeIntervals[index]);
          const y = mapFrequencyToY(count, maxFrequency);
          points += `${x},${y} `;
      });
      return `<polyline class="line ${colorClass}" points="${points.trim()}"></polyline>`;
  }

  // Create lines for yesterday and today
  svg.innerHTML += createPolyline(yesterdayCounts, 'yesterday-line');
  svg.innerHTML += createPolyline(todayCounts, 'today-line');
  

  // Add legends for the lines
  svg.innerHTML += `<text x="${svgWidth - 120}" y="${padding - 20}" class="legend">Yesterday</text>`;
  svg.innerHTML += `<rect x="${svgWidth - 150}" y="${padding - 30}" width="20" height="5" fill="#ff4136"></rect>`;
  svg.innerHTML += `<text x="${svgWidth - 120}" y="${padding - 5}" class="legend">Today</text>`;
  svg.innerHTML += `<rect x="${svgWidth - 150}" y="${padding - 15}" width="20" height="5" fill="#0074d9"></rect>`;
}

// Initialize chart on page load
// document.addEventListener('DOMContentLoaded', fetchReservationsAndDrawChart);

let roomData = {}; // Store room data after fetching


function fetchRoomData1() {
  database.ref('rooms').once('value', (snapshot) => {

    snapshot.forEach((childSnapshot) => {
      const room = childSnapshot.val();

      // Group rooms by roomType
      if (!roomData[room.roomType]) {
        roomData[room.roomType] = [];
      }
      roomData[room.roomType].push(room);
      updateRoomColor(room.roomName, room.Status);
      

    });
  }).catch((error) => {
    console.error('Error fetching rooms:', error);
  });
}

function updateRoomColor(roomName, status) {
  const roomDiv = document.getElementById(roomName); // Get the room div by room name

  if (roomDiv) {
    if (status === "Available") {
      roomDiv.style.backgroundColor = 'green'; // Set background color to green
    } else if (status === "Unavailable") {
      roomDiv.style.backgroundColor = 'red'; // Set background color to red
    } else if (status === "Cleaning") {
      roomDiv.style.backgroundColor = 'black'; // Set background color to black
    } else {
      roomDiv.style.backgroundColor = 'gray'; // Default color if status is unknown
    }
  }
}

const Staff = ["Spendilove", "Veronica", "Eva"];

// Define the working days for each staff (0 = Sunday, 1 = Monday, etc.)
const schedule = {
    [Staff[0]]: [3, 4, 0], // Wed, Thurs, Sun
    [Staff[1]]: [1, 2, 3, 4, 5], // Mon-Fri
    [Staff[2]]: [1, 2, 5, 6] // Mon, Tue, Fri, Sat
};

// Get the current day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
const currentDate = new Date();
const currentDay = currentDate.getDay();

// Find out who's on duty today
function getStaffOnDuty() {
    let staffOnDuty = [];

    for (let staff in schedule) {
        if (schedule[staff].includes(currentDay)) {
            staffOnDuty.push(staff);
        }
    }

    return staffOnDuty;
}

// Display who is on duty today
function displayStaffOnDuty() {
    const staffOnDuty = getStaffOnDuty();

    // Get the div element to update
    const amountDetailsDiv = document.getElementById("AmountDetails");

    if (staffOnDuty.length === 0) {
        amountDetailsDiv.innerHTML = "<h2>No one is on duty today</h2>";
    } else if (staffOnDuty.length === 1) {
        amountDetailsDiv.innerHTML = `<h2>${staffOnDuty[0]} is on duty today</h2>`;
    } else {
        // Display all people on duty (max 2 as per your rule)
        let dutyMessage = `<h2>On duty today:</h2>`;
        dutyMessage += `<p>${staffOnDuty.join(' & ')}</p>`;
        amountDetailsDiv.innerHTML = dutyMessage;
    }
}

// Call the function to display the duty staff


// Call the function to update counts and room counts when the page loads
window.onload = function() {
  updateCounts();
  updateRoomCounts();
  updateChart();
  fetchReservationsAndDrawChart();
  fetchRoomData1();
  displayStaffOnDuty();
};
