const admin = require('firebase-admin');
const fs = require('fs');
const csvWriter = require('csv-write-stream');

// Replace with the path to your service account key JSON file
const serviceAccount = require('./wedding-seat-management-firebase-adminsdk-gi0gt-af72d4b065.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://wedding-seat-management-default-rtdb.asia-southeast1.firebasedatabase.app/',
});

const db = admin.database();

const path = '/'; // Replace with the actual path
const outputFileName = 'output.csv';

const writer = csvWriter();
const writableStream = fs.createWriteStream(outputFileName);

writer.pipe(writableStream);

function fetchDataAndWriteToCSV() {
  const ref = db.ref(path);

  ref.once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      writer.write(data);
    });

    writer.end();
    console.log('CSV file created successfully.');
    process.exit();
  });
}

fetchDataAndWriteToCSV();
