import prisma from './src/prismaClient.js';

async function cleanup() {
  try {
    // Delete all existing data to start fresh
    await prisma.performance.deleteMany({});
    await prisma.district.deleteMany({});
    await prisma.state.deleteMany({});
    
    console.log('✅ Database cleaned up successfully');
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup();