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

// Load inventory data from Firebase on page load
function loadInventory() {
  database.ref("inventory").once("value", (snapshot) => {
    const inventoryData = snapshot.val();
    const tableBody = document
      .getElementById("inventoryTable")
      .getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ""; // Clear existing rows

    if (inventoryData) {
      // Populate table with existing inventory data
      Object.keys(inventoryData).forEach((itemName, index) => {
        const item = inventoryData[itemName];
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><input type="text" value="${itemName}" /></td>
            <td><input type="number" value="${item.quantity}" /></td>
            <td><input type="number" value="${item.lastPrice}" /></td>
            <td><input type="text" value="${item.source}" /></td>
          `;

        tableBody.appendChild(row);
      });
    }
  });
}

// Add a new row to the table for new item entry
function addRow() {
  const tableBody = document
    .getElementById("inventoryTable")
    .getElementsByTagName("tbody")[0];
  const newRow = document.createElement("tr");

  newRow.innerHTML = `
      <td>${tableBody.rows.length + 1}</td>
      <td><input type="text" placeholder="Item Name" /></td>
      <td><input type="number" placeholder="Quantity" /></td>
      <td><input type="number" placeholder="Last Price" /></td>
      <td><input type="text" placeholder="Source" /></td>
    `;

  tableBody.appendChild(newRow);
}

// Save inventory data to Firebase
function saveInventory() {
  const tableBody = document
    .getElementById("inventoryTable")
    .getElementsByTagName("tbody")[0];
  const inventoryData = {};

  // Loop through table rows and collect data
  for (let i = 0; i < tableBody.rows.length; i++) {
    const row = tableBody.rows[i];
    const itemName = row.cells[1].querySelector("input").value;
    const quantity = row.cells[2].querySelector("input").value;
    const lastPrice = row.cells[3].querySelector("input").value;
    const source = row.cells[4].querySelector("input").value;

    if (itemName) {
      inventoryData[itemName] = {
        quantity: parseInt(quantity, 10) || 0,
        lastPrice: parseFloat(lastPrice) || 0,
        source: source || "",
        LastUpdated: new Date(Date.now()).toISOString(),
      };
    }
  }

  // Update Firebase with the new inventory data
  database.ref("inventory").set(inventoryData, (error) => {
    if (error) {
      alert("Failed to save data: " + error);
    } else {
      alert("Inventory saved successfully!");
    }
  });
}

// Load inventory when the page loads
window.onload = loadInventory;
