const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./wedding-seat-management-firebase-adminsdk-gi0gt-af72d4b065.json'); // Replace with the path to your serviceAccountKey.json file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://wedding-seat-management-default-rtdb.asia-southeast1.firebasedatabase.app/', // Replace with your Firebase database URL
});

// Reference to the database
const database = admin.database();

// Add a new customIdentifier entry
const newEntry = {
  AldeaRobertFamily: '-NewCustomIdentifierValue', // Replace with your new entry details
};

// Specify the path where you want to add the new entry
const path = '/CustomIdentifiers'; // Replace with the desired path in your database

// Push the new entry to the specified path
database.ref(path).push(newEntry)
  .then((snapshot) => {
    console.log('New entry added successfully with key:', snapshot.key);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error adding new entry:', error);
    process.exit(1);
  });
