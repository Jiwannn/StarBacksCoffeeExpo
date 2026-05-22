import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, limit } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDTjQP2x6qD4ucRAHMC6MwsXgBRPI5t-Gk",
  authDomain: "starbackscoffee.firebaseapp.com",
  projectId: "starbackscoffee",
  storageBucket: "starbackscoffee.firebasestorage.app",
  messagingSenderId: "455887716881",
  appId: "1:455887716881:web:f16aea87372c4d084827b0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const collections = [
  {
    name: 'users',
    seed: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@starbacks.com',
      role: 'admin',
      phone: '+639000000000',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    name: 'products',
    seed: {
      name: 'Sample Coffee',
      price: 100,
      description: 'A sample coffee product.',
      imageUrl: 'https://via.placeholder.com/300',
      category: 'hot',
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    name: 'orders',
    seed: {
      userId: 'init',
      items: [],
      subtotal: 0,
      tax: 0,
      deliveryFee: 0,
      total: 0,
      status: 'pending',
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderNumber: 'SB-INIT',
      shippingAddress: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    name: 'carts',
    seed: {
      userId: 'init',
      items: [],
      updatedAt: new Date(),
    },
  },
  {
    name: 'payments',
    seed: {
      orderId: 'init',
      userId: 'init',
      amount: 0,
      method: 'cod',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    name: 'notifications',
    seed: {
      userId: 'init',
      title: 'Welcome to StarBacks Coffee!',
      message: 'Thank you for joining us.',
      type: 'system',
      isRead: false,
      createdAt: new Date(),
    },
  },
  {
    name: 'reviews',
    seed: {
      userId: 'init',
      productId: 'init',
      orderId: 'init',
      userName: 'Init User',
      rating: 5,
      comment: 'Great coffee!',
      createdAt: new Date(),
    },
  },
];

async function initCollections() {
  console.log('🔥 Initializing Firestore collections...\n');

  for (const col of collections) {
    try {
      const q = query(collection(db, col.name), limit(1));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        await addDoc(collection(db, col.name), col.seed);
        console.log(`✅ Created collection: ${col.name}`);
      } else {
        console.log(`⏭️  Skipped (already exists): ${col.name}`);
      }
    } catch (error) {
      console.error(`❌ Failed to create ${col.name}:`, error);
    }
  }

  console.log('\n🎉 Done! All collections are ready in Firebase.');
  process.exit(0);
}

initCollections();
