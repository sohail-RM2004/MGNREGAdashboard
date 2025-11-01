import fetchMGNREGAData from './src/utils/fetchMGNREGAData.js';

console.log('🚀 Starting MGNREGA data fetch...');
fetchMGNREGAData()
  .then(() => {
    console.log('✅ Data fetch completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Data fetch failed:', error);
    process.exit(1);
  });