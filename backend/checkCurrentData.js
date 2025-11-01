import prisma from './src/prismaClient.js';

async function checkCurrentData() {
  try {
    console.log('🔍 Checking current database records...\n');
    
    // Get all performance records with district info
    const records = await prisma.performance.findMany({
      include: { district: true },
      orderBy: [{ finYear: 'desc' }, { createdAt: 'desc' }]
    });
    
    console.log(`📊 Total records: ${records.length}\n`);
    
    // Group by finYear
    const byYear = records.reduce((acc, record) => {
      if (!acc[record.finYear]) acc[record.finYear] = [];
      acc[record.finYear].push(record);
      return acc;
    }, {});
    
    Object.keys(byYear).forEach(year => {
      console.log(`📅 ${year}: ${byYear[year].length} records`);
      
      // Show sample districts and months
      const districts = [...new Set(byYear[year].map(r => r.district.districtName))];
      const months = [...new Set(byYear[year].map(r => r.month))];
      
      console.log(`   Districts: ${districts.slice(0, 3).join(', ')}${districts.length > 3 ? '...' : ''}`);
      console.log(`   Months: ${months.join(', ')}`);
      console.log('');
    });
    
    // Show latest record details
    if (records.length > 0) {
      const latest = records[0];
      console.log('🔥 Latest record:');
      console.log(`   District: ${latest.district.districtName}`);
      console.log(`   Year: ${latest.finYear}, Month: ${latest.month}`);
      console.log(`   Total Individuals: ${latest.totalIndividualsWorked}`);
      console.log(`   Created: ${latest.createdAt}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentData();