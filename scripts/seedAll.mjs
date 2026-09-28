import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
const cfg = {
  apiKey: 'AIzaSyB_KbPl7BnMxhhZIy3DsqlJi_EqgeErHoc',
  authDomain: 'thokupabhokta.firebaseapp.com',
  projectId: 'thokupabhokta',
  storageBucket: 'thokupabhokta.firebasestorage.app',
  messagingSenderId: '601287615681',
  appId: '1:601287615681:web:f91e6091f38452e2296040'
};
const app = initializeApp(cfg);
const db = getFirestore(app);

// Products - minimal version with external image URLs (use thokupabhokta uploads)
const products = [
  {id:1,title:"Alpine Swagatam Pure Mustard Oil 5ltr",category:"Consumable Goods",image:"https://thokupabhokta.coop.np/uploads/products/66190cb6656fe.jpg",gallery:["https://thokupabhokta.coop.np/uploads/products/66190cb6656fe.jpg"],specs:"Name: Mustard Oil, Size: 5 ltr., Source: Mustard Seed, Farming Area: Hoklabari, 100% Pure Oil",shortDesc:"100% pure cold-pressed mustard oil — no adulteration, packed with health benefits for heart, immunity & daily cooking.",tags:["Agriculture","Mustard","Oil","Health","Natural"],description:"Experience the purity and goodness of nature with Alpine Swagatam Mustard Oil, where no adulteration occurs. Our 100% pure mustard oil is packed with incredible health benefits:\n• Cardioprotective — supports heart health\n• Reduces cough & colds, antibacterial & antifungal\n• Strengthens red blood cells, boosts immunity"},
  {id:2,title:"Alpine Honey",category:"Consumable Goods",image:"https://thokupabhokta.coop.np/uploads/products/6614fab02f453.jpg",gallery:["https://thokupabhokta.coop.np/uploads/products/6614fab02f453.jpg"],specs:"Source: Mustard/Raw | Size: 1000 Gram and 500 Gram, 100% Raw Natural Honey",shortDesc:"Raw natural honey — pure forest & mustard source, unprocessed and rich in natural enzymes.",tags:["Honey","Health","Natural"],description:"It has many uses in day-to-day life:\n• Used for medicinal purposes and on burns\n• Used to make food & natural sweetener\n• Helps improve memory & immunity"},
  {id:3,title:"Alpine Swagatam Tea",category:"Consumable Goods",image:"https://thokupabhokta.coop.np/uploads/products/66166c5a2795b.jpg",gallery:["https://thokupabhokta.coop.np/uploads/products/66166c5a2795b.jpg"],specs:"Sources: Nepal's Cooperatives and Assam, Brand: Alpine Swagatam, Weight: 30 Gram, 200 Gram and 500 Gram",shortDesc:"CTC black tea — crush, tear, curl processed for strong colour & aroma, blended from Ilam & Assam.",tags:["CTC Tea","Nepal","Ilam"],description:"CTC tea refers to crush, tear, curl — a method where black tea leaves are run through cylindrical rollers with sharp teeth that cut, tear and curl leaves into small hard pellets."},
  {id:4,title:"Wine Glass with Anti Small",category:"Handicraft",image:"https://thokupabhokta.coop.np/uploads/products/644128504018d.jpg",gallery:["https://thokupabhokta.coop.np/uploads/products/644128504018d.jpg"],specs:"Name: Wine Glass with Anti Small, Traditional handcrafted Nepalese glassware",shortDesc:"Handcrafted wooden & glass art — antiqued wine glass set, perfect for décor & gifting.",tags:["Handicraft","Glassware"],description:"Authentic Nepalese handicraft — curated wood with brass accent, hand-finished."},
  {id:5,title:"Wine Glass with Anti",category:"Handicraft",image:"https://thokupabhokta.coop.np/uploads/products/644127a236813.jpg",gallery:["https://thokupabhokta.coop.np/uploads/products/644127a236813.jpg"],specs:"Name: Wine Glass with Anti , Traditional handcrafted Nepalese glassware",shortDesc:"Antique-finish wine glass — elegant stemware with rustic charm.",tags:["Handicraft"],description:"Traditional handcrafted Nepalese glassware with antique finish."},
  {id:6,title:"Shiv Family",category:"Handicraft",image:"https://thokupabhokta.coop.np/uploads/products/644126c094671.jpg",gallery:["https://thokupabhokta.coop.np/uploads/products/644126c094671.jpg"],specs:"Name: Shiv Family, Handcrafted religious metallic and wood statue",shortDesc:"Handcrafted religious brass & wood statue — Shiv Parivar with fine detailing.",tags:["Brass","Religious"],description:"Finely sculpted Shiv Parivar (Shiva family) in brass with antique polish."},
  {id:7,title:"Shiv Ling with Sesh Nag",category:"Handicraft",image:"https://thokupabhokta.coop.np/uploads/products/64412638992c5.jpg",gallery:["https://thokupabhokta.coop.np/uploads/products/64412638992c5.jpg"],specs:"Name: Shiv Ling with Sesh Nag, Carved brass and marble idol",shortDesc:"Carved brass & marble Shiv Ling with Shesh Nag — temple-grade finish.",tags:["Brass"],description:"Carved brass and marble idol — sacred Shiv Ling with Shesh Nag hood."},
  {id:8,title:"Chaturbhuj Shiv Ling With Sesh Nag",category:"Handicraft",image:"https://thokupabhokta.coop.np/uploads/products/64412532b32ad.jpg",gallery:["https://thokupabhokta.coop.np/uploads/products/64412532b32ad.jpg"],specs:"Name: Chaturbhuj Shiv Ling With Sesh Nag, Antique finished handicraft",shortDesc:"Antique-finished Chaturbhuj Shiv Ling — heritage collector's piece.",tags:["Heritage"],description:"Antique finished handicraft — Chaturbhuj form with intricate carving."},
  {id:9,title:"Alpine Premium CTC Tea 200G",category:"Consumable Goods",image:"https://thokupabhokta.coop.np/uploads/products/643fbb44ed544.jpg",gallery:["https://thokupabhokta.coop.np/uploads/products/643fbb44ed544.jpg"],specs:"Sources: Cooperatives, Brand: Alpine, Weight: 200 Gram plus Extra 25Gram, Packet Bottle Packaging",shortDesc:"Premium CTC 200g + 25g extra — bottle pack, strong liquor, cooperative-sourced.",tags:["CTC","Alpine"],description:"Sources: Koshi cooperatives. Brand: Alpine. Weight 200g + 25g extra. Bottle packaging."},
  {id:10,title:"Alpine Swagatam Pure Mustard Oil 1 ltr.",category:"Consumable Goods",image:"https://thokupabhokta.coop.np/uploads/products/661904f13650b.jpg",gallery:["https://thokupabhokta.coop.np/uploads/products/661904f13650b.jpg"],specs:"Name: Mustard Oil, Quantity: 1 ltr., Source: Mustard Seed Farming Area: Hoklabari, 100% Pure Oil",shortDesc:"1 Ltr pure mustard oil — same Hoklabari single-origin purity in handy bottle.",tags:["Mustard Oil"],description:"Single-origin Hoklabari mustard seed, cold-pressed, 100% pure. 1 ltr bottle."},
];

const events = [
  {id:110,title:"सामाजिक उधमी महिला संजाल र थोक उपभोक्ता बीच ब्यवसायिक छलफल",date:"December 18, 2025",image:"https://thokupabhokta.coop.np/uploads/events/694438fd8e548.jpg",excerpt:"सामाजिक उधमी महिला संजाल नेपालको संस्थापक अध्यक्ष पार्वती न्यौपाने...",full:"सामाजिक उधमी महिला संजाल नेपालको संस्थापक अध्यक्ष पार्वती न्यौपाने, कार्यकारी निर्देशक बिष्णु कुमारी नेपाल लगायत AFO, CSO क्रमश कुमार श्रेष्ठ र कमल गौतम सर सङ्ग विशेष ब्यवसायिक छलफल साथै उधमशिलता प्रवर्द्धनमा आफ्नो ठाउँ बाट कस्तो भुमिका खेल्न सकिन्छ भनी एक चरण छलफल सम्पन्न गरियो ।"},
  {id:109,title:"चौथो वार्षिक साधारणसभा २०८१",date:"March 21, 2025",image:"https://thokupabhokta.coop.np/uploads/events/67dd5c930a75b.jpg",excerpt:"चौथो वार्षिक साधारणसभा २०८१ — सहकारी अभियानको प्रगति...",full:"मिति २०८१ साल माघ ३० गते बुधबार यस प्रदेश नं. १ थोक उपभोक्ता विशिष्टिकृत सहकारी संघ लिमिटेडको चौथो बार्षिक साधारण सभा..."},
  {id:108,title:"🌞 Introducing SUN Chips: A Healthier Snack Choice 🌞",date:"August 21, 2024",image:"https://thokupabhokta.coop.np/uploads/events/66c5c3e5e8407.jpg",excerpt:"We are thrilled to announce soft launch of SUN Chips...",full:"We are thrilled to announce the soft launch of SUN Chips—delicious and nutritious banana chips..."},
  {id:107,title:"Scratch & Win",date:"May 14, 2024",image:"https://thokupabhokta.coop.np/uploads/events/66430f0825779.jpg",excerpt:"Tea lovers — awesome surprises waiting in every Alpine Tea bag!",full:"Tea lovers, listen up! Did you know awesome surprises are waiting for you in every Alpine Tea bag? Get set to scratch and win..."},
  {id:105,title:"Nepali storyteller Mr. Saigrace Pokharel at Thok Upabhokta!",date:"May 05, 2024",image:"https://thokupabhokta.coop.np/uploads/events/6637209fa0303.jpg",excerpt:"Honored presence of storyteller Saigrace Pokharel...",full:"We had the immense pleasure of welcoming the dynamic Nepali storyteller, Mr. Saigrace Pokharel..."},
];

const reports = [
  {id:1,title:"AGM_Report_2081",publishedDate:"February 09, 2025",file:"https://thokupabhokta.coop.np/uploads/reports/Audit_Report_2080/81.pdf",size:"2.4 MB",type:"PDF"},
  {id:2,title:"Audit Report 2080/81",publishedDate:"February 09, 2025",file:"https://thokupabhokta.coop.np/uploads/reports/Audit_Report_2080/81.pdf",size:"2.4 MB",type:"PDF"},
  {id:3,title:"AGM_Report_2080",publishedDate:"January 18, 2024",file:"https://thokupabhokta.coop.np/uploads/reports/Audit_Report_2080/81.pdf",size:"3.1 MB",type:"PDF"},
  {id:4,title:"Audit Report 079-80",publishedDate:"January 18, 2024",file:"https://thokupabhokta.coop.np/uploads/reports/Audit_Report_2080/81.pdf",size:"3.1 MB",type:"PDF"},
  {id:5,title:"Audit Report 078-079",publishedDate:"March 12, 2023",file:"https://thokupabhokta.coop.np/uploads/reports/Audit_Report_2080/81.pdf",size:"2.8 MB",type:"PDF"},
  {id:6,title:"Audit Report 077-078",publishedDate:"March 12, 2023",file:"https://thokupabhokta.coop.np/uploads/reports/Audit_Report_2080/81.pdf",size:"2.7 MB",type:"PDF"},
];

async function seed() {
  console.log("Seeding Firestore for", cfg.projectId);
  const batch = writeBatch(db);
  for (const p of products) batch.set(doc(collection(db,"products"), String(p.id)), p);
  for (const e of events) batch.set(doc(collection(db,"events"), String(e.id)), e);
  for (const r of reports) batch.set(doc(collection(db,"reports"), String(r.id)), r);
  // add a sample of remaining events/products as placeholder to avoid empty
  await setDoc(doc(db,"siteInfo","main"), {name:"प्रदेश नं. १ थोक उपभोक्ता विशिष्टीकृत सहकारी संघ लिमिटेड", seededAt: new Date().toISOString()});
  await batch.commit();
  console.log(`Seeded ${products.length} products, ${events.length} events, ${reports.length} reports`);
}
seed().catch(e=>{console.error(e);process.exit(1)});
