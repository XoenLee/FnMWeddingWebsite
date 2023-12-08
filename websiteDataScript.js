const admin = require('firebase-admin');
const serviceAccount = require('./wedding-seat-management-firebase-adminsdk-gi0gt-af72d4b065.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://wedding-seat-management-default-rtdb.asia-southeast1.firebasedatabase.app/',
});

const db = admin.database();

const csv = require('csv-parser');
const fs = require('fs');

let promises = [];

fs.createReadStream('./WebsiteData.csv')
  .pipe(csv())
  .on('data', (row) => {
    console.log(row);
    let promise = db.ref('users').push({
      name: row.Name,
      invitedBy: row['Invited by'],
      seatsAlloted: parseInt(row['Seats Alloted'], 10) || 0,
      seatsConfirmed: parseInt(row['Seats Confirmed'], 10) || 0,
      attendingOrNot: row['Attending Or Not'] || '',
    });
    promises.push(promise);
  })
  .on('end', () => {
    Promise.all(promises)
      .then(() => {
        console.log('Data import completed');
        process.exit();
      })
      .catch((error) => console.error('Error:', error));
  });