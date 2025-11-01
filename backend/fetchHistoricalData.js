import fetchMGNREGAData from './src/utils/fetchMGNREGAData.js';
import dotenv from 'dotenv';
dotenv.config();

// Historical data URLs for different years/periods
const historicalAPIs = [
  // 2023-24 data
  "https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722?api-key=579b464db66ec23bdd000001ffd86a8aa03448507629cd670be14f20&format=json&filters%5Bstate_name%5D=ANDHRA%20PRADESH&filters%5Bfin_year%5D=2023-2024",
  
  // 2022-23 data
  "https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722?api-key=579b464db66ec23bdd000001ffd86a8aa03448507629cd670be14f20&format=json&filters%5Bstate_name%5D=ANDHRA%20PRADESH&filters%5Bfin_year%5D=2022-2023",
  
  // 2021-22 data
  "https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722?api-key=579b464db66ec23bdd000001ffd86a8aa03448507629cd670be14f20&format=json&filters%5Bstate_name%5D=ANDHRA%20PRADESH&filters%5Bfin_year%5D=2021-2022",
  
  // Add more years as needed
];

async function fetchAllHistoricalData() {
  console.log('🚀 Starting historical data import...');
  
  for (let i = 0; i < historicalAPIs.length; i++) {
    console.log(`📅 Fetching data ${i + 1}/${historicalAPIs.length}...`);
    
    // Temporarily update the API URL
    process.env.MGNREGA_API_URL = historicalAPIs[i];
    
    try {
      await fetchMGNREGAData();
      console.log(`✅ Completed batch ${i + 1}`);
    } catch (error) {
      console.error(`❌ Failed batch ${i + 1}:`, error.message);
    }
    
    // Wait 2 seconds between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('🎉 Historical data import completed!');
}

fetchAllHistoricalData();