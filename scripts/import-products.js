const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
// You need to download a service account key from Firebase Console
// Project Settings -> Service Accounts -> Generate new private key
// Save the JSON file as 'serviceAccountKey.json' in the scripts folder

// If you don't have a service account, you can also use the Firestore REST API,
// but this method is simpler.

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function importProducts() {
  const productsPath = path.join(__dirname, '..', 'products.json');
  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

  for (const [docId, product] of Object.entries(productsData)) {
    await db.collection('products').doc(docId).set({
      ...product,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`✅ Imported: ${docId}`);
  }
  console.log('🎉 All products imported successfully!');
}

importProducts().catch(console.error);