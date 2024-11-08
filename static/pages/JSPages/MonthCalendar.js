const MonthCalendarButton = document.getElementById("MonthCalendar");
MonthCalendarButton.addEventListener("click", () => {
  window.open("WeekCalendar.html", "_self");
});

const CloseButton = document.getElementById("close");
CloseButton.addEventListener("click", () => {
  window.history.back();
});

const calendarBody = document.getElementById('calendarBody');
const currentMonthLabel = document.getElementById('currentMonth');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');

let currentDate = new Date();

// Generate the calendar for the current month
function generateCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    // Clear the previous calendar
    calendarBody.innerHTML = '';

    // Get the first day and the total number of days in the current month
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Set the current month label
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    currentMonthLabel.innerText = `${monthNames[month]} ${year}`;

    let row = document.createElement('tr');

    // Create empty cells before the first day of the current month
    for (let i = 0; i < firstDay; i++) {
        const cell = document.createElement('td');
        cell.classList.add('empty');
        row.appendChild(cell);
    }

    // Generate the days of the current month
    for (let day = 1; day <= totalDays; day++) {
        if (row.children.length === 7) {
            calendarBody.appendChild(row);
            row = document.createElement('tr');
        }

        const cell = document.createElement('td');
        cell.innerText = day;

        // Highlight the current day
        const today = new Date();
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            cell.classList.add('current-day');
        }

        row.appendChild(cell);
    }

    // Fill the remaining cells of the last row with empty cells
    while (row.children.length < 7) {
        const cell = document.createElement('td');
        cell.classList.add('empty');
        row.appendChild(cell);
    }

    calendarBody.appendChild(row);
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

// Navigate to the previous month
prevMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate);
});

// Navigate to the next month
nextMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate);
});

// Initialize the calendar with the current month
generateCalendar(currentDate);
EventSection(2, 2, 'aqua');


