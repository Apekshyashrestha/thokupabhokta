// Run: node scripts/seedFirestore.js
// Seeds Firestore with current static data (products, events, reports)
// Requires: set FIREBASE_CONFIG env or edit below, and service account OR paste web config with write rules open.
// Easiest: keep Firestore in Test mode (allow read/write) while seeding, then lock down.

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, writeBatch } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "REPLACE_WITH_YOUR_API_KEY",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "thokupabhokta-demo",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.VITE_FIREBASE_APP_ID || "",
};

if (firebaseConfig.apiKey.includes("REPLACE")) {
  console.error("Paste real config in scripts/seedFirestore.js or set env vars VITE_FIREBASE_*");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Import static data directly (copy lists here to avoid ESM import issues)
const CATEGORIES = ["Agriculture and Machinery","Consumable Goods","Handicraft","Stationary"];
// For brevity, only titles/specs will be seeded; images stay as URLs (thokupabhokta.coop.np)
// In production, upload images to Firebase Storage and store storage URLs.

async function seed() {
  console.log("Seeding to project:", firebaseConfig.projectId);

  // Example: products (read from ../src/data/productsData.js manually if you want full)
  // Here we seed a minimal set; replace with full JSON import if needed.
  const batch = writeBatch(db);

  // Enquiries collection will be created lazily on first form submit (no seed needed)

  // Seed siteInfo doc
  await setDoc(doc(db, "siteInfo", "main"), {
    name: "प्रदेश नं. १ थोक उपभोक्ता विशिष्टीकृत सहकारी संघ लिमिटेड",
    englishName: "Province No. 1 Wholesale Consumer Specialized Cooperative Union Ltd.",
    phone: "023-585640",
    altPhone: "9814099804",
    email: "pradesh1thokupabhokta78@gmail.com",
    address: "Damak 9, Jhapa",
    web: "thokupabhokta.coop.np",
    establishedDate: "Ashar 19, 2078",
    regNo: "04/077/078",
  });

  // Seed reports
  const reports = [
    { id: 1, title: "AGM_Report_2081", publishedDate: "February 09, 2025", file: "https://thokupabhokta.coop.np/uploads/reports/Audit_Report_2080/81.pdf", size: "2.4 MB", type: "PDF" },
    { id: 2, title: "Audit Report 2080/81", publishedDate: "February 09, 2025", file: "https://thokupabhokta.coop.np/uploads/reports/Audit_Report_2080/81.pdf", size: "2.4 MB", type: "PDF" },
    { id: 3, title: "AGM_Report_2080", publishedDate: "January 18, 2024", file: "https://thokupabhokta.coop.np/uploads/reports/Audit_Report_2080/81.pdf", size: "3.1 MB", type: "PDF" },
    { id: 4, title: "Audit Report 079-80", publishedDate: "January 18, 2024", file: "https://thokupabhokta.coop.np/uploads/reports/Audit_Report_2080/81.pdf", size: "3.1 MB", type: "PDF" },
    { id: 5, title: "Audit Report 078-079", publishedDate: "March 12, 2023", file: "https://thokupabhokta.coop.np/uploads/reports/Audit_Report_2080/81.pdf", size: "2.8 MB", type: "PDF" },
    { id: 6, title: "Audit Report 077-078", publishedDate: "March 12, 2023", file: "https://thokupabhokta.coop.np/uploads/reports/Audit_Report_2080/81.pdf", size: "2.7 MB", type: "PDF" },
  ];
  for (const r of reports) {
    batch.set(doc(collection(db, "reports"), String(r.id)), r);
  }

  await batch.commit();
  console.log("Seeded siteInfo + reports. Add products/events via: node scripts/seedProductsEvents.js (full lists)");
  console.log("Done. Now set Firestore Rules to public read as per src/firebase.js comment.");
}

seed().catch((e) => { console.error(e); process.exit(1); });
