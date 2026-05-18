const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDTjQP2x6qD4ucRAHMC6MwsXgBRPI5t-Gk",
  authDomain: "starbackscoffee.firebaseapp.com",
  projectId: "starbackscoffee",
  storageBucket: "starbackscoffee.firebasestorage.app",
  messagingSenderId: "455887716881",
  appId: "1:455887716881:web:f16aea87372c4d084827b0"
};

const products = [
  { name: "Morning Sunrise Espresso", price: 120, description: "A rich, full-bodied espresso with caramel undertones to start your day right.", imageUrl: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=300", category: "hot", stock: 50, isAvailable: true },
  { name: "Creamy Latte", price: 145, description: "Our signature latte with organic honey and a dash of cinnamon for a sweet, spicy kick.", imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300", category: "hot", stock: 45, isAvailable: true },
  { name: "Caramel Macchiato", price: 155, description: "Espresso with steamed milk, vanilla syrup, and caramel drizzle for a perfect balance.", imageUrl: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=300", category: "hot", stock: 40, isAvailable: true },
  { name: "Mocha Supreme", price: 165, description: "Rich chocolate meets our finest espresso, topped with whipped cream and chocolate shavings.", imageUrl: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=300", category: "hot", stock: 35, isAvailable: true },
  { name: "Special Cappuccino", price: 135, description: "Espresso, steamed milk, and milk foam – a timeless classic.", imageUrl: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=300", category: "hot", stock: 60, isAvailable: true },
  { name: "Urban Brew", price: 175, description: "Bold simplicity in every sip – the Americano awakens your senses.", imageUrl: "https://images.unsplash.com/photo-1551030173-122aabc4489c?w=300", category: "hot", stock: 30, isAvailable: true },
  { name: "Iced Caramel Macchiato", price: 165, description: "Espresso with vanilla syrup, milk, and caramel drizzle over ice.", imageUrl: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=300", category: "cold", stock: 50, isAvailable: true },
  { name: "Iced Mocha", price: 175, description: "Espresso with chocolate sauce and milk, served over ice.", imageUrl: "https://images.unsplash.com/photo-1520979537174-9b0f08fef0e3?w=300", category: "cold", stock: 45, isAvailable: true },
  { name: "Iced Coffee", price: 145, description: "Freshly brewed coffee served chilled and lightly sweetened over ice.", imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300", category: "cold", stock: 60, isAvailable: true },
  { name: "Cold Brew", price: 155, description: "Slow-steeped coffee for a smooth, naturally sweet taste.", imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300", category: "cold", stock: 40, isAvailable: true },
  { name: "Nitro Cold Brew", price: 185, description: "Cold brew infused with nitrogen for a smooth, cascading effect.", imageUrl: "https://images.unsplash.com/photo-1568649929103-28ff3aca707a?w=300", category: "cold", stock: 35, isAvailable: true },
  { name: "Iced Americano", price: 145, description: "Espresso shots topped with cold water and served over ice.", imageUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a9d5f2?w=300", category: "cold", stock: 55, isAvailable: true },
  { name: "Caramel Ribbon Crunch", price: 195, description: "Blended coffee with caramel sauce, whipped cream, and caramel drizzle.", imageUrl: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=300", category: "frappe", stock: 40, isAvailable: true },
  { name: "Mocha Cookie Crumble", price: 185, description: "Blended coffee with chocolate sauce and cookie crumbles, topped with whipped cream.", imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300", category: "frappe", stock: 35, isAvailable: true },
  { name: "Matcha Cream", price: 175, description: "Blended matcha green tea with milk and whipped cream.", imageUrl: "https://images.unsplash.com/photo-1600442715860-6be9e0b5d1e3?w=300", category: "frappe", stock: 30, isAvailable: true },
  { name: "Chocolate Chip", price: 165, description: "Blended coffee with chocolate chips and whipped cream.", imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300", category: "frappe", stock: 45, isAvailable: true },
  { name: "Strawberry Cream", price: 175, description: "Blended strawberry with milk and whipped cream.", imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300", category: "frappe", stock: 40, isAvailable: true },
  { name: "Chocolate Mocha", price: 175, description: "Blended chocolate with coffee and whipped cream.", imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300", category: "frappe", stock: 38, isAvailable: true },
];

async function uploadProducts() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log('Uploading products to Firebase...');
  for (const product of products) {
    try {
      await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`✅ ${product.name}`);
    } catch (error) {
      console.error(`❌ ${product.name}:`, error);
    }
  }
  console.log('Done! All products uploaded.');
  process.exit(0);
}

uploadProducts();