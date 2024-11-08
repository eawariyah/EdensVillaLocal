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

const CloseButton = document.getElementById("close");
CloseButton.addEventListener("click", () => {
  window.history.back();
});

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const trackingForm = document.getElementById('trackingForm');
const snackbar = document.getElementById('snackbar');

function showSnackbar() {
  snackbar.style.display = 'block';
  setTimeout(() => {
    snackbar.style.display = 'none';
  }, 3000);
}

trackingForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const apartmentId = document.getElementById('apartmentId').value;
  const apartmentSnapshot = await database.ref('rooms/' + apartmentId).once('value');
  if (apartmentSnapshot.exists()) {
    alert('The room with the entered Apartment ID already exists!');
    trackingForm.reset();
    return;
  }
  
  const roomTypeName = document.getElementById('roomTypeInput').value;
  const roomDimensionsName = document.getElementById('roomDimensionsInput').value;
  const BalconyName = document.getElementById('Balcony').value;


  database.ref('rooms/' + apartmentId).set({
    roomType: roomTypeName,
    roomDimensions: roomDimensionsName,
    Balcony: BalconyName,
    Status: "Available",
  }).then(() => {
    console.log('Data submitted successfully!');
    trackingForm.reset();
    showSnackbar();
  }).catch((error) => {
    console.error('Error submitting data:', error);
  });
});
