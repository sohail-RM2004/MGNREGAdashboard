import prisma from "../prismaClient.js";

export const getDistrictsByState = async (req, res) => {
  try {
    const { stateCode } = req.params;
    const state = await prisma.state.findUnique({
      where: { stateCode },
      include: { districts: true }
    });
    if (!state) return res.status(404).json({ error: "State not found" });
    res.json(state.districts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch districts" });
  }
};
