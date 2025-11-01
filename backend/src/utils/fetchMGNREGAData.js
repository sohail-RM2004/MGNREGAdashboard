/**
 * fetchMGNREGAData:
 * - Fetches data from the external MGNREGA API (data.gov.in)
 * - Transforms records into our schema (state, district, performance)
 * - Upserts into DB via Prisma
 *
 * This script expects the API to return an array of tabular rows where each row has
 * the columns you listed earlier.
 *
 * NOTE: adjust the parsing logic to the exact API response structure.
 */

import axios from "axios";
import prisma from "../prismaClient.js";
import dotenv from "dotenv";
dotenv.config();

const API_URL = process.env.MGNREGA_API_URL;
const API_KEY = process.env.MGNREGA_API_KEY || "";

function normalizeRow(row) {
  return {
    finYear: row.fin_year || "",
    month: row.month || "",
    stateCode: String(row.state_code || "").trim(),
    stateName: row.state_name || "",
    districtCode: String(row.district_code || "").trim(),
    districtName: row.district_name || "",
    approvedLabourBudget: Number(row.Approved_Labour_Budget || 0),
    avgWageRatePerDayPerPerson: Number(row.Average_Wage_rate_per_day_per_person || 0),
    avgDaysOfEmploymentPerHH: Number(row.Average_days_of_employment_provided_per_Household || 0),
    differentlyAbledPersonsWorked: Number(row.Differently_abled_persons_worked || 0),
    materialAndSkilledWages: Number(row.Material_and_skilled_Wages || 0),
    completedWorks: Number(row.Number_of_Completed_Works || 0),
    gpsWithNilExp: Number(row.Number_of_GPs_with_NIL_exp || 0),
    ongoingWorks: Number(row.Number_of_Ongoing_Works || 0),
    persondaysCentralLiability: Number(row.Persondays_of_Central_Liability_so_far || 0),
    scPersondays: Number(row.SC_persondays || 0),
    scWorkersVsActiveWorkers: Number(row.SC_workers_against_active_workers || 0),
    stPersondays: Number(row.ST_persondays || 0),
    stWorkersVsActiveWorkers: Number(row.ST_workers_against_active_workers || 0),
    totalAdmExpenditure: Number(row.Total_Adm_Expenditure || 0),
    totalExp: Number(row.Total_Exp || 0),
    totalHHWorked: Number(row.Total_Households_Worked || 0),
    totalIndividualsWorked: Number(row.Total_Individuals_Worked || 0),
    totalActiveJobCards: Number(row.Total_No_of_Active_Job_Cards || 0),
    totalActiveWorkers: Number(row.Total_No_of_Active_Workers || 0),
    totalHHsCompleted100Days: Number(row.Total_No_of_HHs_completed_100_Days_of_Wage_Employment || 0),
    totalJobCardsIssued: Number(row.Total_No_of_JobCards_issued || 0),
    totalWorkers: Number(row.Total_No_of_Workers || 0),
    totalWorksTakenUp: Number(row.Total_No_of_Works_Takenup || 0),
    wages: Number(row.Wages || 0),
    womenPersondays: Number(row.Women_Persondays || 0),
    percentCategoryBWorks: Number(row.percent_of_Category_B_Works || 0),
    percentExpAgricultureAlliedWorks: Number(row.percent_of_Expenditure_on_Agriculture_Allied_Works || 0),
    percentNRMExpenditure: Number(row.percent_of_NRM_Expenditure || 0),
    percentPaymentsWithin15Days: Number(row.percentage_payments_gererated_within_15_days || 0)
  };
}

export default async function fetchMGNREGAData() {
  if (!API_URL) {
    console.warn("MGNREGA_API_URL not configured. Skipping fetch.");
    return;
  }

  try {
    const res = await axios.get(API_URL, {
      headers: API_KEY ? { "x-api-key": API_KEY } : {}
    });

    // adjust according to structure: assume data is res.data.records or res.data.data
    const rows = res.data.records || res.data.data || res.data || [];
    if (!Array.isArray(rows)) {
      console.error("Unexpected API response format", typeof rows);
      return;
    }

    for (const raw of rows) {
      const r = normalizeRow(raw);
      if (!r.districtCode) continue;

      // upsert state
      const state = await prisma.state.upsert({
        where: { stateCode: r.stateCode || r.stateName },
        update: { stateName: r.stateName || undefined },
        create: { stateCode: r.stateCode || r.stateName, stateName: r.stateName || r.stateCode }
      });

      // upsert district
      const district = await prisma.district.upsert({
        where: { districtCode: r.districtCode },
        update: { districtName: r.districtName, stateId: state.id },
        create: { districtCode: r.districtCode, districtName: r.districtName, stateId: state.id }
      });

      // upsert performance by unique (districtId + finYear + month) - Use findUnique substitute
      const existing = await prisma.performance.findFirst({
        where: { districtId: district.id, finYear: r.finYear, month: r.month }
      });

      const perfData = {
        finYear: r.finYear,
        month: r.month,
        approvedLabourBudget: r.approvedLabourBudget,
        avgWageRatePerDayPerPerson: r.avgWageRatePerDayPerPerson,
        avgDaysOfEmploymentPerHH: r.avgDaysOfEmploymentPerHH,
        differentlyAbledPersonsWorked: r.differentlyAbledPersonsWorked,
        materialAndSkilledWages: r.materialAndSkilledWages,
        completedWorks: r.completedWorks,
        gpsWithNilExp: r.gpsWithNilExp,
        ongoingWorks: r.ongoingWorks,
        persondaysCentralLiability: r.persondaysCentralLiability,
        scPersondays: r.scPersondays,
        scWorkersVsActiveWorkers: r.scWorkersVsActiveWorkers,
        stPersondays: r.stPersondays,
        stWorkersVsActiveWorkers: r.stWorkersVsActiveWorkers,
        totalAdmExpenditure: r.totalAdmExpenditure,
        totalExp: r.totalExp,
        totalHHWorked: r.totalHHWorked,
        totalIndividualsWorked: r.totalIndividualsWorked,
        totalActiveJobCards: r.totalActiveJobCards,
        totalActiveWorkers: r.totalActiveWorkers,
        totalHHsCompleted100Days: r.totalHHsCompleted100Days,
        totalJobCardsIssued: r.totalJobCardsIssued,
        totalWorkers: r.totalWorkers,
        totalWorksTakenUp: r.totalWorksTakenUp,
        wages: r.wages,
        womenPersondays: r.womenPersondays,
        percentCategoryBWorks: r.percentCategoryBWorks,
        percentExpAgricultureAlliedWorks: r.percentExpAgricultureAlliedWorks,
        percentNRMExpenditure: r.percentNRMExpenditure,
        percentPaymentsWithin15Days: r.percentPaymentsWithin15Days,
        districtId: district.id
      };

      if (existing) {
        await prisma.performance.update({
          where: { id: existing.id },
          data: perfData
        });
      } else {
        await prisma.performance.create({ data: perfData });
      }
    }
    console.log("✅ MGNREGA data sync completed: rows:", rows.length);
  } catch (err) {
    console.error("MGNREGA fetch failed:", err.message || err);
  }
}
