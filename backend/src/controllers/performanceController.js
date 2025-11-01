import prisma from "../prismaClient.js";
import { computeSummaryForRecord } from "../utils/analytics.js";

/**
 * Returns full performance history for a district
 */
export const getDistrictPerformance = async (req, res) => {
  try {
    const { districtCode } = req.params;
    const district = await prisma.district.findUnique({
      where: { districtCode },
      include: {
        performances: { orderBy: [{ finYear: "asc" }, { month: "asc" }] }
      }
    });
    if (!district) return res.status(404).json({ error: "District not found" });
    res.json({ district: { districtName: district.districtName }, data: district.performances });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch performance data" });
  }
};

/**
 * Returns comprehensive trend data for charts
 */
export const getDistrictTrend = async (req, res) => {
  try {
    const { districtCode } = req.params;
    const records = await prisma.performance.findMany({
      where: { district: { districtCode } },
      orderBy: [{ finYear: "asc" }, { month: "asc" }],
      include: { district: true }
    });
    
    const chartData = records.map(r => ({
      month: r.month,
      finYear: r.finYear,
      avgWage: r.avgWageRatePerDayPerPerson || 0,
      avgDays: r.avgDaysOfEmploymentPerHH || 0,
      totalExp: r.totalExp || 0,
      completedWorks: r.completedWorks || 0,
      ongoingWorks: r.ongoingWorks || 0,
      womenPersondays: r.womenPersondays || 0,
      scPersondays: r.scPersondays || 0,
      stPersondays: r.stPersondays || 0,
      totalIndividuals: r.totalIndividualsWorked || 0,
      paymentsWithin15Days: r.percentPaymentsWithin15Days || 0,
      differentlyAbled: r.differentlyAbledPersonsWorked || 0
    }));
    
    res.json(chartData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Trend fetch failed" });
  }
};

/**
 * Returns comprehensive district summary with analytics
 */
/**
 * Get state-wide statistics for comparison
 */
export const getStateStats = async (req, res) => {
  try {
    const { stateCode } = req.params;
    
    const stateData = await prisma.performance.groupBy({
      by: [],
      where: { 
        district: { 
          state: { stateCode } 
        } 
      },
      _avg: {
        avgWageRatePerDayPerPerson: true,
        avgDaysOfEmploymentPerHH: true,
        totalExp: true
      },
      _sum: {
        totalIndividualsWorked: true,
        totalHHWorked: true,
        completedWorks: true
      }
    });
    
    res.json(stateData[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "State stats fetch failed" });
  }
};

export const getDistrictSummary = async (req, res) => {
  try {
    const { districtCode } = req.params;
    
    // Get all records and sort them properly
    const allRecords = await prisma.performance.findMany({
      where: { district: { districtCode } },
      include: { district: { include: { state: true } } }
    });
    
    if (allRecords.length === 0) return res.status(404).json({ error: "No performance data" });
    
    // Sort by finYear and createdAt to get the truly latest record
    const latest = allRecords.sort((a, b) => {
      // First sort by finYear (2024-2025 > 2023-2024)
      if (a.finYear !== b.finYear) {
        return b.finYear.localeCompare(a.finYear);
      }
      // Then by creation date (most recent first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    })[0];
    

    
    // Calculate worker composition
    const totalPersondays = (latest.womenPersondays || 0) + (latest.scPersondays || 0) + (latest.stPersondays || 0);
    const otherPersondays = Math.max(0, (latest.persondaysCentralLiability || 0) - totalPersondays);
    
    const workerComposition = {
      women: ((latest.womenPersondays || 0) / (latest.persondaysCentralLiability || 1)) * 100,
      sc: ((latest.scPersondays || 0) / (latest.persondaysCentralLiability || 1)) * 100,
      st: ((latest.stPersondays || 0) / (latest.persondaysCentralLiability || 1)) * 100,
      others: (otherPersondays / (latest.persondaysCentralLiability || 1)) * 100
    };
    
    // Calculate expenditure breakdown
    const expenditureBreakdown = {
      wages: ((latest.wages || 0) / (latest.totalExp || 1)) * 100,
      material: ((latest.materialAndSkilledWages || 0) / (latest.totalExp || 1)) * 100,
      admin: ((latest.totalAdmExpenditure || 0) / (latest.totalExp || 1)) * 100,
      agriculture: latest.percentExpAgricultureAlliedWorks || 0,
      nrm: latest.percentNRMExpenditure || 0
    };
    
    const summary = computeSummaryForRecord(latest);
    
    res.json({ 
      latest, 
      summary, 
      workerComposition, 
      expenditureBreakdown,
      efficiency: {
        paymentsWithin15Days: latest.percentPaymentsWithin15Days || 0,
        categoryBWorks: latest.percentCategoryBWorks || 0,
        gpsWithNilExp: latest.gpsWithNilExp || 0
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Summary fetch failed" });
  }
};
