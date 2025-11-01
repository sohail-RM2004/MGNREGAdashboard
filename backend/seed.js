import prisma from './src/prismaClient.js';

async function seed() {
  try {
    // Create sample state
    const state = await prisma.state.upsert({
      where: { stateCode: 'AP' },
      update: {},
      create: {
        stateCode: 'AP',
        stateName: 'Andhra Pradesh'
      }
    });

    // Create sample district
    const district = await prisma.district.upsert({
      where: { districtCode: 'AP001' },
      update: {},
      create: {
        districtCode: 'AP001',
        districtName: 'Anantapur',
        stateId: state.id
      }
    });

    // Create sample performance data
    await prisma.performance.create({
      data: {
        finYear: '2023-24',
        month: 'March',
        districtId: district.id,
        totalIndividualsWorked: 15000,
        totalHHWorked: 8500,
        avgWageRatePerDayPerPerson: 250.0,
        avgDaysOfEmploymentPerHH: 45.5,
        completedWorks: 120,
        totalExp: 2500000.0,
        ongoingWorks: 25
      }
    });

    console.log('✅ Sample data seeded successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();