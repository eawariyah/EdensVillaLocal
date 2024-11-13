const CloseButton = document.getElementById("close");
CloseButton.addEventListener("click", () => {
  window.history.back();
});
// Firebase configuration
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

// Populate staff, room, and item dropdowns
const staffMembers = ["Fadilatu", "Blessing", "Eva"];
const rooms = [
  "General Purpose",
  "EV5C10",
  "EV5D10",
  "EV5A05",
  "EV5B05",
  "EV5C09",
  "EV5D09",
  "EV4C08",
  "EV4D08",
  "EV4A04",
  "EV4B04",
  "EV4C07",
  "EV4D07",
  "EV3C06",
  "EV3D06",
  "EV3A03",
  "EV3B03",
  "EV3C05",
  "EV3D05",
  "EV2D04",
  "EV2C04",
  "EV2A02",
  "EV2B02",
  "EV2C03",
  "EV2D03",
  "EV1D02",
  "EV1C02",
  "EV1A01",
  "EV1B01",
  "EV1C01",
  "EV1D01",
];
const roomSelect = document.getElementById("room");
rooms.forEach((room) => {
  const option = document.createElement("option");
  option.value = room;
  option.textContent = room;
  roomSelect.appendChild(option);
});
const staffSelect = document.getElementById("staff");
staffMembers.forEach((staff) => {
  const option = document.createElement("option");
  option.value = staff;
  option.textContent = staff;
  staffSelect.appendChild(option);
});

// Load inventory from Firebase and populate items dropdown and table
function loadInventory() {
  database.ref("inventory").on("value", (snapshot) => {
    const inventoryData = snapshot.val();
    const itemSelect = document.getElementById("item");
    itemSelect.innerHTML =
      '<option value="" disabled selected>Select an item</option>';
    const expensesBody = document.getElementById("expenses-body");
    expensesBody.innerHTML = "";

    for (const [itemName, data] of Object.entries(inventoryData)) {
      // Populate item dropdown
      const option = document.createElement("option");
      option.value = itemName;
      option.textContent = itemName;
      itemSelect.appendChild(option);

      // Populate inventory table
      const row = expensesBody.insertRow();
      const itemNameCell = row.insertCell(0);
      const itemQuantityCell = row.insertCell(1);
      itemNameCell.textContent = itemName;
      itemQuantityCell.textContent = data.quantity;
    }
  });
}

// Update inventory quantity and record the expense
document.getElementById("expenses-form").addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form values
  const staff = document.getElementById("staff").value;
  const room = document.getElementById("room").value;
  const item = document.getElementById("item").value;
  const quantity = parseInt(document.getElementById("quantity").value);
  const date = document.getElementById("date").value;
  const specialRequests = document.getElementById("specialRequests").value;

  if (!staff || !room || !item || !quantity || !date) {
    alert("Please fill in all required fields.");
    return;
  }

  // Reference to the selected item in Firebase
  const itemRef = database.ref(`inventory/${item}`);

  // Retrieve current quantity, update it, and record the expense
  itemRef.once("value", (snapshot) => {
    const itemData = snapshot.val();

    if (itemData && itemData.quantity >= quantity) {
      const updatedQuantity = itemData.quantity - quantity;

      // Update inventory quantity in Firebase
      itemRef.update({ quantity: updatedQuantity });

      // Record the expense in a separate "expenses" entry
      const expenseData = {
        staff,
        room,
        item,
        quantity,
        date,
        specialRequests,
        timestamp: new Date().toISOString(),
      };
      database.ref("expenses").push(expenseData);

      // Update the displayed inventory table
      loadInventory();

      alert("Expense recorded successfully.");
      document.getElementById("expenses-form").reset();
    } else {
      alert("Insufficient inventory quantity for the selected item.");
    }
  });
});

// Load inventory when the page loads
window.onload = loadInventory;
