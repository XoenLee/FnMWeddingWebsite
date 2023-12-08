const admin = require('firebase-admin');
const serviceAccount = require('./wedding-seat-management-firebase-adminsdk-gi0gt-af72d4b065.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://wedding-seat-management-default-rtdb.asia-southeast1.firebasedatabase.app/', // Replace with your Firebase project URL
});

const db = admin.database();
const usersRef = db.ref('users');
const customIdentifiersRef = db.ref('customIdentifiers');

// Function to create a custom identifier from the user's name
function createCustomIdentifier(name) {
  return name.replace(/\s+/g, ''); // This example removes spaces from the name
}

// Fetch existing users from the 'users' node
usersRef.once('value')
  .then(snapshot => {
    snapshot.forEach(userSnapshot => {
      const userId = userSnapshot.key;
      const userData = userSnapshot.val();

      // Generate a custom identifier based on the user's name
      const customIdentifier = createCustomIdentifier(userData.name);

      // Map the custom identifier to the user ID in the 'customIdentifiers' node
      customIdentifiersRef.child(customIdentifier).set(userId);

      console.log(`Custom Identifier: ${customIdentifier}, User ID: ${userId}`);
    });
  })
  .catch(error => {
    console.error('Error fetching users:', error);
  });
