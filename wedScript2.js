var firebaseConfig = {
  apiKey: "AIzaSyDA1iE622RXv-Wpd4WoigN_dIvOb6aELug",
  authDomain: "wedding-seat-management.firebaseapp.com",
  databaseURL: "https://wedding-seat-management-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wedding-seat-management",
  storageBucket: "wedding-seat-management.appspot.com",
  messagingSenderId: "17993585526",
  appId: "1:17993585526:web:0de7623e7f5ef69b862057",
  measurementId: "G-1WSNVXHHL6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Step 1: Retrieve custom identifier from the URL
//Made Changes to push it on the repo.

function fetchUserIdFromCustomIdentifier(customIdentifier) {
  const customIdentifiersRef = firebase.database().ref('customIdentifiers');

  return customIdentifiersRef.child(customIdentifier).once('value').then(function(snapshot) {
      return snapshot.val();  // You may want to return specific data based on your structure
  });
}

const urlParams = new URLSearchParams(window.location.search);
const customIdentifier = urlParams.get('user');

// Step 2: Access user data from Firebase
if (customIdentifier) {
  fetchUserIdFromCustomIdentifier(customIdentifier)
    .then(function(userId) {
      if (userId) {
        // Your existing code for fetching user data goes here
        firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
          if (snapshot.exists()) {
            var name = snapshot.val().name;
            var invitedBy = snapshot.val().invitedBy;
            var seatsAlloted = snapshot.val().seatsAlloted;

            document.getElementById('name').value = name;
            document.getElementById('invitedBy').value = invitedBy;
            document.getElementById('seatsAlloted').value = seatsAlloted;
          } else {
            console.log('No data available for this user.');
          }
        }).catch(function(error) {
          console.error(error);
        });

        // Your existing event listeners and functions go here
        var seatsConfirmedInput = document.getElementById('seatsConfirmed');
        var seatsAllotedInput = document.getElementById('seatsAlloted');

        seatsConfirmedInput.addEventListener('input', function(e) {
        var confirmedSeats = parseInt(seatsConfirmedInput.value);
        var seatsAlloted = parseInt(seatsAllotedInput.value);

        if (confirmedSeats < 1) {
          seatsConfirmedInput.value = 1;
        } else if (confirmedSeats > seatsAlloted) {
            seatsConfirmedInput.value = seatsAlloted;
        }
		});

      // Event listener for the 'attendingOrNot' field
      document.getElementById('attendingOrNot').addEventListener('change', function(e) {
        var attending = e.target.value;
        var seatsAlloted = document.getElementById('cont-seatsAlloted');
        var invitedBy = document.getElementById('cont-invitedBy');
        var seatsConfirmed = document.getElementById('cont-seatsConfirmed');

        if (attending === 'yes') {
            seatsAlloted.style.display = 'block';
            invitedBy.style.display = 'block';
            seatsConfirmed.style.display = 'block';
        } else {
            seatsAlloted.style.display = 'none';
            invitedBy.style.display = 'none';
            seatsConfirmed.style.display = 'none';
        }
      });

      // Event listener for the form submission
      document.getElementById('seatForm').addEventListener('submit', function(e) {
        e.preventDefault();
        var name = document.getElementById('name').value;
        var invitedBy = document.getElementById('invitedBy').value;
        var seatsAlloted = document.getElementById('seatsAlloted').value;
        var confirmedSeats = document.getElementById('seatsConfirmed').value;
        var attending = document.getElementById('attendingOrNot').value;

        if (!userId || !name || !invitedBy || !seatsAlloted || (attending === 'yes' && !confirmedSeats)) {
          alert('Please make sure there is a valid user and fill in all the required fields.');
          return;
        }
        // Set confirmedSeats to 0 if attending is 'no'
        if (attending === 'no') {
          confirmedSeats = 0;
        }
        firebase.database().ref('/users/' + userId).update({
            name: name,
            invitedBy: invitedBy,
            seatsAlloted: seatsAlloted,
            seatsConfirmed: confirmedSeats,
            attendingOrNot: attending
        }).then(function(){
          document.getElementById('seatForm').style.display = 'none';
          document.getElementById('seatNamesForm').style.display = 'block';
          return loadSecondForm(userId);
        }).then(function(){
          document.getElementById('seatNamesForm').style.display = 'none';
          displayConfirmationMessage(userId, attending);
        })

      });

      } else {
        console.log('Custom identifier not found in the database.');
        // Handle the case where the custom identifier is not found
      }
    })
    .catch(function(error) {
      console.error(error);
    });
} else {
  console.log('Custom identifier not found in the URL.');
  // Handle the case where the custom identifier is not found in the URL
}



// Function to display the confirmation message
function displayConfirmationMessage(userId, attending) {
  var confirmationMessage = document.getElementById('confirmationMessage');
  
  // Fetch the updated value from the database after a short delay
  setTimeout(function () {
    firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
      if (snapshot.exists()) {
        var updatedConfirmedSeats = snapshot.val().seatsConfirmed;
        var familyName = snapshot.val().customIdentifier;

        if (attending === 'yes') {
          confirmationMessage.innerHTML = `<img src="photos/lineDivider3-dark.png"></img> <p>Thank you for confirming your attendance!</p><p>We've reserved <strong style="font-weight:600;"> 
          ${updatedConfirmedSeats} seat/s </strong>just for you!</p><p>Get ready for an unforgettable celebration – 
          can't wait to see you there!</p><br><p>Kindly download using the button below; this will serve as your entry pass to the venue.
          </p> <p>If the download link isn't working for you, please take a screenshot of this message instead.</p> <p style="padding-top: 20px; font-weight:600;">#FinalLIEgettingMarriedToDEK</p><p>Reserved for: ${customIdentifier}</p><button id="captureButton" class="styledButton" data-html2canvas-ignore="true">Download Pass</button>
          `;
        
          document.getElementById('captureButton').addEventListener('click', function() {
            // Identify the element to capture
            const elementToCapture = document.getElementById('confirmationMessage');
      
            // Use html2canvas to capture the content
            html2canvas(elementToCapture, {
              exclude:['.styledButton'],
            }).then(function(canvas) {
               // Convert the canvas to a data URL
                const imageDataUrl = canvas.toDataURL('image/png');
        
                // Create a temporary link and trigger a download
                const downloadLink = document.createElement('a');
                downloadLink.href = imageDataUrl;
                downloadLink.download = 'fnmWeddingConfirmationPass.png';
                downloadLink.click();
              });
          });
        
        } else {
          confirmationMessage.innerHTML = `<p>We understand that you won't be able to make it this time.</p><p>Thank you for letting us know. We hope to see you soon!</p>`;
        }
      }
    }).catch(function (error) {
      console.error(error);
    });
  }, 1000); // Adjust the delay as needed
}

function loadSecondForm(userId) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('users/' + userId).once('value').then(function(snapshot) {
      if (snapshot.exists()) {
        var userName = snapshot.val().name;
        var numberOfSeats = snapshot.val().seatsConfirmed;

        document.getElementById('userName-display').value = userName;

        var names = [];

        for (var i = 0; i < numberOfSeats; i++) {
          var input = document.createElement('input');

          input.type = 'text';
          input.placeholder = 'Name of Guest ' + (i + 1);
          input.id = 'guest' + (i + 1);

          // Set custom CSS styles
          input.style.color = '#765830';
          input.style.fontFamily = 'Lora';

          // Use a closure to capture the correct value of i
          (function(index) {
            input.addEventListener('input', function(event) {
              names[index] = event.target.value;
            });
          })(i);

          // Get a reference to the button
          var submitSeat = document.getElementById('submitSeat');

          // Insert the input field before the button
          submitSeat.parentNode.insertBefore(input, submitSeat);
        }

        // Add an event listener to the submit button to push/post the names to the database
        document.getElementById('seatNamesForm').addEventListener('submit', function (e) {
          e.preventDefault();

          // Push/post the names to the 'seatNames' node in the database using the userId as the unique identifier
          firebase.database().ref('seatNames/' + userId).set({
            userId: userId,
            userName: snapshot.val().name,
            names: names
          }).then(function() {
            console.log('Names posted to the database');
            resolve(); // Resolve the promise when the operation is complete
          }).catch(function(error) {
            console.error("Error posting names to the database: ", error);
            reject(error); // Reject the promise if there's an error
          });
        });
      } else {
        console.log('User data not found');
        reject(new Error('User data not found'));
      }
    }).catch(function(error) {
      console.error("Error fetching user data: ", error);
      reject(error);
    });
  });
}

