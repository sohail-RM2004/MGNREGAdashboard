import * as cron from "node-cron";
import fetchMGNREGAData from "./fetchMGNREGAData.js";
import dotenv from "dotenv";
dotenv.config();

export default function startCron() {
  const schedule = process.env.CRON_SCHEDULE || "0 2 1 * *"; // default 2 AM on 1st of month
  try {
    cron.schedule(schedule, async () => {
      console.log("Cron started: Fetching MGNREGA data...");
      await fetchMGNREGAData();
    });
    console.log(`Cron scheduled: ${schedule}`);
  } catch (err) {
    console.error("Failed to start cron:", err);
  }
}
