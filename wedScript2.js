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
const urlParams = new URLSearchParams(window.location.search);
const customIdentifier = urlParams.get('user');
var userId = customIdentifier;

// Step 2: Access user data from Firebase
if (customIdentifier) {
  const customIdentifiersRef = firebase.database().ref('customIdentifiers');
  customIdentifiersRef.child(customIdentifier).once('value')
    .then(function(snapshot) {
      if (snapshot.exists()) {
        const userId = snapshot.val();
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

      // Function to display the confirmation message
      function displayConfirmationMessage(userId, attending) {
        var confirmationMessage = document.getElementById('confirmationMessage');
        
        // Fetch the updated value from the database after a short delay
        setTimeout(function () {
          firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
            if (snapshot.exists()) {
              var updatedConfirmedSeats = snapshot.val().seatsConfirmed;

              if (attending === 'yes') {
                confirmationMessage.innerHTML = `<img src="photos/lineDivider1.png"></img> <p>Thank you for confirming your attendance!</p><p>We've reserved <strong style="font-weight:600;"> 
                ${updatedConfirmedSeats} seats </strong>just for you!</p><p>Get ready for an unforgettable celebration – 
                can't wait to see you there!</p><br><p>Kindly download using the button below; this will serve as your entry pass to the venue.
                </p> <p style="padding-top: 20px; font-weight:600;">#FinalLIEgettingMarriedToDEK</p><button id="captureButton" class="styledButton" data-html2canvas-ignore="true">Download Pass</button>
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

      // Event listener for the form submission
      document.getElementById('seatForm').addEventListener('submit', function(e) {
        e.preventDefault();
        var userId = snapshot.val();
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
        });
        // Optional: You can hide the form or take other actions after submission
        document.getElementById('seatForm').style.display = 'none';

        // Call the function to display the confirmation message
        displayConfirmationMessage(userId, attending);
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

   
