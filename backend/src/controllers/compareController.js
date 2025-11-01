import prisma from "../prismaClient.js";

export const compareDistricts = async (req, res) => {
  try {
    const { districtA, districtB } = req.query;
    if (!districtA || !districtB) return res.status(400).json({ error: "Provide districtA and districtB" });

    const [a, b] = await Promise.all([
      prisma.performance.findMany({ where: { district: { districtCode: districtA } }, orderBy: [{ finYear: "desc" }, { month: "desc" }], take: 6 }),
      prisma.performance.findMany({ where: { district: { districtCode: districtB } }, orderBy: [{ finYear: "desc" }, { month: "desc" }], take: 6 })
    ]);
    res.json({ districtA: a, districtB: b });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Comparison failed" });
  }
};
