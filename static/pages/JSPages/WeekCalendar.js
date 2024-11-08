const MonthCalendarButton = document.getElementById("MonthCalendar");
MonthCalendarButton.addEventListener("click", () => {
  window.open("MonthCalendar.html", "_self");
});

const CloseButton = document.getElementById("close");
CloseButton.addEventListener("click", () => {
  window.history.back();
});

// Function to format time in 12-hour format
function formatTime(hours, minutes) {
  const AMPM = hours >= 12 ? 'PM' : 'AM';
  let hour = hours % 12;
  hour = hour ? hour : 12; // convert '0' hour to '12'
  const minute = minutes < 10 ? '0' + minutes : minutes;
  return `${hour}:${minute} ${AMPM}`;
}

function getCurrentWeek() {
  // Get the current date and day of the week (0-6, 0=Sunday, 6=Saturday)
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday

  // Map JavaScript's dayOfWeek (0-6) to your table's columns (Monday is column 2, Sunday is column 8)
  const dayToColumnMap = {
    0: 8, // Sunday is the 8th column
    1: 2, // Monday is the 2nd column
    2: 3, // Tuesday is the 3rd column
    3: 4, // Wednesday is the 4th column
    4: 5, // Thursday is the 5th column
    5: 6, // Friday is the 6th column
    6: 7  // Saturday is the 7th column
  };

  // Get the column index for the current day
  const currentDayColumn = dayToColumnMap[dayOfWeek];

  // Set the width for the current day's header (th) and data cells (td)
  const headerCells = document.querySelectorAll(`th:nth-child(${currentDayColumn})`);
  headerCells.forEach(cell => {
      cell.style.minWidth = '150px';
  });

  const dataCells = document.querySelectorAll(`td:nth-child(${currentDayColumn})`);
  dataCells.forEach(cell => {
      cell.style.minWidth = '150px';
  });

  // Set the current week range in the header
  const startOfWeek = new Date(today);
  const endOfWeek = new Date(today);

  // Calculate the start of the week (Monday)
  startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Start of week is Monday
  endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week is Sunday

  // Format the start and end dates
  const options = { month: 'long', day: 'numeric' };
  const formattedStart = startOfWeek.toLocaleDateString('en-US', options);
  const formattedEnd = endOfWeek.toLocaleDateString('en-US', options);

  // Display the current week range
  document.getElementById('CurrentWeek').innerText = `${formattedStart} - ${formattedEnd}`;
}

// Function to generate 30-minute intervals
function generateTimeSlots() {
  const timeSlots = [];
  const periods = ['AM', 'PM'];

  for (let hour = 0; hour < 24; hour++) {
    const period = periods[Math.floor(hour / 12)];
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Converts 0 hour to 12

    // Add full hour label
    timeSlots.push(`${formattedHour} ${period}`);

    // Add empty string for the half-hour
    timeSlots.push('');
  }

  return timeSlots;
}

console.log(generateTimeSlots());


// Function to generate the calendar rows
function generateCalendar() {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = generateTimeSlots();
  const calendarBody = document.getElementById('calendarBody');

  timeSlots.forEach((timeSlot) => {
      const row = document.createElement('tr');
      const timeCell = document.createElement('td');
      timeCell.textContent = timeSlot;
      row.appendChild(timeCell);

      // Create empty cells for each day of the week
      daysOfWeek.forEach(() => {
          const cell = document.createElement('td');
          row.appendChild(cell);
      });

      calendarBody.appendChild(row);
  });
}

function EventSection(a, b, c) {
  // Select the table row at position 'a'
  const row = document.querySelector(`tr:nth-child(${a})`);
  
  // If the row exists, select the column (td) at position 'b' in that row
  if (row) {
      const cell = row.querySelector(`td:nth-child(${b})`);
      
      // If the cell exists, set its background color to the specified color 'c'
      if (cell) {
          cell.style.backgroundColor = c;
      }
  }
}


// Call the function to generate the calendar on page load
generateCalendar();
getCurrentWeek();
EventSection(2, 2, 'aqua');
