import prisma from './src/prismaClient.js';

async function checkData() {
  try {
    const states = await prisma.state.findMany();
    console.log('📍 States:', states);
    
    const districts = await prisma.district.findMany();
    console.log('🏘️ Districts:', districts);
    
    const performance = await prisma.performance.findMany({
      include: { district: true }
    });
    console.log('📊 Performance records:', performance.length);
    
    if (performance.length > 0) {
      console.log('🔍 Sample record:', {
        district: performance[0].district.districtName,
        totalIndividualsWorked: performance[0].totalIndividualsWorked,
        avgWageRate: performance[0].avgWageRatePerDayPerPerson,
        totalExp: performance[0].totalExp
      });
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();