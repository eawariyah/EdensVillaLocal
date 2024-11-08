const CloseButton = document.getElementById("close");
CloseButton.addEventListener("click", () => {
  window.history.back();
});

const LeftDivButton = document.getElementById("LeftDiv");
LeftDivButton.addEventListener("click", () => {
  window.open("../HTMLPages/ApproveRooms.html", "_self");
});

const RightDivButton = document.getElementById("RightDiv");
RightDivButton.addEventListener("click", () => {
  window.open("../HTMLPages/AddRooms.html", "_self");
});

const ManageRoomsButtonButton = document.getElementById("ManageRooms");
ManageRoomsButtonButton.addEventListener("click", () => {
  window.open("../HTMLPages/AllRooms.html", "_self");
});