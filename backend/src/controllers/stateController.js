import prisma from "../prismaClient.js";

export const getStates = async (req, res) => {
  try {
    const states = await prisma.state.findMany();
    res.json(states);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching states" });
  }
};
